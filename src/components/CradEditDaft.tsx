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
import CheckErrorI from "@/utils/checkError";

import { ConfirmModal } from "@/components/ConfirmModal";
import SaveButton from "./button/SaveButton";
import CancelButton from "./button/CancelButton";
import { isError } from "util";
import InputCardOneLine from "./state1/InputCardOneLine";
import InputSelectCard from "./state3/InputSelectCard";
import ConfirmModalChakra from "./ConfirmModalChakra";


// import { Button, ButtonGroup } from '@chakra-ui/react'

const CaradEditDaft: React.FC<{
  isAttribute: ItokenAttributes;
  rawData: ISchemaInfo;
  setOnEdit: Dispatch<SetStateAction<boolean>>;
  setOnCreate?: Dispatch<SetStateAction<boolean>>;
  setIsAttributes: Dispatch<SetStateAction<ItokenAttributes[]>>;
  isAttributes: ItokenAttributes[];
  indexEdit: number;
  isState: number;
  onEdit?: boolean;
  schemacode: string;
  onCreate?: boolean;
  setOnEditOrCreate: Dispatch<SetStateAction<boolean>>;
}> = ({
  isAttribute,
  rawData,
  setOnEdit,
  isAttributes,
  setIsAttributes,
  indexEdit,
  isState,
  onEdit,
  onCreate,
  schemacode,
  setOnEditOrCreate
}) => {
    const { data: session } = useSession();
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState(isAttribute.name);
    const [dataType, setDataType] = useState(isAttribute.data_type)
    const [traitType, setTraitType] = useState(isAttribute.display_option.opensea.trait_type)
    const [isError, setIsError] = useState(false);
    const [isOpen, setIsOpen] = useState(false)


    const [newAttributes, setNewAttributes] =
      useState<ItokenAttributes>(isAttribute);

    const [Attribute, setAttribute] = useState(isAttribute);

    const [Attribute2, setAttribute2] = useState<ItokenAttributes[]>(
      isState === 4
        ? rawData.schema_info.onchain_data.nft_attributes
        : rawData.schema_info.onchain_data.token_attributes
    );
    const att4 = rawData.schema_info.onchain_data.nft_attributes;
    const att5 = rawData.schema_info.onchain_data.token_attributes;
    const [checkDatatype, setAcheckDatatype] = useState(Attribute.data_type);
    const [checkDatatype2, setAcheckDatatype2] = useState(Attribute.data_type);
    const [isDefaultValue, setIsDefaultValue] = useState<string | number>(
      Attribute.default_mint_value.string_attribute_value?.value ||
      Attribute.default_mint_value.number_attribute_value?.value ||
      Attribute.default_mint_value.float_attribute_value?.value ||
      `${Attribute.default_mint_value.boolean_attribute_value?.value}`
    );

    // console.log(Attribute2);
    const handleInput = async (
      e: React.ChangeEvent<HTMLInputElement>,
      type: string
    ) => {
      // console.log(e)
      // console.log("Attribute",Attribute)
      const element = document.getElementById(`name ${indexEdit}`);
      const filteredArray = Attribute2.filter(
        (item) => item.name === e.target.value
      );
      console.log(filteredArray);
      // console.log(checkDatatype2);
      const error = await CheckErrorI(
        e.target.value,
        setErrorMessage,
        att4,
        att5,
        Attribute.name,
        isState
      );
      if (element) {
        if (error) {
          element.style.borderColor = "red";
        } else {
          element.style.borderColor = "#DADEF2"; // Set it to an empty string to remove the border color
        }
      }
      return;
    };

    const handleInputChangeName = async (value: string) => {
      setName(value);
      const element = document.getElementById(`name ${indexEdit}`);
      const filteredArray = Attribute2.filter(
        (item) => item.name === value
      );
      console.log(filteredArray);
      // console.log(checkDatatype2);
      const error = await CheckErrorI(
        value,
        setErrorMessage,
        att4,
        att5,
        Attribute.name,
        isState
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

      if (value === "string") {
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
      if (value === "number") {
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
      if (value === "boolean") {
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

    // console.log("newAttributes",newAttributes)

    function checkType(value: string) {
      const parsedValue = parseFloat(value);
      if (Number.isInteger(parsedValue)) {
        // console.log(`${value} is an integer.`);
        return false;
      } else {
        // console.log(`${value} is a float.`);
        return true;
      }
    }
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
        let data_type;
        if (newAttributes.data_type === "string") {
          default_mint_value = {
            string_attribute_value: {
              value: value,
            },
          };
          data_type = "string";
        }
        if (
          newAttributes.data_type === "number" ||
          newAttributes.data_type === "float"
        ) {
          const chectFloat = checkType(value);
          if (chectFloat) {
            default_mint_value = {
              float_attribute_value: {
                value: parseFloat(value),
              },
            };
            data_type = "float";

          } else {
            default_mint_value = {
              number_attribute_value: {
                value: parseFloat(value).toString(),
              },
            };
            data_type = "number";
          }
        }
        // if (newAttributes.data_type === "float") {
        //   default_mint_value = {
        //     float_attribute_value: {
        //       value: parseFloat(value),
        //     },
        //   };
        // }
        if (newAttributes.data_type === "boolean") {
          // console.log("value ==>", value);
          default_mint_value = {
            boolean_attribute_value: {
              value: value === "false" ? false : Boolean(value),
            },
          };
          data_type = "boolean";
        }
        console.log(default_mint_value)
        setNewAttributes((prevPerson) => ({
          ...prevPerson,
          default_mint_value: default_mint_value!,
          data_type: data_type!,
        }));
      }
    };

    const handleValue = (type: string, value: string | number) => {
      if (type === "string") {
        // console.log(value);
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

    const cancleEdit = async () => {
      setOnEdit(false);
      setOnEditOrCreate(false)
    };

    console.log("errorMessage", errorMessage);
    const handleSave = async () => {
      if (errorMessage) {
        await ConfirmModal(errorMessage, "Error");
        console.log("Have error validate");
        return;
      }

      isAttributes[indexEdit] = newAttributes;
      let onchain_data;
      const apiUrl = `${ENV.Client_API_URL}/schema/set_schema_info`;
      if (isState === 4) {
        onchain_data = {
          nft_attributes: isAttributes,
        };
      }
      if (isState === 5) {
        onchain_data = {
          token_attributes: isAttributes,
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


      try {
        const req = await axios.post(apiUrl, requestData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`, // Set the content type to JSON
          },
        });
        const res = req.data;
        // console.log(res);

        if (res.statusCode === "V:0001") {
          setOnEdit(false);
          setOnEditOrCreate(false)
          return;
        } else {
          return;
        }
      } catch (error) {
        console.log("error ", error);
      }

      // setOnCreate(false);
    };

    return (
      <>
        <div className=" min-h-[60vh] w-full flex flex-col justify-between items-center  ">
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
            // minWidth="200px"
            // border="1px solid #DADEF2"
            // borderRadius="12px"
            // p={8}
            marginTop="15px"
            className="w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative"
            id="namenaja"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex>
              <Box>
                <p className="text-main2 text-2xl font-bold">Name</p>
              </Box>
            </Flex>
            <Flex flexDirection="column" height="auto">
              <Box>
                <Input
                  minWidth="390px"
                  color="black"
                  placeholder={"Add Attribute Name"}
                  className={`outline-none w-full h-12 pl-5 text-xl border-Act6 placeholder-Act6 placeholder-opacity-30 rounded-md border border-dashed duration-300 relative`}
                  id={`name ${indexEdit}`}
                  defaultValue={isAttribute.name}
                  onChange={(e) => {
                    handleInput(e, "name"),
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
            marginTop="15px"
            className="w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <p className="text-main2 text-2xl font-bold">Data Type</p>
            </Box>
            <Flex>
              <Flex
                borderRadius="4px 0px 0px 4px"
                border="1px solid #3980F3"
                height="48px"
                width="130.667px"
                justifyContent="center"
                alignItems="center"
                bgColor={checkDatatype === "string" ? "#3980F3" : ""}
                _hover={{
                  cursor: "pointer",
                  bgColor: `${checkDatatype === "string" ? "#3980F3" : "#DADEF2"
                    }`,
                }}
                onClick={() => {
                  handleDatatype("string"),
                    handleAttribute("data_type", "string");
                }}
              >
                <Text color={checkDatatype === "string" ? "#F5F6FA" : "#3980F3"}>
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
                bgColor={checkDatatype === "number" ? "#3980F3" : ""}
                _hover={{
                  cursor: "pointer",
                  bgColor: `${checkDatatype === "number" ? "#3980F3" : "#DADEF2"
                    }`,
                }}
                onClick={() => {
                  handleDatatype("number"),
                    handleAttribute("data_type", "number");
                }}
              >
                <Text color={checkDatatype === "number" ? "#F5F6FA" : "#3980F3"}>
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
                bgColor={checkDatatype === "boolean" ? "#3980F3" : ""}
                _hover={{
                  cursor: "pointer",
                  bgColor: `${checkDatatype === "boolean" ? "#3980F3" : "#DADEF2"
                    }`,
                }}
                onClick={() => {
                  handleDatatype("boolean"),
                    handleAttribute("data_type", "boolean");
                }}
              >
                <Text color={checkDatatype === "boolean" ? "#F5F6FA" : "#3980F3"}>
                  Y/N
                </Text>
              </Flex>
            </Flex>
            <div
              className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 bg-main2`}
            ></div>
          </Flex> */}
          {/* <Flex
            // flexWrap="wrap"
            // width="60%"
            // border="1px solid #DADEF2"
            // borderRadius="12px"
            // p={8}
            // marginTop="15px"
            marginTop="15px"
            className="w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <p className="text-main2 text-2xl font-bold">Trait Type</p>
            </Box>
            <Box>
              <Input
                color="black"
                minWidth="390px"
                // id="cr-name"
                placeholder={"Add Attribute Name"}
                className={`outline-none w-full h-12 pl-5 text-xl border-Act6 placeholder-Act6 placeholder-opacity-30 rounded-md border border-dashed duration-300 relative`}
                defaultValue={isAttribute.display_option.opensea.trait_type}
              />
            </Box>
            <div
              className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 bg-main2`}
            ></div>
          </Flex> */}
          <Flex
            className="w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative"
          >
            <Box>
              <p className="text-main2 text-2xl font-bold">Value</p>
            </Box>
            <Flex>
              {/* boolean */}
              {checkDatatype === "boolean" && (
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
              {(checkDatatype === "number" || checkDatatype === "float") && (
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
                      newAttributes.default_mint_value.number_attribute_value?.value || newAttributes.default_mint_value.float_attribute_value?.value
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
              {checkDatatype === "string" && (
                <>
                  <Input
                    minWidth="390px"
                    placeholder={"Add Value"}
                    className={`text-Act6 w-full h-12 pl-5 text-xl border-Act6 placeholder-Act6 placeholder-opacity-30 rounded-md border border-dashed duration-300 relative`}
                    defaultValue={isDefaultValue}
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

            <div onClick={() => { cancleEdit() }}>
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

export default CaradEditDaft;
