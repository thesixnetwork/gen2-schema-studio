import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useAccount, useConnect, useSuggestChainAndConnect } from "graz";
import { sixCustomChain } from "@/app/defineChain";
import type { FC } from "react";
import React from "react";
import { ISchemaInfo } from "@/type/Nftmngr";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Table,
  Tr,
  Th,
  Td,
  Flex,
} from "@chakra-ui/react";

const CaradNewDaft: React.FC<{ isDaft: ISchemaInfo }> = ({ isDaft }) => {
  return (
    <>
      <Flex flexWrap={"wrap"}>
        <Card margin={"10px"} minH={"80px"} minW={"250px"}>
          <CardBody>
            <Text>+</Text>
          </CardBody>
        </Card>
        {isDaft.schema_info.onchain_data.nft_attributes &&
          isDaft.schema_info.onchain_data.nft_attributes.map((item, index) => (
            <Card key={index} margin={"10px"} maxW={"250px"}>
              <CardBody>
                <Table>
                  <Tr>
                    <Td>
                      <Text>Name :</Text>
                    </Td>
                    <Td>{item.name}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Data Type :</Text>
                    </Td>
                    <Td>{item.data_type}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Trait Type :</Text>
                    </Td>
                    <Td>{item.display_option.opensea.trait_type}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Value :</Text>
                    </Td>
                    <Td>
                      {/* {item.default_mint_value.string_attribute_value} */}
                    </Td>
                  </Tr>
                </Table>
              </CardBody>
            </Card>
          ))}
      </Flex>
    </>
  );
};

export default CaradNewDaft;
