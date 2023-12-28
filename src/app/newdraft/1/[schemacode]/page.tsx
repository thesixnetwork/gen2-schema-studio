'use client'

import TapState from "@/components/TapState";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react"
import InputCardOneLine from "@/components/state1/InputCardOneLine";
import BackPageButton from "@/components/BackPageButton";
import NextPageButton from "@/components/NextPageButton";
import { uppercaseTest, spaceTest, specialCharsTest } from "@/validateService/validate";
import { findSchemaCode } from "@/validateService/findSchemaCode";
import { createSchemaCode } from "@/postDataService/createSchemaCode";
import { editSchemaCode } from "@/postDataService/editSchemaCode";
import SaveButton from "@/components/button/SaveButton";
import Loading from "@/components/Loading";
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@chakra-ui/react'
import Stepmenu from "@/components/Stepmenu";


export default function Page({
    params: { schemacode },
}: {
    params: { schemacode: string };
}) {
    const router = useRouter()
    const { data: session } = useSession()
    console.log(session)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingFindSchemaCode, setIsLoadingFindSchemaCode] = useState(false)
    const [isDaft, setIsDaft] = useState(null)
    const [schemaCode, setSchemaCode] = useState("")
    const [collectionName, setCollectionName] = useState("")
    const [description, setDescription] = useState("")
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
        if (isDaft !== null) {
            console.log("isDaft:", isDaft)
            setSchemaCode(isDaft.schema_info.code)
            setCollectionName(isDaft.schema_info.name)
            setDescription(isDaft.schema_info.description)
        }
    }

    useEffect(() => {
        getDraftInfo()
    }, [isDaft])
    // const isDaft = await getSchemaInfo(schemacode);
    // console.log(JSON.stringify(isDaft, null, 2));

    const handleInputChangeSchemaCode = (value: string) => {
        setSchemaCode(value);
    };

    const handleInputChangeCollectionName = (value: string) => {
        setCollectionName(value);
    };

    const handleInputChangeDescription = (value: string) => {
        setDescription(value);
    };

    const validateSchemaCode = async () => {
        setIsLoadingFindSchemaCode(true)
        const findSchemaCodeStatus = await findSchemaCode(schemaCode)
        console.log("findSchemaCodeStatus :", findSchemaCodeStatus)
        if (uppercaseTest(schemaCode) || spaceTest(schemaCode) || specialCharsTest(schemaCode) || (!findSchemaCodeStatus && schemaCode !== "")) {
            setValidate(false)
        } else {
            setValidate(true)
        };

        if (uppercaseTest(schemaCode)) {
            setErrorMessage("Uppercase is not allowed")
        } else if (spaceTest(schemaCode)) {
            setErrorMessage("Space is not allowed")
        } else if (specialCharsTest(schemaCode)) {
            setErrorMessage("Special characters is not allowed")
        } else if (!findSchemaCodeStatus && schemaCode !== "") {
            setErrorMessage("Schema code is Duplicate")
        }
        else {
            setErrorMessage("");
        }
        setIsLoadingFindSchemaCode(false)
    }


    useEffect(() => {
        validateSchemaCode()
    }, [schemaCode])

    const create_SchemaCode = async () => {
        const createSchemaCodeStatus = await createSchemaCode(schemaCode, collectionName, description)
        console.log("createSchemaCodeStatus", createSchemaCodeStatus)
    }

    const edit_schemaCode = async () => {
        const editSchemaCodeStatus = await editSchemaCode(schemacode, schemaCode, collectionName, description)
        console.log(editSchemaCodeStatus)
    }

    const nextPage = async () => {
        setIsLoading(true)
        if (schemacode === "newintegration") {
            if (schemaCode !== "" && validate) {
                await create_SchemaCode()
                router.push(`/newdraft/2/${schemaCode}_v1`, { scroll: false })
            } else {
                validateNextPage()
            }

        } else {
            await edit_schemaCode()
            router.push(`/newdraft/2/${schemaCode}_v1`, { scroll: false })
        }
        setIsLoading(false)
    }

    const validateNextPage = () => {
        if (schemaCode === "") {
            setValidate(false)
            setErrorMessage("Not Availible")
        } else {
            setValidate(true)
            setErrorMessage("")
        }
    }

    const backPage = () => {
        // if (schemaCode !== "" || collectionName !== "" || description !== "") {
        //     alert("You are working")
        // } else {
        //     router.push(`/aboutgen2`, { scroll: false })
        // }

        if (schemacode === "newintegration") {
            router.push(`/aboutgen2`, { scroll: false })
        } else {
            router.push(`/home`, { scroll: false })
        }
    }


    return (
        <>
            {/* {isLoading && <Loading></Loading>} */}
            <div className=" w-full h-full min-h-[75vh] flex flex-col justify-between items-center">
                <Stepmenu schemacode={schemacode} currentStep={1}></Stepmenu>
                <InputCardOneLine title={"Schema code"} require={true} placeholder={"sixnetwork.whalegate"} validate={validate} errorMassage={errorMessage} value={schemaCode} onChange={handleInputChangeSchemaCode} loading={isLoadingFindSchemaCode}></InputCardOneLine>
                <InputCardOneLine title={"Collection name"} require={false} placeholder={"WHALEGATE"} validate={true} errorMassage={""} value={collectionName} onChange={handleInputChangeCollectionName} loading={false} ></InputCardOneLine>
                <InputCardOneLine title={"Description"} require={false} placeholder={"WhaleGate Gen2 NFT With SIX"} validate={true} errorMassage={""} value={description} onChange={handleInputChangeDescription} loading={false} ></InputCardOneLine>
                <div className=' w-[90%] h-20 flex justify-between items-center'>
                    <div onClick={backPage}>
                        <BackPageButton></BackPageButton>
                    </div>
                    <div onClick={nextPage}>
                        <NextPageButton></NextPageButton>
                    </div>
                </div>
            </div>
        </>
    );
}

