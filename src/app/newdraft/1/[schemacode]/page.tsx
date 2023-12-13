'use client'

import TapState from "@/components/TapState";
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    Text,
    Flex,
    FormControl,
    FormLabel,
    useToast,
} from "@chakra-ui/react";

import { getSchemaInfo } from "@/service/getSchemaInfo";
import CradNewDaft from "@/components/CardNewDaft";
import { ISchemaInfo } from "@/type/Nftmngr";
import { useEffect, useState, useRef, use } from "react";
import Stepmenu from "@/components/Stepmenu";
import { getAccessTokenFromLocalStorage } from "@/helpers/AuthService";


export default function Page({
    params: { schemacode },
}: {
    params: { schemacode: string };
}) {
    const [isDraft, setIsDraft] = useState(null)
    useEffect(() => {
        const getIsDraft = async () => {
            const draft = await getSchemaInfo(schemacode, getAccessTokenFromLocalStorage());
            setIsDraft(draft)
        }
    }, [])

    return (
        <>
            {isDraft && (
                <div className=" w-full h-full min-h-[75vh] px-8 mt-10 ">
               
                </div>
            )}

            {!isDraft && (
                <div className=" w-full h-full min-h-[75vh] px-8 mt-10 ">
                  <Stepmenu schemacode="gust.io"></Stepmenu>
                </div>
            )}
        </>
    );
}
