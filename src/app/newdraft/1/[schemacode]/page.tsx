'use client'

import TapState from "@/components/TapState";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react"
import InputCardOneLine from "@/components/InputCardOneLine";
import BackPageButton from "@/components/BackPageButton";
import NextPageButton from "@/components/NextPageButton";
import { uppercaseTest, spaceTest, specialCharsTest } from "@/validateService/validate";
import { findSchemaCode } from "@/validateService/findSchemaCode";
import { createSchemaCode } from "@/postDataService/createSchemaCode";


export default function Page({
    params: { schemacode },
}: {
    params: { schemacode: string };
}) {
    const { data: session } = useSession()
    console.log(session)

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
        if (uppercaseTest(schemaCode) || spaceTest(schemaCode) || specialCharsTest(schemaCode)) {
            setValidate(false)
        } else {
            setValidate(true)
        };

        if (uppercaseTest(schemaCode)) {
            setErrorMessage("Uppercase is not allowed")
        } else if (spaceTest(schemaCode)) {
            setErrorMessage("Space is not allowed")
        } else if (specialCharsTest(schemaCode)) {
            setErrorMessage("Special characters i not allowed")
        } else {
            setErrorMessage("");
            const findSchemaCodeStatus = await findSchemaCode(schemaCode)
            console.log(findSchemaCode)
            if (findSchemaCodeStatus) {
                setErrorMessage("Schema code is Duplicate")
                setValidate(false)
            }
        }
    }

    useEffect(() => {
        validateSchemaCode()
    }, [schemaCode])

    const create_SchemaCode = async () => {
        const createSchemaCodeStatus = await createSchemaCode(schemaCode, collectionName, description)
        console.log("createSchemaCodeStatus",createSchemaCodeStatus)
    }

    return (
        <>
            <div className=" w-full h-full min-h-[75vh] flex flex-col justify-between items-center">
                <TapState isCurren={5} schemaCode={schemacode} />
                <InputCardOneLine title={"Schema code"} require={true} placeholder={"sixnetwork.whalegate"} validate={validate} errorMassage={errorMessage} value={schemaCode} onChange={handleInputChangeSchemaCode}></InputCardOneLine>
                <InputCardOneLine title={"Collection name"} require={false} placeholder={"WHALEGATE"} validate={true} errorMassage={""} value={collectionName} onChange={handleInputChangeCollectionName} ></InputCardOneLine>
                <InputCardOneLine title={"Description"} require={false} placeholder={"WhaleGate Gen2 NFT With SIX"} validate={true} errorMassage={""} value={description} onChange={handleInputChangeDescription} ></InputCardOneLine>
                <div className=' w-[90%] h-20 flex justify-between items-center'>
                    <BackPageButton></BackPageButton>
                    <div onClick={create_SchemaCode}>
                        <NextPageButton></NextPageButton>
                    </div>
                </div>
            </div>
        </>
    );
}

