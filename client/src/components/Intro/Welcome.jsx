import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Welcome() {
  const { state: { contract } } = useEth();
  
  const status = ["RegisteringVoters",
  "ProposalsRegistrationStarted",
  "ProposalsRegistrationEnded",
  "VotingSessionStarted",
  "VotingSessionEnded",
  "VotesTallied"];
  
  const [EventValue, setEventValue] = useState("");
  
  useEffect(() => {
    (async function () {
 
       let oldWorkflowEvents= await contract.getPastEvents('WorkflowStatusChange', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        let oldiEventWorkflow;
        oldWorkflowEvents.forEach(event => {
          oldiEventWorkflow = event.returnValues.newStatus;
        });
        setEventValue(oldiEventWorkflow);
 
        await contract.events.WorkflowStatusChange({fromBlock:"earliest"})
        .on('data', event => {
          let lesevents = event.returnValues.newStatus;
          setEventValue(lesevents);
        })          
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))
    })();
  }, [contract])

  return (
    <div className="welcome">
      <h1>Projet Voting (Stratus:{status[EventValue]})</h1>
    </div>
  );
}

export default Welcome;
