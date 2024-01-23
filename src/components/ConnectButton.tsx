"use client";

import React from "react";
import { Dispatch,SetStateAction,useEffect, useState } from "react";
import { StargateClient } from "@cosmjs/stargate";
import axios from "axios";
import {
  saveCosmosAddress,
  getCosmosAddress,
  saveBalanceCoin,
  saveTokensToLocalStorage,
} from "../helpers/AuthService";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

import { setCookie } from "@/service/setCookie";
import { signIn } from "next-auth/react";
interface Props {
    setLoading: Dispatch<SetStateAction<boolean>>;
}

function ConnectButton(props:Props) {
  const [chainId, setChainId] = useState(process.env.NEXT_PUBLIC_CHAIN_NAME);
  const [token, setToken] = useState("usix");
  const [balance, setBalance] = useState(0);
  const [cosmosAddress, setCosmosAddress] = useState("");
  const [rpcEndpoint, setRpcEndpoint] = useState<string>(
    process.env.NEXT_PUBLIC__RPC2_ENDPOINT_SIX_FIVENET ||
      "default-fallback-value"
  );
  const message = process.env.NEXT_PUBLIC__SIGN_MESSAGE;
  const [exponent, setExponent] = useState(1e6);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const { update: UpdateSession, data: session } = useSession();
  // console.log(session)

  // Extend the Window interface with the 'keplr' property
  interface Window {
    keplr: any; // Adjust the type based on what 'keplr' provides
  }

  const handlerKeplrConnect = async () => {
    if (window.keplr) {
      // Unlock the wallet.
      await window.keplr.enable(chainId);
      // Use offlineSigner to get first wallet and public key.
      // Currently only first address is supported.
      const offlineSigner = await window.getOfflineSigner(chainId);
      const keplrAccounts = await offlineSigner.getAccounts();
      // Set state value as first address.
      await getKeplrBalance2(keplrAccounts[0].address);
      saveCosmosAddress(keplrAccounts[0].address);
      setCosmosAddress(keplrAccounts[0].address);
      // await UpdateSession({address:keplrAccounts[0].address})
      console.log("Keplr connect :", keplrAccounts[0].address);
    } else {
      alert("Keplr extension is not installed.");
    }
  };

  //Get balance
  const getKeplrBalance = async () => {
    // const cosmosAddress = getCosmosAddress();
    if (cosmosAddress !== null) {
      console.log(cosmosAddress);
      const client = await StargateClient.connect(rpcEndpoint);
      console.log(client);
      const balanceAsCoin = await client.getBalance(cosmosAddress, token);
      const balance = (parseInt(balanceAsCoin.amount) * 1) / exponent;
      saveBalanceCoin(balance.toFixed(2));
      console.log(balance.toFixed(2));
    } else {
      console.error("Cosmos address is null.");
      // Handle the case where cosmosAddress is null, maybe show an error message or take appropriate action.
    }
  };
  const getKeplrBalance2 = async (address: string) => {
    if (address) {
      const client = await StargateClient.connect(rpcEndpoint);
      const balanceAsCoin = await client.getBalance(address, token);
      const balance = (parseFloat(balanceAsCoin.amount) * 1) / exponent;
      setBalance(balance);
      console.log(balance);
    } else {
      console.error("Cosmos address is null.");
      // Handle the case where cosmosAddress is null, maybe show an error message or take appropriate action.
    }
  };

  const getSignature = async () => {
    if (cosmosAddress) {
      try {
        const offlineSigner = window.getOfflineSigner(chainId);
        const signedMessage = await offlineSigner.keplr.signArbitrary(
          chainId,
          cosmosAddress,
          message
        );
        // console.log(signedMessage.signature);
        // console.log(signedMessage.pub_key);
        const verified = await offlineSigner.keplr.verifyArbitrary(
          chainId,
          cosmosAddress,
          message,
          signedMessage
        );
        console.log("verified= ", verified);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // const handdleAccount = async () => {
  //     if (cosmosAddress && session) {
  //         await UpdateSession({address:cosmosAddress})
  //         session.user = {
  //             ...session.user,
  //             address: '123456',
  //           };
  //         // session.user = "33"


  //         console.log('Session updated with address:', updatedSession);

  //     }
  // };

  const loginApi = async () => {
    const offlineSigner = window.getOfflineSigner(chainId);
    const keplrAccounts = await offlineSigner.getAccounts();
    // console.log("KEPL ADREESS :" + keplrAccounts[0].address);
    console.log("gust");
    const signedMessage = await offlineSigner.keplr.signArbitrary(
      chainId,
      cosmosAddress,
      message
    );
    // DB request
    const apiUrl = `${process.env.NEXT_PUBLIC__API_ENDPOINT_SCHEMA_INFO}auth/login`; // Replace with your API endpoint
    const requestData = {
      channel: "Keply",
      ssoID: `${keplrAccounts[0].address}`,
      messagge: message,
      signature: `${signedMessage.signature}`,
    };
    await axios
      .post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          // Add any other headers your API requires
        },
      })
      .then(async (response) => {
        saveTokensToLocalStorage(
          response.data.data.access_token,
          response.data.data.refresh_token
        );
        setCookie("token", `Bearer ${response.data.data.access_token}`);
        await signIn("credentials", {
          redirect: false, // Do not redirect, handle redirection manually after signing in
          accessToken: response.data.data.access_token,
          address: cosmosAddress,
          balance: balance,
        });
        localStorage.setItem("time_out", Math.floor(Date.now()/1000 + 1400).toString());
        router.push("/home");
        props.setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        // Handle errors here
        props.setLoading(false);
      });
  };

  useEffect(() => {
    getKeplrBalance();
    getSignature();
    loginApi();
  }, [cosmosAddress]);

  const handleConnect = async () => {
    handlerKeplrConnect();
    props.setLoading(true);
  };

  return (
    <>
    {loading && <Loading />}
      <div
        onClick={handleConnect}
        className=" flex justify-center items-center border rounded-lg border-Act7 w-64  h-12 hover:scale-125 duration-500 cursor-pointer "
      >
        <p className="text-Act7 text-4xl font-light ">CONNECT</p>
      </div>
    </>
  );
}

export default ConnectButton;

declare global {
  interface Window {
    keplr: any; // 👈️ turn off type checking
    getOfflineSigner: any;
  }
}
