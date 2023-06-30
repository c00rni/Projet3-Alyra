import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Welcome() {
  const [EventValue, setEventValue] = useState("");
  
  const { state: { contract } } = useEth();
  const status = ["RegisteringVoters",
    "ProposalsRegistrationStarted",
    "ProposalsRegistrationEnded",
    "VotingSessionStarted",
    "VotingSessionEnded",
    "VotesTallied"];


  useEffect(() => {
    (async function () {
 
       let oldEvents= await contract.getPastEvents('WorkflowStatusChange', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        let oldie;
        oldEvents.forEach(event => {
            oldie = status[event.returnValues.newStatus];
        });
        setEventValue(oldie);
 
        await contract.events.valueChanged({fromBlock:"earliest"})
        .on('data', event => {
          let lesevents = status[event.returnValues.newStatus];
          setEventValue(lesevents);
        })          
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))
    })();
  }, [contract])

  return (
    <div className="welcome">
      <h1>Projet Voting (Stratus:{EventValue})</h1>
    </div>
  );
}

export default Welcome;
