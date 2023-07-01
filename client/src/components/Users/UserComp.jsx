import useEth from "../../contexts/EthContext/useEth";
import React, { useState, useEffect} from "react";

function UserComp() {
  const { state: { contract, accounts } } = useEth();
  const [proposalDescription, setProposal] = useState("");
  const [voteSoumis, setVoteId] = useState("");
  const [proposalEvents, setEventValue] = useState([]);
  const [propositionGagnante, setPropositionGagante] = useState("PAS ENCORE DE GAGNANT");

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
      <h2>Voting Page (Status:{WorkflowEvent})</h2>

      <button onClick={registerProposal}>Proposer</button>
      <input
        type="text"
        placeholder="Description de la proposition"
        value={proposalDescription}
        onChange={handleTextChangeProposition}
      />

      <h3>Proposals:</h3>
      <ul>
        {proposalEvents.map((event) => (
          <li key={event.id}>ID:{event.id} - {event.description}</li>
        ))}
      </ul>

      <h3>Vote:</h3>
      <button onClick={vote}>Vote</button>
      <input
        type="text"
        placeholder="Enter Proposal ID"
        value={voteSoumis}
        onChange={handleVoteChange}
      />
       <h3>Gagnant:{propositionGagnante}</h3>
      
    </div>
  );
}

export default UserComp;
