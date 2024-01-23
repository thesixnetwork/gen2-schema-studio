'use client'

import { getSchemaInfo } from "@/service/getSchemaInfo";
// import { getOriginAttributFromContract } from "@/service/getOriginAttributFromContract";
import { useEffect, useState, useMemo } from "react";
// import { useSession } from "next-auth/react"
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
// import { IOriginAttributes } from "@/type/Nftmngr";
import { ISchemaInfo } from "@/type/Nftmngr";





export default function Page({
    params: { schemacode },
}: {
    params: { schemacode: string };
}) {

    const router = useRouter()
    const [isDaft, setIsDaft] = useState<ISchemaInfo | null>(null)
    const [schemaCode, setSchemaCode] = useState("")
    const [chainIndex, setChainIndex] = useState(0)
    const [originContractAddress, setOriginContractAddress] = useState("")
    const [chainTypeIndex, setChainTypeIndex] = useState(0)
    const [originBaseURI, setOriginBaseURI] = useState("")
    const [originChain, setOriginChain] = useState("FIVENET")
    const [isLoadingGetBaseURI, setIsLoadingGetBaseURI] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingSave, setIsLoadingSave] = useState(false)
    const [stepDraft, setStepDraft] = useState(1)
    const [onEdining, setOnEdining] = useState(true)


    const [chainMapper, _] = useState([
        {
            Chain: [
                {
                    chain: "FIVENET",
                    chain_id: "150"
                },
                {
                    chain: "SIXNET",
                    chain_id: "98"
                },
            ]
        },
        {
            Chain: [
                {
                    chain: "GOERLI",
                    chain_id: "5"
                },
                {
                    chain: "ETHEREUM",
                    chain_id: "1"
                },
            ]
        },
        {
            Chain: [
                {
                    chain: "BAOBAB",
                    chain_id: "1001"
                },
                {
                    chain: "KLAYTN",
                    chain_id: "8217"
                },
            ]
        },
        {
            Chain: [
                {
                    chain: "BNBT",
                    chain_id: "97"
                },
                {
                    chain: "BNB",
                    chain_id: "56"
                },
            ]
        }
    ])
    // console.log(chainMapper[chainIndex].Chain[chainTypeIndex].chain_id)
    // console.log(chainTypeIndex)
    useEffect(() => {
        (async () => {
            try {
                const schemaInfo = await getSchemaInfo(schemacode);
                // console.log(schemaInfo)
                setIsDaft(schemaInfo)
                return;
                // Process the response or update state as needed
            } catch (error) {
                // Handle errors
                console.error('Error fetching data:', error);
                return;
            }
        })();
    }, [schemacode]);



    const checkIndex = () => {
        if (originChain === "FIVENET") {
            setChainTypeIndex(0)
            setChainIndex(0)
        } else if (originChain === "GOERLI") {
            setChainTypeIndex(0)
            setChainIndex(1)
        } else if (originChain === "BAOBAB") {
            setChainTypeIndex(0)
            setChainIndex(2)
        } else if (originChain === "BNBT") {
            setChainTypeIndex(0)
            setChainIndex(3)
        } else if (originChain === "SIXNET") {
            setChainTypeIndex(1)
            setChainIndex(0)
        } else if (originChain === "ETHEREUM") {
            setChainTypeIndex(1)
            setChainIndex(1)
        } else if (originChain === "KLAYTN") {
            setChainTypeIndex(1)
            setChainIndex(2)
        } else if (originChain === "BNB") {
            setChainTypeIndex(1)
            setChainIndex(3)
        }
    }



    useEffect(() => {
        const getDraftInfo = () => {
            if (isDaft) {
                // console.log("isDaft:", isDaft);
                setOriginChain(isDaft.schema_info.origin_data.origin_chain)
                setSchemaCode(isDaft.schema_info.code);
                setOriginBaseURI(isDaft.schema_info.origin_data.origin_base_uri);
                setOriginContractAddress(isDaft.schema_info.origin_data.origin_contract_address);
                setStepDraft(isDaft.current_state);
                setIsLoading(false)
            }
        };

        getDraftInfo(); // Call the function on mount
        checkIndex();

        return () => {
            // Cleanup or unsubscribe if needed
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDaft]);


    const handleInputChangeChaChainIndex = (value: number) => {
        setChainIndex(value);
    };

    const handleInputChangeOriginContractAddress = (value: string) => {
        setOriginContractAddress(value);
    };

    const handleInputChangeChainTypeIndex = (value: number) => {
        setChainTypeIndex(value);
        // console.log(chainTypeIndex)
    };

    const handleInputChangeOriginBaseURI = (value: string) => {
        setOriginBaseURI(value);
    };

    const save_state2 = async () => {
        setIsLoading(true)
        setIsLoadingSave(true)
        // let origin_attributes_form_contract 
        // const new_origin_attribute = await get_origin_attributes_form_contract(originContractAddress);
        // console.log("originContractAddress",originContractAddress)
        // console.log("originBaseURI",originBaseURI)
        const saveState2_status = await saveState2(originContractAddress, originBaseURI, schemacode, chainMapper[chainIndex].Chain[chainTypeIndex].chain)
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

    // console.log(chainTypeIndex)
    useEffect(() => {

        (async () => {
            try {
                setIsLoadingGetBaseURI(true)
                const origin_base_URI = await getBaseURI(originContractAddress, chainMapper[chainIndex].Chain[chainTypeIndex].chain_id)
                // console.log("base_uri", chainMapper[chainIndex].Chain[chainTypeIndex].chain_id)
                if (typeof origin_base_URI !== 'string') {
                    setOriginBaseURI("")
                } else {
                    setOriginBaseURI(origin_base_URI)
                }
                setIsLoadingGetBaseURI(false)
                return;
            } catch (error) {
                // Handle errors
                console.error('Error fetching data:', error);
                setIsLoadingGetBaseURI(false)
                return;
            }
        })();
    }, [originContractAddress, chainTypeIndex, chainIndex, chainMapper])



    useEffect(() => {
        if (chainTypeIndex === 0) {
            if (chainIndex === 0) {
                setOriginChain("FIVENET")
            } else if (chainIndex === 1) {
                setOriginChain("GOERLI")
            } else if (chainIndex === 2) {
                setOriginChain("BAOBAB")
            } else if (chainIndex === 3) {
                setOriginChain("BNBT")
            }
        } else {
            if (chainIndex === 0) {
                setOriginChain("SIXNET")
            } else if (chainIndex === 1) {
                setOriginChain("ETHEREUM")
            } else if (chainIndex === 2) {
                setOriginChain("KLAYTN")
            } else if (chainIndex === 3) {
                setOriginChain("BNB")
            }
        }

    }, [chainTypeIndex, chainIndex])

    const memoizedIsDaft = useMemo(() => isDaft, [isDaft]);

    useEffect(() => {
        if (memoizedIsDaft) {
            setOnEdining(
                (memoizedIsDaft.schema_info.origin_data.origin_chain === originChain) &&
                (memoizedIsDaft.schema_info.origin_data.origin_base_uri === originBaseURI) &&
                (memoizedIsDaft.schema_info.origin_data.origin_contract_address === originContractAddress)
            );
        }
    }, [memoizedIsDaft, originChain, originBaseURI, originContractAddress]);


    return (
        <>
            {isLoading && <Loading></Loading>}
            <div className=" w-full h-full min-h-[110vh] flex flex-col justify-between items-center pb-4 ">
                <Stepmenu schemacode={schemaCode} currentStep={2} schemacodeNavigate={schemacode} stepDraft={stepDraft} onEditing={!onEdining}></Stepmenu>
                <InputChainTypeCard title={"Origin Chain"} require={true} chainIndex={chainIndex} onChangeChainIndex={handleInputChangeChaChainIndex} ></InputChainTypeCard>
                <InputCardOneLineLarge title={"Origin Contract Address"} require={false} placeholder={"0x40df0C834CE7549e9234D11525aD1f7E7CF48E88"} validate={true} errorMassage={""} value={originContractAddress} onChange={handleInputChangeOriginContractAddress} loading={isLoadingGetBaseURI}></InputCardOneLineLarge>
                <InputToggleCard title={"Chain Type"} require={true} chainIndex={chainTypeIndex} onChangeChainIndex={handleInputChangeChainTypeIndex}></InputToggleCard>

                <InputCardOneLineLarge title={"Origin Base URI"} require={false} placeholder={"https://ipfs.whalegate.sixprotocol.com/ipfs/Qmd9FJGWveLd1g6yZTDDNjxruVppyDtaUzrA2pkb2XAf8R/"} validate={true} errorMassage={""} value={originBaseURI} onChange={handleInputChangeOriginBaseURI} loading={false}></InputCardOneLineLarge>
                <div className=' w-[90%]  flex justify-between items-center'>
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