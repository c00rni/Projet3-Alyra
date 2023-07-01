import useEth from "../../contexts/EthContext/useEth";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import AdminComp from "./AdminComp";


function Admin() {
  const { state } = useEth();

  const voter =
    <>
        <AdminComp />
    </>;

  return (
    <div className="demo">
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            voter
      }
    </div>
  );
}

export default Admin;
