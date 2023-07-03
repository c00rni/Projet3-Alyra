# Projet3-Alyra

Application decentraliser permetant d'administrer et particier à un vote.

## To-do list

- [x] Créer un github pour le projet
- [x] Commenter le smartContrat en natspec
- [x] Corriger la faille DOS gas limit
- [x] Optimisation du contrat grace au evenement
- [ ] Realiser le front en React
  - [x] Créer les composants de l'administrateur
  - [x] Créer les composants des votants
  - [ ] Afficher les compostant des votants s'ils sont l'adresses publique de l'uitilisateur est valide
  - [ ] Afficher les compostant de l'administreur si l'adresse publique de l'uitilisateur est valide
  - [x] Afficher tous les propositions enregistrer grace aux events
  - [x] Afficher tous les votant enregistrer grace aux events
  - [x] Travaille l'esthétique du front
- [x] Faire une video de presentation de l'applicaiton de 5 mins sur ganache
- [] Deployer l'application sur un réseau de test
- [x] Faire un readme contenenant un lien vers l'application deploiyé et la video

## Installation

First ensure you are in an empty directory.

```sh
# Install depedencies
$ cd truffle
$ npm install
$ cd ..
```

Start ganach.

```sh
# lanch ganache in a new terminal
$ ganache
```

Start the react dev server.

```sh
$ cd client
$ npm install
$ npm start
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `SimpleStorage` contract, making calls to it, and sending transactions to change the contract's state.

## Video

https://www.loom.com/share/6a5788a32df84e0daa46f87ac311e88e