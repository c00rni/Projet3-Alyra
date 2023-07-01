import useEth from "../../contexts/EthContext/useEth";
import React, { useState, useEffect} from "react";

function UserComp() {
  const { state: { contract, accounts } } = useEth();
  const [proposalDescription, setProposal] = useState("");
  const [voteSoumis, setVoteId] = useState("");
  const [proposalEvents, setEventValue] = useState([]);

  const handleTextChangeProposition = e => {
    setProposal(e.target.value);
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

        let oldVoteEvents= await contract.getPastEvents('ProposalRegistered', {
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
      <h2>Voting Page</h2>

      <button onClick={registerProposal}>Proposer</button>
      <input
        type="text"
        placeholder="Description de la proposition"
        onChange={(e) => handleTextChangeProposition(e.target.value)}
      />

      <h3>Proposals:</h3>
      <ul>
        {proposalEvents.map((event) => (
          <li key={event.id}>{event.description}</li>
        ))}
      </ul>

      <h3>Vote:</h3>
      <input
        type="text"
        placeholder="Enter Proposal ID"
        onChange={(e) => setVoteId(e.target.value)}
      />
      <button onClick={vote}>Vote</button>
    </div>
  );
}

export default UserComp;
