'use client'

import TapState from "@/components/TapState";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react"
import BackPageButton from "@/components/BackPageButton";
import NextPageButton from "@/components/NextPageButton";
import InputChainTypeCard from "@/components/state2/InputChainTypeCard";
import InputCardOneLineLarge from "@/components/state2/InputCardOneLineLarge";
import InputToggleCard from "@/components/state2/InputToggleCard";
import { saveState2 } from "@/postDataService/saveState2";
import Stepmenu from "@/components/Stepmenu";



export default function Page({
    params: { schemacode },
}: {
    params: { schemacode: string };
}) {
    const { data: session } = useSession()

    const [isDaft, setIsDaft] = useState(null)
    const [chainIndex, setChainIndex] = useState(0)
    const [originContractAddress, setOriginContractAddress] = useState("")
    const [chainTypeIndex, setChainTypeIndex] = useState(1)
    const [originBaseURI, setOriginBaseURI] = useState("")
    const [validate, setValidate] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")


    useEffect(() => {
        (async () => {
            try {
                const schemaInfo = await getSchemaInfo(schemacode);
                console.log(schemaInfo)
                setIsDaft(schemaInfo)
                // Process the response or update state as needed
            } catch (error) {
                // Handle errors
                console.error('Error fetching data:', error);
            }
        })();
    }, [schemacode]);

    const getDraftInfo = () => {
        if (isDaft !== "") {
            console.log("isDaft:", isDaft)
        }
    }

    useEffect(() => {
        getDraftInfo()
    }, [isDaft])

    const handleInputChangeChaChainIndex = (value: number) => {
        setChainIndex(value);
    };

    const handleInputChangeOriginContractAddress = (value: string) => {
        setOriginContractAddress(value);
    };

    const handleInputChangeChainTypeIndex = (value: number) => {
        setChainTypeIndex(value);
        console.log(chainTypeIndex)
    };

    const handleInputChangeOriginBaseURI = (value: string) => {
        setOriginBaseURI(value);
    };


    const save_state2 = async () => {
        const saveState2_status = await saveState2(originContractAddress, originBaseURI, schemacode)
        console.log("saveState1_status :", saveState2_status)
    }



    return (
        <>
            <div className=" w-full h-full min-h-[100vh] flex flex-col justify-between items-center">
               <Stepmenu schemacode={schemacode} currentStep={2}></Stepmenu>
                <InputChainTypeCard title={"Origin Chain"} require={true} chainIndex={chainIndex} onChangeChainIndex={handleInputChangeChaChainIndex} ></InputChainTypeCard>
                <InputCardOneLineLarge title={"Origin Contract Address"} require={false} placeholder={"0x898bb3b662419e79366046C625A213B83fB4809B"} validate={true} errorMassage={""} value={originContractAddress} onChange={handleInputChangeOriginContractAddress}></InputCardOneLineLarge>
                <InputToggleCard title={"Chain Type"} require={true} chainIndex={chainTypeIndex} onChangeChainIndex={handleInputChangeChainTypeIndex}></InputToggleCard>
                <InputCardOneLineLarge title={"Origin Base URI"} require={false} placeholder={"https://ipfs.whalegate.sixprotocol.com/ipfs/Qmd9FJGWveLd1g6yZTDDNjxruVppyDtaUzrA2pkb2XAf8R/"} validate={true} errorMassage={""} value={originBaseURI} onChange={handleInputChangeOriginBaseURI}></InputCardOneLineLarge>
                <div className=' w-[90%] h-20 flex justify-between items-center'>
                    <BackPageButton></BackPageButton>
                    <div onClick={save_state2}>
                        <NextPageButton></NextPageButton>
                    </div>
                </div>
            </div>
        </>
    );
}

