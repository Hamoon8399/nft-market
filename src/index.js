import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import getConfig from "./config.js";
import * as nearAPI from "near-api-js";
// import getConfig from "./config"

window.nearConfig = getConfig(process.env.NODE_ENV || "development");
// Initializing contract
async function initContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || "testnet");

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  window.near = await nearAPI.connect(
    Object.assign(
      {
        deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() },
      },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR TestNet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletAccount = new nearAPI.WalletAccount(window.near);

  // Getting the Account ID. If unauthorized yet, it's just empty string.
  window.accountId = window.walletAccount.getAccountId();

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  // Initializing our contract APIs by contract name and configuration
  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: [
        "getNfts",
        "getExchanges",
        "getByOwner",
        "getTransactions",
        "getByCreatedBy",
        "getByUser",
        "getByToken",
      ],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ["mintNft", "updateNFT", "buyNFT"],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: walletConnection.getAccountId(),
    }
  );

  return { contract, currentUser, nearConfig, walletConnection };
}

window.nearInitPromise = initContract().then(
  ({ contract, currentUser, nearConfig, walletConnection }) => {
    ReactDOM.render(
      <App
        contract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={walletConnection}
      />,
      document.getElementById("root")
    );
  }
);
