"use client";
import { useAccount, useConnect, useSuggestChainAndConnect } from "graz";
import { sixCustomChain } from "@/app/defineChain";
import type { FC } from "react";
import React from "react";
import { ISchemaInfo } from "@/type/Nftmngr";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  Text,
  Table,
  Tr,
  Th,
  Td,
  Flex,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";

const CaradNewDaft: React.FC<{ isDaft: ISchemaInfo }> = ({ isDaft }) => {
  return (
    <>
      <Flex flexWrap={"wrap"}>
        <Card margin={"10px"} minH={"80px"} minW={"250px"} bgColor="#F5F6FA">
          <CardBody>
            <Text>+</Text>
          </CardBody>
        </Card>
        {isDaft.schema_info.onchain_data.nft_attributes &&
          isDaft.schema_info.onchain_data.nft_attributes.map((item, index) => (
            <Card key={index} margin={"10px"} maxW={"250px"} bgColor="#F5F6FA">
              <CardBody>
                <Flex flexWrap="wrap">
                  <Flex width="100%" justifyContent="flex-end">
                  <IconButton
                    isRound={true}
                    variant='outline'
                    aria-label="Close"
                    colorScheme='#44498D'
                    icon={<CloseIcon />}
                    style={{ 
                      zIndex: 0,  
                      right: 5,  
                      position: "absolute",
                      top: 5,
                      width: "24px"
                    }} 
                    fontSize='12px'
                    size="sm"
                  />
                  </Flex>
                  <Flex flexWrap="wrap" width="100%" marginTop="15px">
                    <Box width="100%">
                      <Text>Name :</Text>
                    </Box>
                    <Box width="100%">
                      <Text>{item.name}</Text>
                    </Box>
                  </Flex>
                  <Flex flexWrap="wrap" width="100%">
                    <Box width="100%">
                      <Text>Data Type :</Text>
                    </Box>
                    <Box width="100%">
                      <Text>{item.data_type}</Text>
                    </Box>
                  </Flex>
                  <Flex flexWrap="wrap" width="100%">
                    <Box width="100%">
                      <Text>Trait Type :</Text>
                    </Box>
                    <Box width="100%">
                      <Text>{item.display_option.opensea.trait_type}</Text>
                    </Box>
                  </Flex>
                  <Flex flexWrap="wrap" width="100%">
                    <Box width="100%">
                      <Text>Value :</Text>
                    </Box>
                    <Box width="100%">
                      <Text>{item.display_option.opensea.trait_type}</Text>
                    </Box>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          ))}
      </Flex>
    </>
  );
};

export default CaradNewDaft;
