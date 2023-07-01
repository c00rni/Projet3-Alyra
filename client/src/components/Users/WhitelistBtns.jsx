import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setProposition }) {
  const { state: { contract, accounts } } = useEth();
  const [textInput, setTextInput]=useState("text");

  const handleTextChange = e => {
    setTextInput(e.target.value);
  };

  const writeText = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (textInput === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newProposal = textInput;
    await contract.methods.addProposal(newProposal).send({ from: accounts[0] });
  };

  return (
    <div className="btns">

      <div onClick={writeText} className="input-btn">
        setProposal(<input
          type="text"
          placeholder="Desc"
          value={textInput}
          onChange={handleTextChange}
        />)
      </div>

    </div>
  );
}

export default ContractBtns;
