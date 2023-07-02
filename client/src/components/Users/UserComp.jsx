import useEth from "../../contexts/EthContext/useEth";
import React, { useState, useEffect} from "react";

function UserComp() {
  const { state: { contract, accounts } } = useEth();
  const [proposalDescription, setProposal] = useState("");
  const [voteSoumis, setVoteId] = useState("");
  const [proposalEvents, setEventValue] = useState([]);
  const [propositionGagnante, setPropositionGagante] = useState("Pas encore de gagnant");

  const [WorkflowEvent, setWorkflowEvent] = useState();

  const status = ["RegisteringVoters",
  "ProposalsRegistrationStarted",
  "ProposalsRegistrationEnded",
  "VotingSessionStarted",
  "VotingSessionEnded",
  "VotesTallied"];

  const handleTextChangeProposition = e => {
    setProposal(e.target.value);
  };

  const handleVoteChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setVoteId(e.target.value);
    }
  };

  useEffect(() => {
    (async function () {

       let oldProposalEvents= await contract.getPastEvents('ProposalRegistered', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        let oldiEventProposal=[];
        oldProposalEvents.forEach(event => {
          oldiEventProposal.push({id: event.returnValues.proposalId, description: event.returnValues.description});
        });
        setEventValue(oldiEventProposal);

        // Get Events

        let oldWorkflowEvents= await contract.getPastEvents('WorkflowStatusChange', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        let oldiEventWorkflow = status[0];
        oldWorkflowEvents.forEach(event => {
          oldiEventWorkflow = status[event.returnValues.newStatus];
        });
        setWorkflowEvent(oldiEventWorkflow);

        // Get Gagnant

        let gagantAnnoncer= await contract.getPastEvents('WinnerAnnonced', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        let oldiEventWinner;
        gagantAnnoncer.forEach(event => {
          oldiEventWinner = event.returnValues.proposal;
        });
        setPropositionGagante(oldiEventWinner);
  
        await contract.events.WinnerAnnonced({fromBlock:"earliest"})
        .on('data', event => {
          let WinnerAnnonced = event.returnValues.proposal;
          setPropositionGagante(WinnerAnnonced);
        })

    })();
  })

  useEffect(() => {
    (async function () {
        let oldiEventProposal=[];
 
        await contract.events.ProposalRegistered({fromBlock:"latest"})
        .on('data', event => {
          oldiEventProposal.push({id: event.returnValues.proposalId, description: event.returnValues.description});
          setEventValue(oldiEventProposal);
        })

        // Vote

        await contract.events.Voted({fromBlock:"latest"})
        .on('data', event => {
          alert(`Vote accepté pour la proposition ${event.returnValues.proposalId}`);
        })

        // Get Events

        await contract.events.WorkflowStatusChange({fromBlock:"latest"})
        .on('data', event => {
          let lesevents = status[event.returnValues.newStatus];
          setWorkflowEvent(lesevents);
        })

        // Get Gagnant  
        await contract.events.WinnerAnnonced({fromBlock:"latest"})
        .on('data', event => {
          let WinnerAnnonced = event.returnValues.proposal;
          setPropositionGagante(WinnerAnnonced);
        })
    })();
  }, [contract])

  const registerProposal = async () => {
    try {
      await contract.methods.addProposal(proposalDescription).send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  const vote = async () => {
    try {
      await contract.methods.setVote(voteSoumis).send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 class="display-5">Voting Page </h2>
      <hr />
      <h3 class="display-5">Le status du vote est :{WorkflowEvent}</h3>
      <br />
      <div class="input-group input-group-lg">
        <div class="input-group-prepend">
          <button onClick={registerProposal}><span class="input-group-text" id="inputGroup-sizing-lg">Proposer</span></button>
        </div>
        <input 
            type="text" 
            class="form-control" 
            aria-label="Sizing example input" 
            aria-describedby="inputGroup-sizing-lg"
            placeholder="Description de la proposition"
            value={proposalDescription}
            onChange={handleTextChangeProposition}            />
          </div>
          <br />
      {/* <button onClick={registerProposal}>Proposer</button>
      <input
        type="text"
        placeholder="Description de la proposition"
        value={proposalDescription}
        onChange={handleTextChangeProposition}
      /> */}

      {/* <h3 class="display-5">Proposals:</h3>
      <ul>
        {proposalEvents.map((event) => (
          <li key={event.id}>ID:{event.id} - {event.description}</li>
        ))}
      </ul> */}

      <h3 class="display-5">Vote:</h3>
      <div class="input-group input-group-lg">
        <div class="input-group-prepend">
          <button onClick={vote}><span class="input-group-text" id="inputGroup-sizing-lg">voter</span></button>
        </div>
        <input 
            type="text" 
            class="form-control" 
            aria-label="Sizing example input" 
            aria-describedby="inputGroup-sizing-lg"
            placeholder="Chiosissez votre proposition"
            value={voteSoumis}
            onChange={handleVoteChange}            />
          </div>
          <br />
      
      {/* <button onClick={vote}>Vote</button>
      <input
        type="text"
        placeholder="Enter Proposal ID"
        value={voteSoumis}
        onChange={handleVoteChange}
      /> */}
      <h3 class="display-5">Proposals:</h3>
      <br />
      <ul>
        {proposalEvents.map((event) => (
          <li key={event.id}>ID:{event.id} - {event.description}</li>
        ))}
      </ul>
       <h3 class="display-5">Le gagnant est :</h3>
       <input 
            type="text" 
            class="form-control" 
            aria-label="Sizing example input" 
            aria-describedby="inputGroup-sizing-lg"
            placeholder="Le nom du gagnant"
            value={propositionGagnante}
                      />
       
      
    </div>
  );
}

export default UserComp;
