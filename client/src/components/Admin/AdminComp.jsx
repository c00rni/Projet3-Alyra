import useEth from "../../contexts/EthContext/useEth";
import React, { useState } from "react";

function AdminComp() {
  const { state: { contract, accounts } } = useEth();
  const [addressVoter, setVoter] = useState("");

  const handleRegristrationTextChange = e => {
    setVoter(e.target.value);
  };

  const registerVoter = async () => {
    try {
      await contract.methods.addVoter(addressVoter).send({from: accounts[0]});
      console.log(addressVoter);
      // Dispatch an action or update state if needed
    } catch (err) {
      console.error(err);
    }
  };

  const startProposalsRegistering = async () => {
    try {
      await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
      // Dispatch an action or update state if needed
    } catch (err) {
      console.error(err);
    }
  };

  const endProposalsRegistering = async () => {
    try {
      await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
      // Dispatch an action or update state if needed
    } catch (err) {
      console.error(err);
    }
  };

  const startVotingSession = async () => {
    try {
      await contract.methods.startVotingSession().send({ from: accounts[0] });
      // Dispatch an action or update state if needed
    } catch (err) {
      console.error(err);
    }
  };

  const endVotingSession = async () => {
    try {
      await contract.methods.endVotingSession().send({ from: accounts[0] });
      // Dispatch an action or update state if needed
    } catch (err) {
      console.error(err);
    }
  };

  const tallyVotes = async () => {
    try {
      await contract.methods.tallyVotes().send({ from: accounts[0] });
      // Dispatch an action or update state if needed
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Admin panel</h1>
      <button onClick={registerVoter}>Register Voter</button>
      <input
        type="text"
        placeholder="address"
        onChange={handleRegristrationTextChange}
      /><br></br>
      <button onClick={startProposalsRegistering}>Start Proposals Registration</button><br></br>
      <button onClick={endProposalsRegistering}>End Proposals Registration</button><br></br>
      <button onClick={startVotingSession}>Start Voting Session</button><br></br>
      <button onClick={endVotingSession}>End Voting Session</button><br></br>
      <button onClick={tallyVotes}>Tally Votes</button><br></br>
    </div>
  );
}

export default AdminComp;
