"use client";
import { useAccount, useConnect, useSuggestChainAndConnect } from "graz";
import { sixCustomChain } from "@/app/defineChain";
import react, { useState } from "react";
import React from "react";
import { ISchemaInfo, ItokenAttributes } from "@/type/Nftmngr";
import CardEditDaft from "./CradEditDaft";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  IconButton,
  Input,
  Text,
  Table,
  Tr,
  Th,
  Td,
  Flex,
} from "@chakra-ui/react";

import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

const CaradNewDaft: React.FC<{ isDaft: ISchemaInfo, isState: number }> = ({ isDaft, isState }) => {
  const router = useRouter();
  const [onEdit, setOnEdit] = useState(false);
  const [indexEdit, setIndexEdit] = useState(0);
  const [isAttribute, setIsAttribute] = useState<ItokenAttributes | null>(null);
  const handleEdit = (item: ItokenAttributes, index: number) => {
    setOnEdit(true);
    setIndexEdit(index);
    setIsAttribute(item);
  };
  return (
    <>
      <Flex flexWrap={"wrap"}>
        {!onEdit && (
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            // gap= "8px"
            width="200px"
            height="265px"
            border="1px dashed #878CA8"
            borderRadius="16px"
            marginTop="12px"
            marginLeft="12px"
            _hover={{
              bgColor: "#DADEF2",
              cursor: "pointer",
              transform: "scale(1.05)",
            }}
          >
            <Box>
              <IconButton
                isRound={true}
                variant="outline"
                aria-label="Close"
                color="#79A0EF"
                icon={<AddIcon />}
              />
            </Box>
            <Box marginTop="10px">
              <Text fontSize="20px">New Token Attribute</Text>
            </Box>
          </Flex>
        )}
        {isDaft.schema_info.onchain_data.nft_attributes &&
          !onEdit && (isState === 4 ? isDaft.schema_info.onchain_data.nft_attributes : isDaft.schema_info.onchain_data.token_attributes).map((item, index) => (
            <Card
              key={index}
              margin={"10px"}
              maxW={"200px"}
              bgColor="#F5F6FA"
              width="200px"
              height="265px"
              _hover={{
                bgColor: "#DADEF2",
                cursor: "pointer",
                transform: "scale(1.05)",
              }}
              onClick={() => handleEdit(item ,index)}
            >
              <CardBody>
                <Flex flexWrap="wrap">
                  <Flex width="100%" justifyContent="flex-end">
                    <IconButton
                      isRound={true}
                      variant="outline"
                      aria-label="Close"
                      color="#44498D"
                      icon={<CloseIcon />}
                      style={{
                        zIndex: 0,
                        right: 5,
                        position: "absolute",
                        top: 5,
                        width: "24px",
                      }}
                      fontSize="12px"
                      size="sm"
                    />
                  </Flex>
                  <Flex flexWrap="wrap" width="100%" marginTop="15px">
                    <Box width="100%">
                      <Text>Name :</Text>
                    </Box>
                    <Box width="100%">
                      <Text color="#3980F3" fontSize="20px" fontWeight="700">
                        {item.name}
                      </Text>
                    </Box>
                    <Divider
                      borderColor={"brand"}
                      width="100%"
                      marginTop="10px"
                      marginBottom="10px"
                    />
                  </Flex>
                  <Flex flexWrap="wrap" width="100%">
                    <Box width="100%">
                      <Text>Data Type :</Text>
                    </Box>
                    <Box width="100%">
                      <Text color="#3980F3" fontSize="20px" fontWeight="700">
                        {item.data_type}
                      </Text>
                    </Box>
                    <Divider
                      borderColor={"brand"}
                      width="100%"
                      marginTop="10px"
                      marginBottom="10px"
                    />
                  </Flex>
                  <Flex flexWrap="wrap" width="100%">
                    <Box width="100%">
                      <Text>Trait Type :</Text>
                    </Box>
                    <Box width="100%">
                      <Text color="#3980F3" fontSize="20px" fontWeight="700">
                        {item.display_option.opensea.trait_type}
                      </Text>
                    </Box>
                    <Divider
                      borderColor={"brand"}
                      width="100%"
                      marginTop="10px"
                      marginBottom="10px"
                    />
                  </Flex>
                  <Flex flexWrap="wrap" width="100%">
                    <Box width="100%">
                      <Text>Value :</Text>
                    </Box>
                    <Box width="100%">
                      <Text color="#3980F3" fontSize="20px" fontWeight="700">
                        {item.display_option.opensea.trait_type}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
            // eslint-disable-next-line react/jsx-no-comment-textnodes
          ))}

        {onEdit && isAttribute && <CardEditDaft isAttribute={isAttribute} rawData={isDaft} setOnEdit={setOnEdit} isState={isState} />}
      </Flex>
    </>
  );
};

export default CaradNewDaft;
