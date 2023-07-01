import useEth from "../../contexts/EthContext/useEth";
import React, { useState } from "react";
/*
function UserComp() {
  const { state: { contract, accounts } } = useEth();
  const [addressVoter, setVoter] = useState("");

  const handleRegristrationTextChange = e => {
    setVoter(e.target.value);
  };

  useEffect(() => {
    // Fetch the contract data
    if (contract) {
      getContractData();
    }
  }, [contract]);

  const getContractData = async () => {
    try {
      const winningProposalId = await contract.methods.winningProposalID().call();
      setWinningProposalID(winningProposalId);

      const workflowStatus = await contract.methods.workflowStatus().call();
      setWorkflowStatus(workflowStatus);

      const proposalsCount = await contract.methods.proposalsArray.length().call();
      const proposals = [];
      for (let i = 0; i < proposalsCount; i++) {
        const proposal = await contract.methods.getOneProposal(i).call();
        proposals.push(proposal);
      }
      setProposalsArray(proposals);
    } catch (error) {
      console.error(error);
    }
  };

  const registerVoter = async () => {
    try {
      await contract.methods.registerVoter().send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  const startProposalsRegistering = async () => {
    try {
      await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  const endProposalsRegistering = async () => {
    try {
      await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  const startVotingSession = async () => {
    try {
      await contract.methods.startVotingSession().send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  const endVotingSession = async () => {
    try {
      await contract.methods.endVotingSession().send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  const tallyVotes = async () => {
    try {
      await contract.methods.tallyVotes().send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  const vote = async () => {
    try {
      await contract.methods.setVote(voteProposalId).send({ from: accounts[0] });
      // Handle success or dispatch an action
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Voting Page</h2>
      <p>Workflow Status: {workflowStatus}</p>
      <p>Winning Proposal ID: {winningProposalID}</p>

      <button onClick={registerVoter}>Register Voter</button>
      <button onClick={startProposalsRegistering}>Start Proposals Registering</button>
      <button onClick={endProposalsRegistering}>End Proposals Registering</button>
      <button onClick={startVotingSession}>Start Voting Session</button>
      <button onClick={endVotingSession}>End Voting Session</button>
      <button onClick={tallyVotes}>Tally Votes</button>

      <h3>Proposals:</h3>
      <ul>
        {proposalsArray.map((proposal, index) => (
          <li key={index}>{proposal.description}</li>
        ))}
      </ul>

      <h3>Vote:</h3>
      <input
        type="text"
        placeholder="Enter Proposal ID"
        value={voteProposalId}
        onChange={(e) => setVoteProposalId(e.target.value)}
      />
      <button onClick={vote}>Vote</button>
    </div>
  );
}

export default UserComp;
*/