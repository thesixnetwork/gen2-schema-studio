"use client";
import { useAccount, useConnect, useSuggestChainAndConnect } from "graz";
import { sixCustomChain } from "@/app/defineChain";
import react, { useEffect, useState, Dispatch, SetStateAction } from "react";
import React from "react";
import { ISchemaInfo, ItokenAttributes } from "@/type/Nftmngr";
import CardEditDaft from "./CradEditDaft";
import CreateAttribute from "./CreateAttribute";
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
import NewCollecitonCard from "./state3/NewCollectionCard";
import AttributeCard from "./state3/AttributeCard";
import AttributeCardAndDelete from "./state3/AttributeCardAndDelete";
import { ConfirmModal } from "@/components/ConfirmModal";
import ENV from "@/utils/ENV";
import axios from "axios";
import { useSession } from "next-auth/react";


const CaradNewDaft: React.FC<{
  isDaft: ISchemaInfo;
  isState: number;
  setIsDaft: Dispatch<SetStateAction<ISchemaInfo | null>>;
  schemacode: string;
  setOnEditOrCreate: Dispatch<SetStateAction<boolean>>;
}> = ({ isDaft, isState, setIsDaft, schemacode, setOnEditOrCreate }) => {
  const { data: session } = useSession();

  const router = useRouter();
  const [onEdit, setOnEdit] = useState(false);
  const [onCreate, setOnCreate] = useState(false);
  const [onAdd, setOnAdd] = useState(false);
  const [indexEdit, setIndexEdit] = useState(0);
  const [isAttribute, setIsAttribute] = useState<ItokenAttributes | null>(null);
  const [isAttributes, setIsAttributes] = useState<ItokenAttributes[]>(
    isState === 4
      ? isDaft.schema_info.onchain_data.nft_attributes
      : isDaft.schema_info.onchain_data.token_attributes
  );
  const handleEdit = (item: ItokenAttributes, index: number) => {
    setOnEdit(true);
    setIndexEdit(index);
    setIsAttribute(item);
  };

  const handleDel = async (index: number) => {
    const updatedAttributes = isAttributes.filter((_, i) => i !== index);
    let onchain_data;
    const apiUrl = `${ENV.Client_API_URL}/schema/set_schema_info`;
    if (isState === 4) {
      onchain_data = {
        nft_attributes: updatedAttributes,
      };
    }
    if (isState === 5) {
      onchain_data = {
        token_attributes: updatedAttributes,
      };
    }

    const requestData = {
      payload: {
        schema_info: {
          onchain_data: onchain_data,
        },
        schema_code: schemacode,
        status: "Draft",
        current_state: isState.toString(),
      },
    };

    try {
      const req = await axios.post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`, // Set the content type to JSON
        },
      });
      const res = req.data;
      if (res.statusCode === "V:0001") {
        setIsAttributes(updatedAttributes);
        // console.log(res)
        return;
      } else {
        return;
      }
    } catch (error) {
      console.log("error ", error)
    }


  };

  useEffect(() => {
    if (isState === 4) {
      setIsAttributes(isDaft.schema_info.onchain_data.nft_attributes);
    }
    if (isState === 5) {
      setIsAttributes(isDaft.schema_info.onchain_data.token_attributes);
    }
  }, [isState]);

  return (
    <>
      <Flex className=" w-full min-h-[75vh] flex justify-center items-center ">
        {!onEdit && !onCreate && (
          <div className=" w-full h-[75vh] grid grid-cols-4 gap-4 overflow-scroll p-4">
            <div onClick={() => { setOnCreate(true), setOnEditOrCreate(true) }}>
              <NewCollecitonCard></NewCollecitonCard>
            </div>
            {isAttributes &&
              isAttributes.map((item, index) => (
                <div key={index}>
                  <AttributeCardAndDelete
                    name={item.name}
                    dataType={item.data_type}
                    traitType={item.display_option.opensea.trait_type}
                    // value={
                    //   item.data_type === "string" ? 
                    //   item.default_mint_value!.string_attribute_value!.value.toString():
                    //   item.data_type === "number" ?
                    //   item.default_mint_value!.number_attribute_value!.value.toString():
                    //   item.data_type === "boolean" ?
                    //   item.default_mint_value!.boolean_attribute_value!.value.toString():
                    //   item.default_mint_value!.float_attribute_value!.value.toString()
                    // }
                    value={
                      item.data_type === "string" && item.default_mint_value?.string_attribute_value ?
                        item.default_mint_value?.string_attribute_value.value :
                        item.data_type === "number" && item.default_mint_value?.number_attribute_value ?
                          item.default_mint_value?.number_attribute_value.value :
                          item.data_type === "boolean" && item.default_mint_value?.boolean_attribute_value ?
                            item.default_mint_value?.boolean_attribute_value.value.toString() :
                            item.default_mint_value?.float_attribute_value && item.default_mint_value?.float_attribute_value.value.toString()
                    }
                    onSettingBarClick={() => { handleEdit(item, index), setOnEditOrCreate(true) }}
                    onDelete={() => handleDel(index)}
                  ></AttributeCardAndDelete>
                </div>
              ))}
          </div>
          // <Flex
          //   flexDirection="column"
          //   alignItems="center"
          //   justifyContent="center"
          //   // gap= "8px"
          //   width="200px"
          //   height="265px"
          //   border="1px dashed #878CA8"
          //   borderRadius="16px"
          //   marginTop="12px"
          //   marginLeft="12px"
          //   _hover={{
          //     bgColor: "#DADEF2",
          //     cursor: "pointer",
          //     transform: "scale(1.05)",
          //   }}
          //   onClick={() => setOnCreate(true) }
          // >
          //   <Box>
          //     <IconButton
          //       isRound={true}
          //       variant="outline"
          //       aria-label="Close"
          //       color="#79A0EF"
          //       icon={<AddIcon />}
          //     />
          //   </Box>
          //   <Box marginTop="10px">
          //     <Text fontSize="20px">New Token Attribute</Text>
          //   </Box>
          // </Flex>
        )}
        {/* {isAttributes &&
          !onEdit && !onCreate && isAttributes.map((item, index) => (
            <div key={index}>
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
                onClick={() => handleEdit(item, index)}
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
            </div>
            // eslint-disable-next-line react/jsx-no-comment-textnodes
          ))} */}

        {onEdit && !onCreate && isAttribute && (
          <div className=" w-full h-full">
            <CardEditDaft
              isAttribute={isAttribute}
              isAttributes={isAttributes}
              setIsAttributes={setIsAttributes}
              indexEdit={indexEdit}
              rawData={isDaft}
              setOnEdit={setOnEdit}
              isState={isState}
              onEdit={onEdit}
              schemacode={schemacode}
              setOnEditOrCreate={setOnEditOrCreate}
            />
          </div>
        )}
        {onCreate && !onEdit && (
          <div className=" w-full h-full">
            <CreateAttribute
              rawData={isDaft}
              setIsAttributes={setIsAttributes}
              isAttributes={isAttributes}
              setOnCreate={setOnCreate}
              isState={isState}
              schemacode={schemacode}
              setOnEditOrCreate={setOnEditOrCreate}
            />
          </div>
        )}
      </Flex>
    </>
  );
};

export default CaradNewDaft;
