import useEth from "../../contexts/EthContext/useEth";
import React, { useState, useEffect} from "react";

function UserComp() {
  const { state: { contract, accounts } } = useEth();
  const [proposalDescription, setProposal] = useState("");
  const [voteSoumis, setVoteId] = useState("");
  const [proposalEvents, setEventValue] = useState([]);
  const [propositionGagnante, setPropositionGagante] = useState("PAS ENCORE DE GAGNANT");

  const status = ["RegisteringVoters",
  "ProposalsRegistrationStarted",
  "ProposalsRegistrationEnded",
  "VotingSessionStarted",
  "VotingSessionEnded",
  "VotesTallied"];

  const [WorkflowEvent, setWorkflowEvent] = useState("RegisteringVoters");

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
 
        await contract.events.ProposalRegistered({fromBlock:"earliest"})
        .on('data', event => {
          oldiEventProposal.push({id: event.returnValues.proposalId, description: event.returnValues.description});
          setEventValue(oldiEventProposal);
        })          
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))

        // Vote

        let oldVoteEvents= await contract.getPastEvents('Voted', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        oldVoteEvents.forEach(event => {
          setVoteId(event.returnValues.proposalId);
        });

        await contract.events.Voted({fromBlock:"earliest"})
        .on('data', event => {
          setVoteId(event.returnValues.proposalId);
        })          
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))

        // Get Events

        let oldWorkflowEvents= await contract.getPastEvents('WorkflowStatusChange', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        let oldiEventWorkflow;
        oldWorkflowEvents.forEach(event => {
          oldiEventWorkflow = event.returnValues.newStatus;
        });
        setWorkflowEvent(oldiEventWorkflow);
  
        await contract.events.WorkflowStatusChange({fromBlock:"earliest"})
        .on('data', event => {
          let lesevents = event.returnValues.newStatus;
          setWorkflowEvent(lesevents);
        })          
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))

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
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))

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
      <h2>Voting Page (Stratus:{status[WorkflowEvent]})</h2>

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
