import CryptoJS from "crypto-js";
import _ from "lodash"


// cryptoService.--------------------------------------------------------

const secretKey = process.env.NEXT_PUBLIC__SECRET_KEY || "default-fallback-value";

export const encryptWithAES = (text: string) => {
  if (text === undefined) {
    // Handle the case where text is undefined, maybe throw an error or return some default value
    throw new Error("Text is undefined");
  }

  const cipherText = CryptoJS.AES.encrypt(text, secretKey).toString();
  return cipherText;
};

// export const decryptWithAES = (cipherText :string) => {
//   const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
//   const originalText = bytes.toString(CryptoJS.enc.Utf8);
//   return originalText;
// };

// export const encryptWithAES = (text: string, key: string) => {
//   return CryptoJS.AES.encrypt(text, key).toString();
// };

export const decryptWithAES = (ciphertext: string) => {
  if (_.isEmpty(ciphertext) === false) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } else {
    return ciphertext;
  }
};

// localStorageService.--------------------------------------------------------

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ORIGIN_CONTRACT_ADDRESS = 'origin_contract_address';
const SCHEMA_CODE = "SCHEMA_CODE";
const ACTION_NAME = "";
const COSMOS_ADDRESS = "COSMOS_ADDRESS";
const BALANCE_COIN = "BALANCE_COIN"


export const saveBalanceCoin = (BalanceCoin: string) => {
  localStorage.setItem(BALANCE_COIN, BalanceCoin);
};

export const clearBalanceCoin = () => {
  localStorage.removeItem(BALANCE_COIN);
};

export const getBalanceCoin = () => {
  // return localStorage.getItem(BALANCE_COIN)
};

export const saveCosmosAddress = (CosmosAddress: string) => {
  localStorage.setItem(COSMOS_ADDRESS, CosmosAddress);
};

export const clearCosmosAddress = () => {
  localStorage.removeItem(COSMOS_ADDRESS);
};

export const getCosmosAddress = () => {
  // return localStorage.getItem(COSMOS_ADDRESS)
};


export const saveTokensToLocalStorage = (accessToken: string, refreshToken: string) => {
  const encryptedAccessToken = encryptWithAES(accessToken);
  const encryptedRefreshToken = encryptWithAES(refreshToken);
  localStorage.setItem(ACCESS_TOKEN_KEY, encryptedAccessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, encryptedRefreshToken);
};

export const saveActionName = (ActionName: string) => {
  localStorage.setItem(ACTION_NAME, ActionName);
};

export const getActionName = () => {
  // return localStorage.getItem(ACTION_NAME)
};

export const saveOriginContractAddressToLocalStorage = (OriginContractAddress: string) => {
  localStorage.setItem(ORIGIN_CONTRACT_ADDRESS, OriginContractAddress);
}

export const getOriginContractAddressFromLocalStorage = () => {
  // return localStorage.getItem(ORIGIN_CONTRACT_ADDRESS)
}

export const clearOriginContractAddressFromLocalStorage = () => {
  localStorage.removeItem(ORIGIN_CONTRACT_ADDRESS);
};

export const saveSCHEMA_CODE = (schema_code: string) => {
  localStorage.setItem(SCHEMA_CODE, schema_code);
}

export const getSCHEMA_CODE = () => {
  return localStorage.getItem(SCHEMA_CODE)
}

export const clearSCHEMA_CODE = () => {
  localStorage.removeItem(SCHEMA_CODE);
};

export const getAccessTokenFromLocalStorage = () => {
  const encryptedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  return encryptedAccessToken ? decryptWithAES(encryptedAccessToken) : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  const encryptedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  return encryptedRefreshToken ? decryptWithAES(encryptedRefreshToken) : null;
};

export const clearTokensFromLocalStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// authService.------------------------------------------------------------------------------------


