"use client";

import {
  CircularProgress,
  Box,
  Button,
  Flex,
  Text,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

interface Props {
  text: string;
}
const CustomCardDeploy: React.FC<Props> = ({ text }) => {
  return (
    <>
      {text === "Mainnet" && (
        <Flex
        width="200px"
        height="265px"
        borderRadius="4px"
        border="1px solid #3980F3"
        justifyContent="center"
        alignItems="center"
        _hover={{
            bgColor: "#DADEF2",
            color: "blue", // เปลี่ยน color ของ Text เมื่อ hover
            cursor: "pointer",
            transform: "scale(1.05)",
          }}
        >
          <Flex
          width="auto"
          height="auto"
            flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          >
            <Image src='/pic/logo-six1.png' alt='Mainnet' />
            <Text 
            color="#44498D"
            fontWeight={700} 
            fontSize="16px" 
            pt={4}
            >Deploy to {text}</Text>
          </Flex>
        </Flex>
      )}
      {text === "Testnet" && (
        <Flex
        width="200px"
        height="265px"
        borderRadius="4px"
        border="1px solid #3980F3"
        justifyContent="center"
        alignItems="center"
        _hover={{
            bgColor: "#DADEF2",
            color: "blue", // เปลี่ยน color ของ Text เมื่อ hover
            cursor: "pointer",
            transform: "scale(1.05)",
          }}
        >
          <Flex
          width="auto"
          height="auto"
            flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          >
            <Image src='/pic/logo-six1.png' alt='Mainnet' />
            <Text 
            color="#44498D"
            fontWeight={700} 
            fontSize="16px" 
            pt={4}
            >Deploy to {text}</Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default CustomCardDeploy;
