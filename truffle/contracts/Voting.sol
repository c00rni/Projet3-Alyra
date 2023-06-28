// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title Processu de vote décentraliser
/// @author Alyra
/// @notice Ce contrat peut être utilisé pour administrer un processu de vote et participer à un vote
contract Voting is Ownable {
    /// @notice enregistre l'identifiant du
    uint public winningProposalID;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    /// @notice Structure de donnée d'une proposition de vote
    struct Proposal {
        string description;
        uint voteCount;
    }

    /// @notice Noms des etats d'un vote
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    /// @dev Status actuel du contrat
    WorkflowStatus public workflowStatus;

    /// @notice Liste des propositions soumissent pour voter
    Proposal[] proposalsArray;

    /// @notice Accoccie les addresses publique des votants au information enregistrés sur la blockchain
    mapping(address => Voter) voters;

    /// @notice Evenement emit aprés un vote
    /// @param voterAddress Renvoie l'adresse publique du votant
    event VoterRegistered(address voterAddress);

    /// @notice Evenement emit après un changement de status du contrat
    /// @param previousStatus Status precedent
    /// @param newStatus Nouveau status
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    /// @notice Evenement emit après l'enregistrement d'une proposition
    /// @param proposalId identifiant de la proposition
    event ProposalRegistered(uint proposalId);

    /// @notice Evenement emit après l'enregistrement d'un vote
    /// @param voter L'adresse public du votant
    /// @param proposalId Identifiant de la proposition
    event Voted(address voter, uint proposalId);

    /// @notice Verifie que l'utilisateur est bien un votant enregistrer
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Recupère la structure donnée d'un votant enregistrer
    /// @param _addr Adresse publique
    /// @return Voter Structure de donnée "Voter"
    function getVoter(
        address _addr
    ) external view onlyVoters returns (Voter memory) {
        return voters[_addr];
    }

    /// @notice Récupère la structure de donnée d'un votant engistrer
    /// @param _id Identifiant d'une proposition
    /// @return Proposal La structure de donnée d'une proposition
    function getOneProposal(
        uint _id
    ) external view onlyVoters returns (Proposal memory) {
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //

    /// @notice Enregistre l'adresse publique d'un votant
    /// @param _addr Adresse publique
    /// @dev L'utiilsateur doit être le createur du contrat
    function addVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    /// @notice Enregistre une propisition qui pourra être voter
    /// @param _desc Decription de la proposition
    /// @dev L'utiisateur doit avoir une adresses publique enregistrer
    function addProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        ); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /// @notice Permet au votant de définir leurs vote
    /// @param _id L'identfiant d'une proposition enregistrer
    /// @dev L'utiisateur doit avoir une adresses publique enregistrer
    /// @dev L'identifiant de propisition doit être enregistrer
    function setVote(uint _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        if (
            proposalsArray[_id].voteCount >
            proposalsArray[winningProposalID].voteCount
        ) {
            winningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /// @notice Debut de la phase d'enregistremetn des propositions à voter
    /// @dev L'adresse publique de l'utilisateur être celle de l'administrateur
    /// @dev Le status precedent doit être la phase d'enregistrement de votants
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    /// @notice Fin de la phase d'enregistremetn des propositions à voter
    /// @dev L'adresse publique de l'utilisateur être celle de l'administrateur
    /// @dev Le status precedent doit être la phase d'enregistrement des propositions de vote
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    /// @notice Debut de la phase d'enregistrement des votes
    /// @dev L'adresse publique de l'utilisateur être celle de l'administrateur
    /// @dev Le status precedent doit être la phase de fin d'enregistrement des votes
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    /// @notice Fin de la phase d'enregistrement des votes
    /// @dev L'adresse publique de l'utilisateur être celle de l'administrateur
    /// @dev Le status precedent doit être la phase d'enregistrement de votes
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    /// @notice Debut de la phase de dépoullement
    /// @dev L'adresse publique de l'utilisateur être celle de l'administrateur
    /// @dev Le status precedent doit être la phase de fin d'enregistrement des votes
    function tallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Current status is not voting session ended"
        );
        uint _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (
                proposalsArray[p].voteCount >
                proposalsArray[_winningProposalId].voteCount
            ) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }
}
