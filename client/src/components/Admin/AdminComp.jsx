import useEth from "../../contexts/EthContext/useEth";
import React, { useState, useEffect } from "react";

function AdminComp() {
  const { state: { contract, accounts } } = useEth();
  const [addressVoter, setVoter] = useState("");
  const [addressRegistered, setRegistrationEvents] = useState([]);

  let votants=[];

  useEffect(() => {
    (async function () {

        await contract.events.VoterRegistered({fromBlock:"earliest"})
        .on('data', event => {
          votants.push({adresse: event.returnValues.voterAddress});
          setRegistrationEvents(votants);
        })          
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))
    })();
  }, [contract])
  
  useEffect(() => {
    (async function () {
      votants=[];
       let oldEvents= await contract.getPastEvents('VoterRegistered', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        oldEvents.forEach(event => {
          votants.push({adresse: event.returnValues.voterAddress});
        });
        setRegistrationEvents(votants);
    })();
  })

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
      <h3>Adresses enregistrer:</h3>
      <ul>
        {addressRegistered.map((votant) => (
          <li key={votant.adresse}>{votant.adresse}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminComp;
