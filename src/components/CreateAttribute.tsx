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
import axios from "axios";
import ENV from "@/utils/ENV";
import { useSession } from "next-auth/react";
import { CheckErrorII } from "@/utils/checkError";

import { ConfirmModal } from "@/components/ConfirmModal";
import InputCardOneLine from "./state1/InputCardOneLine";
import InputSelectCard from "./state3/InputSelectCard";
import CancelButton from "./button/CancelButton";
import SaveButton from "./button/SaveButton";

// import { Button, ButtonGroup } from '@chakra-ui/react'

const CreateAttribute: React.FC<{
  rawData: ISchemaInfo;
  setIsAttributes: Dispatch<SetStateAction<ItokenAttributes[]>>;
  isAttributes: ItokenAttributes[];
  setOnCreate: Dispatch<SetStateAction<boolean>>;
  isState: number;
  schemacode: string;
  setOnEditOrCreate: Dispatch<SetStateAction<boolean>>;
}> = ({
  rawData,
  setIsAttributes,
  isAttributes,
  setOnCreate,
  isState,
  // onCreate,
  schemacode,
  setOnEditOrCreate
}) => {
    // console.log(onEdit)
    const { data: session } = useSession();
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [dataType, setDataType] = useState("string")
    const [traitType, setTraitType] = useState("")
    const [isError, setIsError] = useState(false);
    const [haveError, setHaveError] = useState(false);


    const [newAttributes, setNewAttributes] = useState<ItokenAttributes>({
      name: "",
      data_type: "string",
      required: true,
      display_value_field: "",
      display_option: {
        bool_true_value: "",
        bool_false_value: "",
        opensea: {
          display_type: "",
          trait_type: "",
          max_value: "0",
        },
      },
      default_mint_value: {
        string_attribute_value: {
          value: "",
        },
      },
      hidden_overide: false,
      hidden_to_marketplace: false,
    });

    const [Attribute2, setAttribute2] = useState<ItokenAttributes[]>(
      isState === 4
        ? rawData.schema_info.onchain_data.nft_attributes
        : rawData.schema_info.onchain_data.token_attributes
    );

    const att4 = rawData.schema_info.onchain_data.nft_attributes;
    const att5 = rawData.schema_info.onchain_data.token_attributes;

    const [isDefaultValue, setIsDefaultValue] = useState<string | number>(
      newAttributes.default_mint_value.string_attribute_value?.value ||
      newAttributes.default_mint_value.number_attribute_value?.value ||
      newAttributes.default_mint_value.float_attribute_value?.value ||
      `${newAttributes.default_mint_value.boolean_attribute_value?.value}`
    );

    // console.log(isAttributes);

    const handleInputChangeName = async (value: string) => {
      setName(value);
      const element = document.getElementById(`cr-name`);
      const filteredArray = Attribute2.filter(
        (item) => item.name === value
      );
      console.log(filteredArray);
      // console.log(checkDatatype2);
      const error = await CheckErrorII(
        value,
        setErrorMessage,
        att4,
        att5
      );

      setIsError(error)

      setNewAttributes((prevPerson) => ({
        ...prevPerson,
        name: value,
      }));
    };

    const handleInputChangeChaDataType = (value: string) => {
      setDataType(value);
      let default_mint_value;
      if (value === "string") {
        default_mint_value = {
          string_attribute_value: {
            value: "",
          },
        };
      }
      if (value === "number") {
        default_mint_value = {
          number_attribute_value: {
            value: "0",
          },
        };
      }
      if (value === "float") {
        default_mint_value = {
          float_attribute_value: {
            value: 0.0,
          },
        };
      }
      if (value === "boolean") {
        default_mint_value = {
          boolean_attribute_value: {
            value: true,
          },
        };
      }

      setNewAttributes((prevPerson) => ({
        ...prevPerson,
        data_type: value,
        default_mint_value: default_mint_value!,
      }));
    };

    const handleInputChangeTraitType = (value: string) => {
      setTraitType(value);
      setNewAttributes((prevPerson) => ({
        ...prevPerson,
        display_option: {
          bool_true_value: "",
          bool_false_value: "",
          opensea: {
            display_type: "",
            trait_type: value,
            max_value: "0",
          },
        },
      }));
    };


    const handleInput = async (
      e: React.ChangeEvent<HTMLInputElement>,
      type: string
    ) => {
      setName(e.target.value)
      // console.log(e)
      // console.log(rawData)
      const element = document.getElementById(`cr-name`);
      const filteredArray = Attribute2.filter(
        (item) => item.name === e.target.value
      );
      console.log(filteredArray);
      // console.log(checkDatatype2);
      const error = await CheckErrorII(
        e.target.value,
        setErrorMessage,
        att4,
        att5
      );
      setIsError(error)
      if (element) {
        if (error) {
          element.style.borderColor = "red";
          setHaveError(true);
        } else {
          element.style.borderColor = "#DADEF2";
          setHaveError(false);
        }
      }
      return;
    };

    const cancleCreate = async () => {
      const isConfirm = await ConfirmModal(
        "There are some edits that haven't been saved yet. Do you want to Cancle ?",
        "Cancle"
      );
      if (isConfirm) {
        setOnCreate(false);
        setOnEditOrCreate(false)

      }
      return;
    };
    console.log("isAttributes", isAttributes);
    // console.log("newAttributes",newAttributes)

    const handleSave = async () => {
      if (errorMessage) {
        await ConfirmModal(errorMessage, "Error");
        console.log("Have error validate");
        return;
      }
      await setIsAttributes([...isAttributes, newAttributes]);

      const newAtt = [...isAttributes, newAttributes];
      // console.log(newAtt)
      let onchain_data;
      const apiUrl = `${ENV.Client_API_URL}/schema/set_schema_info`;
      if (isState === 4) {
        onchain_data = {
          nft_attributes: newAtt,
        };
      }
      if (isState === 5) {
        onchain_data = {
          token_attributes: newAtt,
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
      console.log(requestData);

      const isConfirmed = await ConfirmModal("Are you sure to Save ?", "Save");
      if (isConfirmed) {
        try {
          const req = await axios.post(apiUrl, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.accessToken}`, // Set the content type to JSON
            },
          });
          const res = req.data;
          // console.log(res)

          if (res.statusCode === "V:0001") {
            setOnCreate(false);
            setOnEditOrCreate(false);

            return;
          } else {
            return;
          }
        } catch (error) {
          console.log("error ", error);
        }
      }
      // setOnCreate(false);
    };

    const handleAttribute = (type: string, value: string) => {
      if (type === "name") {
        setNewAttributes((prevPerson) => ({
          ...prevPerson,
          name: value,
        }));
      }

      if (type === "data_type") {
        let default_mint_value;
        if (value === "string") {
          default_mint_value = {
            string_attribute_value: {
              value: "",
            },
          };
        }
        if (value === "number") {
          default_mint_value = {
            number_attribute_value: {
              value: "0",
            },
          };
        }
        if (value === "float") {
          default_mint_value = {
            float_attribute_value: {
              value: 0.0,
            },
          };
        }
        if (value === "boolean") {
          default_mint_value = {
            boolean_attribute_value: {
              value: true,
            },
          };
        }

        setNewAttributes((prevPerson) => ({
          ...prevPerson,
          data_type: value,
          default_mint_value: default_mint_value!,
        }));
      }

      if (type === "trait_type") {
        setNewAttributes((prevPerson) => ({
          ...prevPerson,
          display_option: {
            bool_true_value: "",
            bool_false_value: "",
            opensea: {
              display_type: "",
              trait_type: value,
              max_value: "0",
            },
          },
        }));
      }

      if (type === "value") {
        let default_mint_value;
        if (newAttributes.data_type === "string") {
          default_mint_value = {
            string_attribute_value: {
              value: value,
            },
          };
        }
        if (newAttributes.data_type === "number") {
          default_mint_value = {
            number_attribute_value: {
              value: value,
            },
          };
        }
        if (newAttributes.data_type === "float") {
          default_mint_value = {
            float_attribute_value: {
              value: parseFloat(value),
            },
          };
        }
        if (newAttributes.data_type === "boolean") {
          // console.log("value ==>", value);
          default_mint_value = {
            boolean_attribute_value: {
              value: value === "false" ? false : Boolean(value),
            },
          };
        }
        setNewAttributes((prevPerson) => ({
          ...prevPerson,
          default_mint_value: default_mint_value!,
        }));
      }
    };

    return (
      <>
        <div className=" min-h-[65vh] w-full flex flex-col justify-between items-center  " >
          <InputCardOneLine
            title={"Name"}
            require={true}
            loading={false}
            placeholder={"Add attribute name"}
            validate={!isError}
            errorMassage={errorMessage}
            value={name}
            onChange={handleInputChangeName}
          ></InputCardOneLine>
          <InputSelectCard
            title={"Data type"}
            require={true}
            value={dataType}
            onChange={handleInputChangeChaDataType}
          ></InputSelectCard>
          <InputCardOneLine
            title={"Trait type"}
            require={true}
            placeholder={"Add trait type here"}
            validate={true}
            errorMassage={""}
            value={traitType}
            onChange={handleInputChangeTraitType}
            loading={false}
          ></InputCardOneLine>

          {/* <Flex
            // flexWrap="wrap"
            // width="60%"
            // border="1px solid #DADEF2"
            // borderRadius="12px"
            // p={8}
            marginTop="15px"
            className="w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative"
            id="namenaja"
          >
            <Box height="30%">
              <p className="text-main2 text-2xl font-bold">Name</p>
            </Box>
            <Flex flexDirection="column" height="auto">
              <Box height="60%" width="380px">
                <Input
                  color="black"
                  id="cr-name"
                  placeholder={"Add Attribute Name"}
                  className={`outline-none w-full h-12 pl-5 text-xl border-Act6 placeholder-Act6 placeholder-opacity-30 rounded-md border border-dashed duration-300 relative`}
                  // defaultValue={isAttribute.name}
                  // onChange={(e) => handleInput(e, "name")}
                  onChange={(e) => {

                    handleInput(e, "name")
                    handleAttribute("name", e.target.value);
                  }}
                ></Input>
              </Box>
              {errorMessage && (
                <Box marginTop="2px">
                  <Text color="red">{errorMessage}</Text>
                </Box>
              )}
              <div
                className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 bg-main2`}
              ></div>
            </Flex>
          </Flex> */}
          {/* <Flex
            className="w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative"
            // p={8}
            marginTop="15px"
          >
            <Box height="50%">
              <p className="text-main2 text-2xl font-bold">Data Type</p>
            </Box>
            <Flex height="60%" width="380px">
              
              <Flex
                borderRadius="4px 0px 0px 4px"
                border="1px solid #3980F3"
                height="48px"
                width="130.667px"
                justifyContent="center"
                alignItems="center"
                bgColor={newAttributes.data_type === "string" ? "#3980F3" : ""}
                _hover={{
                  cursor: "pointer",
                  bgColor: `${newAttributes.data_type === "string" ? "#3980F3" : "#DADEF2"
                    }`,
                }}
                onClick={() => handleAttribute("data_type", "string")}
              >
                <Text
                  color={
                    newAttributes.data_type === "string" ? "#F5F6FA" : "#3980F3"
                  }
                >
                  abc
                </Text>
              </Flex>
              <Flex
                // borderRadius="4px 0px 0px 4px"
                border="1px solid #3980F3"
                height="48px"
                width="130.667px"
                justifyContent="center"
                alignItems="center"
                bgColor={newAttributes.data_type === "number" ? "#3980F3" : ""}
                _hover={{
                  cursor: "pointer",
                  bgColor: `${newAttributes.data_type === "number" ? "#3980F3" : "#DADEF2"
                    }`,
                }}
                onClick={() => handleAttribute("data_type", "number")}
              >
                <Text
                  color={
                    newAttributes.data_type === "number" ? "#F5F6FA" : "#3980F3"
                  }
                >
                  123
                </Text>
              </Flex>
              <Flex
                borderRadius="0px 4px 4px 0px"
                border="1px solid #3980F3"
                height="48px"
                width="130.667px"
                justifyContent="center"
                alignItems="center"
                bgColor={newAttributes.data_type === "boolean" ? "#3980F3" : ""}
                _hover={{
                  cursor: "pointer",
                  bgColor: `${newAttributes.data_type === "boolean" ? "#3980F3" : "#DADEF2"
                    }`,
                }}
                onClick={() => handleAttribute("data_type", "boolean")}
              >
                <Text
                  color={
                    newAttributes.data_type === "boolean" ? "#F5F6FA" : "#3980F3"
                  }
                >
                  Y/N
                </Text>
              </Flex>
            </Flex>
            <div
              className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 bg-main2`}
            ></div>
          </Flex> */}

          {/* <Flex
            className="w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative"
            marginTop="15px"
          >
            <Box>
              <p className="text-main2 text-2xl font-bold">Trait Type</p>
            </Box>
            <Box width="380px">
              <Input
                color="black"
                placeholder={"Add Trait Type"}
                className={`outline-none w-full h-12 pl-5 text-xl border-Act6 placeholder-Act6 placeholder-opacity-30 rounded-md border border-dashed duration-300 relative`}
                // defaultValue={isAttribute.display_option.opensea.trait_type}
                onChange={(e) => handleAttribute("trait_type", e.target.value)}
              />
            </Box>
            <div
              className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 bg-main2`}
            ></div>
          </Flex> */}
          <Flex
            // flexWrap="wrap"
            // width="60%"
            // border="1px solid #DADEF2"
            // borderRadius="12px"
            // p={8}
            className="w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative"
          >
            <Box>
              <p className="text-main2 text-2xl font-bold">Value</p>
            </Box>
            <Flex width="380px">
              {/* boolean */}
              {newAttributes.data_type === "boolean" && (
                <>
                  <div className=' w-96 h-10 flex  items-center    '>
                    <div onClick={() => handleAttribute("value", "true")} className={`w-[50%] h-full border border-Act6 rounded-l-md hover:bg-Act7 hover:text-white hover:border-Act7 cursor-pointer flex justify-center items-center text-xl duration-300 ${newAttributes.default_mint_value.boolean_attribute_value?.value === true ? "text-white bg-Act6" : " text-Act6 bg-white "}`}>Yes</div>

                    <div onClick={() => handleAttribute("value", "false")} className={`w-[50%] h-full border border-Act6 rounded-r-md hover:bg-Act7 hover:text-white hover:border-Act7 cursor-pointer flex justify-center items-center text-xl duration-300 ${newAttributes.default_mint_value.boolean_attribute_value?.value === false ? "text-white bg-Act6" : " text-Act6 bg-white "}`}>No</div>
                  </div>
                  {/* <Flex
                    borderRadius="4px 0px 0px 4px"
                    border="1px solid #3980F3"
                    height="48px"
                    width="130.667px"
                    justifyContent="center"
                    alignItems="center"
                    bgColor={
                      newAttributes.default_mint_value.boolean_attribute_value
                        ?.value === true
                        ? "#3980F3"
                        : ""
                    }
                    _hover={{
                      cursor: "pointer",
                      bgColor: `${newAttributes.default_mint_value.boolean_attribute_value
                        ?.value === true
                        ? "#3980F3"
                        : "#DADEF2"
                        }`,
                    }}
                    onClick={() => handleAttribute("value", "true")}
                  >
                    <Text
                      style={{ fontSize: '20px' }} // Adjust the font size as needed
                      color={
                        newAttributes.default_mint_value.boolean_attribute_value
                          ?.value === true
                          ? "#F5F6FA"
                          : "#3980F3"
                      }
                    >
                      Yes
                    </Text>
                  </Flex>
                  <Flex
                    borderRadius="0px 4px 4px 0px"
                    border="1px solid #3980F3"
                    height="48px"
                    width="130.667px"
                    justifyContent="center"
                    alignItems="center"
                    bgColor={
                      newAttributes.default_mint_value.boolean_attribute_value
                        ?.value === false
                        ? "#3980F3"
                        : ""
                    }
                    _hover={{
                      cursor: "pointer",
                      bgColor: `${newAttributes.default_mint_value.boolean_attribute_value
                        ?.value === false
                        ? "#3980F3"
                        : "#DADEF2"
                        }`,
                    }}
                    onClick={() => handleAttribute("value", "false")}
                  >
                    <Text
                      color={
                        newAttributes.default_mint_value.boolean_attribute_value
                          ?.value === false
                          ? "#F5F6FA"
                          : "#3980F3"
                      }
                    >
                      No
                    </Text>
                  </Flex> */}
                </>
              )}

              {/* number */}
              {newAttributes.data_type === "number" && (
                <>
                  <NumberInput
                    border={"white"}
                    focusBorderColor='white'
                    variant='unstyled'
                    size="md"
                    color="black"
                    width="10rem"
                    className=" text-Act7 "
                    // className={` w-full h-12 pl-5 text-xl border-Act6 placeholder-Act6 placeholder-opacity-30 rounded-md border border-dashed duration-300 relative`}
                    defaultValue={
                      newAttributes.default_mint_value.number_attribute_value
                        ?.value
                    }
                    precision={2}
                    step={0.1}
                    onChange={(e) => handleAttribute("value", e.toLowerCase())}
                  >
                    <NumberInputField />
                    <NumberInputStepper >
                      <NumberIncrementStepper className="  text-Act7" />
                      <NumberDecrementStepper className=" text-Act7" />
                    </NumberInputStepper>
                  </NumberInput>
                </>
              )}

              {/* string */}
              {/* {console.log(newAttributes.data_type)} */}
              {newAttributes.data_type === "string" && (
                <>
                  <Input
                    placeholder={"Add Value"}
                    className={` text-Act6 outline-none w-full h-12 pl-5 text-xl border-Act6 placeholder-Act6 placeholder-opacity-30 rounded-md border border-dashed duration-300 relative`}
                    defaultValue={
                      newAttributes.default_mint_value.string_attribute_value
                        ?.value
                    }
                    onChange={(e) => handleAttribute("value", e.target.value)}
                  />
                </>
              )}
            </Flex>
            <div
              className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 bg-main2`}
            ></div>
          </Flex>

          <Flex
            width="100%"
            marginTop="15px"
            justifyContent="flex-end"
            alignItems="center"
          >
            <div onClick={() => { cancleCreate() }}>
              <CancelButton></CancelButton>
            </div>
            <div onClick={() => { handleSave() }}>
              <SaveButton></SaveButton>
            </div>
          </Flex>
        </div>
      </>
    );
  };

export default CreateAttribute;
