# Buzzhub

## Introduction
[Buzzhub](https://buzzhub.space) is a front-end social application based on the MetaID protocol and running on the MVC blockchain. You can think of it as a simplified version of [Show3](https://www.show3.io).

The purpose of this project is to demonstrate to developers how to quickly build an on-chain application using the MetaID SDK.

## MetaID SDK Overview
Metaid SDK is a library that aims to act as a data management middleware for interacting with the Microvision Chain and MetaID protocol. Specifically, it primarily handles the generation, association, and management of user data based on the MetaID protocol. Also, It is responsible for the on-chain storage of user data, which includes building the underlying UTXO transaction model, signatures, and broadcasting.

As a result, with Metaid SDK,developers won't need to worry about the complexities of the underlying blockchain model. Instead, they can focus their development efforts on the business layer.That is to say, developers can build a  complicated blockchain project as easily as a traditional CRUD project, significantly improving their development efficiency.


## How to run?
1. clone this project
```
git clone https://github.com/MetaID-Labs/buzzhub.git
```
2. At your local terminal, cd to the project directory,install the dependencies and run the project 
```
cd buzzhub && yarn && yarn dev
```



 
