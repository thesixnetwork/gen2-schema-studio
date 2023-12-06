// "use client";
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
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { Divider, Center } from "@chakra-ui/react";

import HomeFooter from "@/components/HomeFooter";
import HomeNavBar from "@/components/HomeNavbar";
import HomeSidebar from "@/components/HomeSidebar";

import { ItokenAttributes } from "@/type/Nftmngr";
import { ISchemaInfo } from "@/type/Nftmngr";
import { postData } from "@/service/postAction";

// import { Button, ButtonGroup } from '@chakra-ui/react'

const CaradEditDaft: React.FC<{
  isAttribute: ItokenAttributes;
  rawData: ISchemaInfo;
  setOnEdit: Dispatch<SetStateAction<boolean>>;
  isState: number;
}> = ({ isAttribute, rawData, setOnEdit, isState }) => {
  const [Attribute, setAttribute] = useState(isAttribute);
  const [Attribute2, setAttribute2] = useState<ItokenAttributes[]>(
    isState === 4
      ? rawData.schema_info.onchain_data.nft_attributes
      : rawData.schema_info.onchain_data.token_attributes
  );
  const [checkDatatype, setAcheckDatatype] = useState(Attribute.data_type);
  const [checkDatatype2, setAcheckDatatype2] = useState(Attribute.data_type);
  const [isDefaultValue, setIsDefaultValue] = useState<string | number>(
    Attribute.default_mint_value.string_attribute_value?.value ||
      Attribute.default_mint_value.number_attribute_value?.value ||
      Attribute.default_mint_value.float_attribute_value?.value ||
      `${Attribute.default_mint_value.boolean_attribute_value?.value}`
  );

  console.log(Attribute2)
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    // console.log(e)
    // console.log(rawData)
    const element = document.getElementById("namenaja");
    const filteredArray = Attribute2.filter(
      (item) => item.name === e.target.value
    );
    // console.log(filteredArray);
    // console.log(checkDatatype2);
    if (element) {
      if (filteredArray.length > 1) {
        element.style.borderColor = "red";
      } else {
        element.style.borderColor = "#DADEF2"; // Set it to an empty string to remove the border color
      }
    }
    return;
  };

  const handleSave = async () => {
    console.log(Attribute2)
    const ss = await postData(Attribute2, rawData.schema_code, isState);
    console.log(ss)
    if (ss) {
      console.log("The request was successful.");
      setOnEdit(false);
    } else {
      console.log("The request was failed.");
    }
  };

  const handleDatatype = (type: string) => {
    if (type === "string") {
      isAttribute.data_type = "string";
      isAttribute.default_mint_value.string_attribute_value = {
        value: "",
      };
      isAttribute.default_mint_value = {
        string_attribute_value: {
          value: "",
        },
      };
      setAcheckDatatype("string");
      setIsDefaultValue("");
      return;
    }
    if (type === "number") {
      isAttribute.data_type = "number";
      isAttribute.default_mint_value = {
        number_attribute_value: {
          value: "0",
        },
      };
      setAcheckDatatype("number");
      setIsDefaultValue("0");
      return;
    }
    if (type === "boolean") {
      isAttribute.data_type = "boolean";
      isAttribute.default_mint_value = {
        boolean_attribute_value: {
          value: true,
        },
      };
      setAcheckDatatype("boolean");
      setIsDefaultValue("true");
      return;
    }
    return;
  };

  const handleValue = (type: string, value: string | number) => {
    if (type === "string") {
      console.log(value)
      isAttribute.default_mint_value = {
        string_attribute_value: {
          value: value.toString(),
        },
      };
      return;
    }
    if (type === "number") {
      isAttribute.default_mint_value = {
        number_attribute_value: {
          value: value.toString(),
        },
      };
      return;
    }
    if (type === "boolean") {
      isAttribute.default_mint_value = {
        boolean_attribute_value: {
          value: Boolean(value),
        },
      };
      return;
    }
    return;
  };

  return (
    <>
      <Flex flexWrap="wrap" justifyContent="space-around">
        <Flex
          flexWrap="wrap"
          width="60%"
          border="1px solid #DADEF2"
          borderRadius="12px"
          p={8}
          id="namenaja"
        >
          <Box height="50%">
            <Text>Name</Text>
          </Box>
          <Box height="50%">
            <Input
              color="black"
              defaultValue={isAttribute.name}
              onChange={(e) => handleInput(e, "name")}
            ></Input>
          </Box>
        </Flex>
        <Flex
          flexWrap="wrap"
          width="60%"
          border="1px solid #DADEF2"
          borderRadius="12px"
          p={8}
          marginTop="15px"
        >
          <Box height="50%">
            <Text>Data Type</Text>
          </Box>
          <Flex height="50%">
            {/* <Input color="black" defaultValue={isAttribute.data_type} /> */}
            <Flex
              borderRadius="4px 0px 0px 4px"
              border="1px solid #3980F3"
              height="48px"
              width="110.667px"
              justifyContent="center"
              alignItems="center"
              bgColor={checkDatatype === "string" ? "#3980F3" : ""}
              _hover={{
                cursor: "pointer",
                bgColor: `${
                  checkDatatype === "string" ? "#3980F3" : "#DADEF2"
                }`,
              }}
              onClick={() => handleDatatype("string")}
            >
              <Text color={checkDatatype === "string" ? "#F5F6FA" : "#3980F3"}>
                abc
              </Text>
            </Flex>
            <Flex
              // borderRadius="4px 0px 0px 4px"
              border="1px solid #3980F3"
              height="48px"
              width="110.667px"
              justifyContent="center"
              alignItems="center"
              bgColor={checkDatatype === "number" ? "#3980F3" : ""}
              _hover={{
                cursor: "pointer",
                bgColor: `${
                  checkDatatype === "number" ? "#3980F3" : "#DADEF2"
                }`,
              }}
              onClick={() => handleDatatype("number")}
            >
              <Text color={checkDatatype === "number" ? "#F5F6FA" : "#3980F3"}>
                123
              </Text>
            </Flex>
            <Flex
              borderRadius="0px 4px 4px 0px"
              border="1px solid #3980F3"
              height="48px"
              width="110.667px"
              justifyContent="center"
              alignItems="center"
              bgColor={checkDatatype === "boolean" ? "#3980F3" : ""}
              _hover={{
                cursor: "pointer",
                bgColor: `${
                  checkDatatype === "boolean" ? "#3980F3" : "#DADEF2"
                }`,
              }}
              onClick={() => handleDatatype("boolean")}
            >
              <Text color={checkDatatype === "boolean" ? "#F5F6FA" : "#3980F3"}>
                Y/N
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexWrap="wrap"
          width="60%"
          border="1px solid #DADEF2"
          borderRadius="12px"
          p={8}
          marginTop="15px"
        >
          <Box>
            <Text>Trait Type</Text>
          </Box>
          <Box>
            <Input
              color="black"
              defaultValue={isAttribute.display_option.opensea.trait_type}
            />
          </Box>
        </Flex>
        <Flex
          flexWrap="wrap"
          width="60%"
          border="1px solid #DADEF2"
          borderRadius="12px"
          p={8}
          marginTop="15px"
        >
          <Box>
            <Text>Value</Text>
          </Box>
          <Flex>
            {/* boolean */}
            {checkDatatype === "boolean" && (
              <>
                <Flex
                  borderRadius="4px 0px 0px 4px"
                  border="1px solid #3980F3"
                  height="48px"
                  width="110.667px"
                  justifyContent="center"
                  alignItems="center"
                  bgColor={isDefaultValue === "true" ? "#3980F3" : ""}
                  _hover={{
                    cursor: "pointer",
                    bgColor: `${
                      isDefaultValue === "true" ? "#3980F3" : "#DADEF2"
                    }`,
                  }}
                  onClick={() => handleValue("boolean", "false")}
                >
                  <Text>Yes</Text>
                </Flex>
                <Flex
                  borderRadius="0px 4px 4px 0px"
                  border="1px solid #3980F3"
                  height="48px"
                  width="110.667px"
                  justifyContent="center"
                  alignItems="center"
                  bgColor={isDefaultValue === "false" ? "#3980F3" : ""}
                  _hover={{
                    cursor: "pointer",
                    bgColor: `${
                      isDefaultValue === "false" ? "#3980F3" : "#DADEF2"
                    }`,
                  }}
                  onClick={() => handleValue("boolean", "false")}
                >
                  <Text>No</Text>
                </Flex>
              </>
            )}

            {/* number */}
            {checkDatatype === "number" && (
              <>
                <NumberInput
                  size="md"
                  color="black"
                  defaultValue={isDefaultValue}
                  precision={2}
                  step={0.1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </>
            )}

            {/* string */}
            {checkDatatype === "string" && (
              <>
                <Input color="black" defaultValue={isDefaultValue} />
              </>
            )}
          </Flex>
        </Flex>

        <Flex
          width="100%"
          marginTop="15px"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Flex
            border="1px 
          solid #3980F3"
            borderRadius="5px"
            justifyContent="center"
            alignItems="center"
            width="150px"
            height="48px"
            _hover={{
              bgColor: "#DADEF2",
              color: "blue", // เปลี่ยน color ของ Text เมื่อ hover
              cursor: "pointer",
              transform: "scale(1.05)",
            }}
          >
            <Text color="#3980F3" fontSize="20">
              Cancel
            </Text>
          </Flex>
          <Flex
            border="1px solid #3980F3"
            borderRadius="5px"
            justifyContent="center"
            alignItems="center"
            marginLeft="15px"
            width="150px"
            height="48px"
            _hover={{
              bgColor: "#DADEF2",
              color: "blue", // เปลี่ยน color ของ Text เมื่อ hover
              cursor: "pointer",
              transform: "scale(1.05)",
            }}
            onClick={() => handleSave()}
          >
            <Text color="#3980F3" fontSize="20">
              Save
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default CaradEditDaft;
