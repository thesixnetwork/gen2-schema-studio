'use client'

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
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { getBaseURI } from "@/service/getBaseURI";



export default function Page({
    params: { schemacode },
}: {
    params: { schemacode: string };
}) {
    const { data: session } = useSession()

    const router = useRouter()
    const [isDaft, setIsDaft] = useState(null)
    const [schemaCode, setSchemaCode] = useState("")
    const [chainIndex, setChainIndex] = useState(0)
    const [originContractAddress, setOriginContractAddress] = useState("")
    const [chainTypeIndex, setChainTypeIndex] = useState(1)
    const [originBaseURI, setOriginBaseURI] = useState("")
    const [isLoadingGetBaseURI, setIsLoadingGetBaseURI] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingSave, setIsLoadingSave] = useState(false)
    const [stepDraft, setStepDraft] = useState(1)

    useEffect(() => {
        (async () => {
            try {
                const schemaInfo = await getSchemaInfo(schemacode);
                console.log(schemaInfo)
                setIsDaft(schemaInfo)
                setIsLoading(false)
                // Process the response or update state as needed
            } catch (error) {
                // Handle errors
                console.error('Error fetching data:', error);
            }
        })();
    }, [schemacode]);

    useEffect(() => {
        const getDraftInfo = () => {
            if (isDaft !== "" && isDaft !== null) {
                console.log("isDaft:", isDaft);
                setSchemaCode(isDaft.schema_info.code);
                setOriginBaseURI(isDaft.schema_info.origin_data.origin_base_uri);
                setOriginContractAddress(isDaft.schema_info.origin_data.origin_contract_address);
                setStepDraft(isDaft.current_state);
            }
        };
    
        getDraftInfo(); // Call the function on mount
    
        return () => {
            // Cleanup or unsubscribe if needed
        };
    }, [isDaft]);


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
        setIsLoadingSave(true)
        const saveState2_status = await saveState2(originContractAddress, originBaseURI, schemacode)
        console.log("saveState1_status :", saveState2_status)
        router.push(`/newdraft/3/${schemacode}`, { scroll: false })
        setIsLoadingSave(false)
    }

    const backPage = () => {
        // if (originBaseURI !== "" || originContractAddress !== "") {
        //     alert("You are working")
        // } else {
        router.push(`/newdraft/1/${schemacode}`, { scroll: false })
        // }
    }

    useEffect(() => {

        (async () => {
            try {
                setIsLoadingGetBaseURI(true)
                const origin_base_URI = await getBaseURI(originContractAddress)
                console.log("base_uri", origin_base_URI)
                if (typeof origin_base_URI !== 'string') {
                    setOriginBaseURI("")
                } else {
                    setOriginBaseURI(origin_base_URI)
                }
                setIsLoadingGetBaseURI(false)
            } catch (error) {
                // Handle errors
                console.error('Error fetching data:', error);
                setIsLoadingGetBaseURI(false)
            }
        })();
    }, [originContractAddress])



    return (
        <>
            {isLoading && <Loading></Loading>}
            <div className=" w-full h-full min-h-[110vh] flex flex-col justify-between items-center ">
                <Stepmenu schemacode={schemaCode} currentStep={2} schemacodeNavigate={schemacode} stepDraft={stepDraft}></Stepmenu>
                <InputChainTypeCard title={"Origin Chain"} require={true} chainIndex={chainIndex} onChangeChainIndex={handleInputChangeChaChainIndex} ></InputChainTypeCard>
                <InputCardOneLineLarge title={"Origin Contract Address"} require={false} placeholder={"0x898bb3b662419e79366046C625A213B83fB4809B"} validate={true} errorMassage={""} value={originContractAddress} onChange={handleInputChangeOriginContractAddress} loading={isLoadingGetBaseURI}></InputCardOneLineLarge>
                <InputToggleCard title={"Chain Type"} require={true} chainIndex={chainTypeIndex} onChangeChainIndex={handleInputChangeChainTypeIndex}></InputToggleCard>
                <InputCardOneLineLarge title={"Origin Base URI"} require={false} placeholder={"https://ipfs.whalegate.sixprotocol.com/ipfs/Qmd9FJGWveLd1g6yZTDDNjxruVppyDtaUzrA2pkb2XAf8R/"} validate={true} errorMassage={""} value={originBaseURI} onChange={handleInputChangeOriginBaseURI} loading={false}></InputCardOneLineLarge>
                <div className=' w-[90%] h-20 flex justify-between items-center'>
                    <div onClick={backPage}>
                        <BackPageButton></BackPageButton>
                    </div>
                    <div onClick={save_state2}>
                        <NextPageButton loading={isLoadingSave}></NextPageButton>
                    </div>
                </div>
            </div>
        </>
    );
}