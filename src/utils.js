import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";
import axios, { post, get } from "axios";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: ["getGreeting"],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ["setGreeting"],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

const generate_id = () => {
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += Math.floor(Math.random() * 10).toString();
  }
  return id;
};

function after_rename(file, newName) {
  const new_file = new File([file], newName, { type: file.type });
  return new_file;
}

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

const renameBeforeUpload = (files) => {
  const name = files[0].name;
  const dotIndex = name.lastIndexOf(".");
  const new_file = after_rename(
    files[0],
    insert(name, dotIndex, generate_id())
  );

  console.log("new_file", new_file);

  return new_file;
};

const UPLOAD_IMAGE = "https://admin.deviot.vn/api/root/UPLOAD_IMAGE";

export const uploadImage = async (files) => {
  console.log("files", files);
  const url = `${UPLOAD_IMAGE}`;
  const formData = new FormData();
  formData.append("image", renameBeforeUpload(files));
  const config = {
    headers: {
      "content-type": "multipart/form-data",
      // Authorization: `Bearer ${authHeader()}`,
    },
  };
  const res = await post(url, formData, config);
  console.log("res", res);
  const response = res.data;
  if (response.status) {
    return response.result.url;
  }
  return "";
};
