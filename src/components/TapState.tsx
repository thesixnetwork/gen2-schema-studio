import {
    Box,
    Button,
    ButtonGroup,
    Text,
    Flex,
    FormControl,
    FormLabel,
    useToast
} from "@chakra-ui/react";
import { useAccount, useConnect, useSuggestChainAndConnect } from "graz";
import { sixCustomChain } from "@/app/defineChain";
import type { FC } from "react";
import React from "react";

const TapState: FC<{ isCurren: number }> = ({ isCurren }) => {

    const isState = [
        {
            state: 1,
            text: "basic data"
        },
        {
            state: 2,
            text: "Origin collection data"
        },
        {
            state: 3,
            text: "Origin token attributes"
        },
        {
            state: 4,
            text: "Onchain collection attributes"
        },
        {
            state: 5,
            text: "Onchain token attributes"
        },
        {
            state: 6,
            text: "Action"
        },
    ]

    return (
        <Flex p={2}>
            {isState &&
                isState.map((item, index) => (
                    <Flex key={index} width="100%">
                        <Flex width="100%">
                            <Flex
                                border="2px"
                                borderColor="red"
                                width="40%"
                                justifyContent="center"
                                alignItems="center" 
                                fontFamily= "Montserrat"
                                fontSize= "40px"
                                fontStyle= "normal"
                                fontWeight= "100"
                                lineHeight= "normal"
                            >
                            <Text>{item.state}</Text>
                        </Flex>
                        <Box width="60%">
                            <Text>{item.text}</Text>
                        </Box>
                    </Flex>
                    </Flex>
    )
                )}
        </Flex >
    );
};

export default TapState;
