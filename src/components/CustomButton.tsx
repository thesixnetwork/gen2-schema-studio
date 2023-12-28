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
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";

interface Props {
  text: string;
  schemaCode: string;
  isCurren: number;
}
const CustomButton: React.FC<Props> = ({ text, schemaCode, isCurren }) => {
  return (
    <>
      {text === "Back" && (
        <Link href={`/newdaft/${isCurren - 1}/${schemaCode}`}>
          <Flex
            width="170px"
            height="48px"
            borderRadius="4px"
            border="1px solid #DADEF2"
            justifyContent="center"
            alignItems="center"
            _hover={{
              cursor: "pointer",
              bgColor: "#DADEF2",
            }}
          >
            <Flex
              width="160px"
              height="40px"
              borderRadius="4px"
              border="1px solid #3980F3"
              justifyContent="center"
              alignItems="center"
            >
              <ChevronLeftIcon color="#3980F3" />
              <Text color="#3980F3">{text}</Text>
            </Flex>
          </Flex>
        </Link>
      )}
      {text === "Next" && (
        <Link href={`/newdaft/${isCurren + 1}/${schemaCode}`}>
          <Flex
            width="170px"
            height="48px"
            borderRadius="4px"
            border="1px solid #DADEF2"
            justifyContent="center"
            alignItems="center"
            _hover={{
              cursor: "pointer",
              bgColor: "#DADEF2",
            }}
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
              <ChevronRightIcon />
            </Flex>
          </Flex>
        </Link>
      )}
    </>
  );
};

export default CustomButton;
