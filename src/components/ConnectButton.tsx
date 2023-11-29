'use client';

import React from 'react'
import { useEffect, useState } from "react";
import { StargateClient } from "@cosmjs/stargate";
import axios from 'axios'
import { saveCosmosAddress, getCosmosAddress, saveBalanceCoin, saveTokensToLocalStorage } from '../helpers/AuthService'

type Props = {}

function ConnectButton({ }: Props) {
    const [chainId, setChainId] = useState("fivenet");
    const [token, setToken] = useState("usix");
    const [cosmosAddress, setCosmosAddress] = useState("");
    const [rpcEndpoint, setRpcEndpoint] = useState<string>(
        process.env.NEXT_APP_RPC1_ENDPOINT_SIX_FIVENET || "default-fallback-value"
    );
    const message = process.env.NEXT_PUBLIC__SIGN_MESSAGE
    const [exponent, setExponent] = useState(1e6);

    // Extend the Window interface with the 'keplr' property
    interface Window {
        keplr: any; // Adjust the type based on what 'keplr' provides
    }

    const buttonHandlerKeplrConnect = async () => {
        if (window.keplr) {
            // Unlock the wallet.
            await window.keplr.enable(chainId);
            // Use offlineSigner to get first wallet and public key.
            // Currently only first address is supported.
            const offlineSigner = await window.getOfflineSigner(chainId);
            const keplrAccounts = await offlineSigner.getAccounts();
            // Set state value as first address.
            saveCosmosAddress(keplrAccounts[0].address)
            setCosmosAddress(keplrAccounts[0].address)
            console.log("Keplr connect :", keplrAccounts[0].address)
        } else {
            alert("Keplr extension is not installed.");
        }
    };

    //Get balance
    const getKeplrBalance = async () => {
        // const address = getCosmosAddress()?.toString()
        // Use StargateClient and RPC because of its lightweight payloads and high performance.
        const client = await StargateClient.connect(rpcEndpoint);
        // Get balance as Coin.
        const cosmosAddress = getCosmosAddress();
        if (cosmosAddress !== null) {
            const client = await StargateClient.connect(rpcEndpoint);
            const balanceAsCoin = await client.getBalance(cosmosAddress, token);
            const balance = (parseInt(balanceAsCoin.amount) * 1) / exponent;
            saveBalanceCoin(balance.toFixed(2));
            console.log(balance.toFixed(2));
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

    const loginApi = async () => {
        const offlineSigner = window.getOfflineSigner(chainId);
        const keplrAccounts = await offlineSigner.getAccounts();
        // console.log("KEPL ADREESS :" + keplrAccounts[0].address);
        // console.log("gust")
        const signedMessage = await offlineSigner.keplr.signArbitrary(
            chainId,
            cosmosAddress,
            message
        );
        // DB request
        const apiUrl = `${process.env.NEXT_PUBLIC__API_ENDPOINT_SCHEMA_INFO}auth/login`; // Replace with your API endpoint
        const requestData = {
            "channel": "Keply",
            "ssoID": `${keplrAccounts[0].address}`,
            "messagge": message,
            "signature": `${signedMessage.signature}`
        };
        await axios.post(apiUrl, requestData, {
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
                // Add any other headers your API requires
            },
        })
            .then(response => {
                saveTokensToLocalStorage(response.data.data.access_token, response.data.data.refresh_token);
                console.log(response.data.data.access_token, response.data.data.refresh_token)
                // You can handle the API response here
            })
            .catch(error => {
                console.error('API Error:', error);
                // Handle errors here
            });
    }

    useEffect(() => {
        getKeplrBalance();
        getSignature();
        loginApi();
        ;
    }, [cosmosAddress])

    return (
        <div
            onClick={buttonHandlerKeplrConnect}
            className=' flex justify-center items-center border rounded-lg border-Act7 w-64  h-12 hover:scale-125 duration-500 cursor-pointer '>
            <p className='text-Act7 text-4xl font-light '>CONNECT</p>
        </div>
    )
}

export default ConnectButton

declare global {
    interface Window {
        keplr: any; // 👈️ turn off type checking
        getOfflineSigner: any;
    }
}
