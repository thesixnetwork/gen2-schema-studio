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
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

interface Props {
  text: string;
}
const CustomButton: React.FC<Props> = ({ text }) => {
  return (
    <>
      {text === "Back" && (
        <Flex
        width="170px"
        height="48px"
        borderRadius="4px"
        border="1px solid #DADEF2"
        justifyContent="center"
        alignItems="center"
        >
          <Flex
          width="160px"
          height="40px"
          borderRadius="4px"
          border="1px solid #3980F3"
          justifyContent="center"
          alignItems="center"
          >
            <ChevronLeftIcon color="#3980F3"/>
            <Text color="#3980F3">{text}</Text>
          </Flex>
        </Flex>
      )}
      {text === "Next" && (
        <Flex 
        width="170px"
        height="48px"
        borderRadius="4px"
        border="1px solid #DADEF2"
        justifyContent="center"
        alignItems="center"
        >
          <Flex
          width="160px"
          height="40px"
          borderRadius="4px"
          border="1px solid #3980F3"
          bgColor="#3980F3"
          justifyContent="center"
          alignItems="center"
          >
            <Text color="#DADEF2">{text}</Text>
            <ChevronRightIcon/>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default CustomButton;
