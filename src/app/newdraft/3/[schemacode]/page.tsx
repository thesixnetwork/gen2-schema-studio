'use client'

import TapState from "@/components/TapState";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react"
import BackPageButton from "@/components/BackPageButton";
import NextPageButton from "@/components/NextPageButton";
import Stepmenu from "@/components/Stepmenu";
import NewCollecitonCard from "@/components/state3/NewCollectionCard";
import AttributeCard from "@/components/state3/AttributeCard";
import InputCardOneLine from "@/components/state1/InputCardOneLine";
import InputSelectCard from "@/components/state3/InputSelectCard"
import CancelButton from "@/components/button/CancelButton";
import SaveButton from "@/components/button/SaveButton";
import deleate_icon from '../../../../../public/pic/deleate_attribute_card.png'
import Image from 'next/image'
import { spaceTest, specialCharsTest, specialCharsTestTraitType, uppercaseTest } from "@/validateService/validate";

export default function Page({
    params: { schemacode },
}: {
    params: { schemacode: string };
}) {
    const { data: session } = useSession()
    const [isMain, setIsMain] = useState(true)
    const [isNewAttribute, setIsNewAttribute] = useState(false)
    const [isDaft, setIsDaft] = useState(null)
    const [name, setName] = useState("")
    const [traitType, setTraitType] = useState("")
    const [dataType, setDataType] = useState("")
    const [attributeIndex, setAttributeIndex] = useState(0)
    const [validateStateName, setValidateStateName] = useState(true)
    const [validateStateTraitType, setValidateStateTraitType] = useState(true)
    const [errorMessageTraitType, setErrorMessageTraitType] = useState("")
    const [errorMessageName, setErrorMessageName] = useState("")


    useEffect(() => {
        (async () => {
            try {
                const schemaInfo = await getSchemaInfo(schemacode);
                setIsDaft(schemaInfo)
                // Process the response or update state as needed
            } catch (error) {
                // Handle errors
                console.error('Error fetching data:', error);
            }
        })();
    }, [schemacode]);

    const getDraftInfo = () => {
        if (isDaft !== "") {
            console.log("isDaft:", isDaft)
        }
    }

    useEffect(() => {
        getDraftInfo()
    }, [isDaft])

    const handleInputChangeChaDataType = (value: string) => {
        setDataType(value);
    };

    const handleInputChangeName = (value: string) => {
        setName(value);
    };


    const handleInputChangeTraitType = (value: string) => {
        setTraitType(value);
    };


    const openSettingBar = (name: string, dataType: string, traitType: string, index: number) => {
        setAttributeIndex(index)
        setDataType(dataType)
        setName(name)
        setTraitType(traitType)
        setIsMain(false)

    }

    const canCel = () => {
        setIsMain(true)
        if (isNewAttribute) {
            deleteAttribute(attributeIndex)
        }
        setIsNewAttribute(false)
    }

    const saveAttribute = () => {
        if (isDaft !== null) {
            const updatedAttributes = [...isDaft.schema_info.origin_data.origin_attributes];
            const updatedAttribute = {
                ...updatedAttributes[attributeIndex],
                name: name,
                data_type: dataType,
                display_option: {
                    opensea: {
                        ...updatedAttributes[attributeIndex].display_option.opensea,
                        trait_type: traitType,
                    },
                    bool_true_value: "",
                    bool_false_value: "",
                },
            };

            updatedAttributes[attributeIndex] = updatedAttribute;

            setIsDaft({
                ...isDaft,
                schema_info: {
                    ...isDaft.schema_info,
                    origin_data: {
                        ...isDaft.schema_info.origin_data,
                        origin_attributes: updatedAttributes,
                    },
                },
            });

            setIsMain(true); // Set back to the main view after saving
        }
    };

    const createNewAttribute = () => {
        // Assuming you have a default structure for a new attribute
        const newAttribute = {
            display_option: {
                opensea: {
                    display_type: "",
                    trait_type: "",
                    max_value: "0",
                },
                bool_true_value: "",
                bool_false_value: "",
            },
            name: "",
            data_type: "string", // You may set a default data type
            required: false,
            display_value_field: "value",
            default_mint_value: null,
            hidden_overide: false,
            hidden_to_marketplace: false,
        };

        // Add the new attribute to the attributes array
        const updatedAttributes = [...isDaft.schema_info.origin_data.origin_attributes, newAttribute];

        // Set the state to trigger the rendering of the new attribute
        setIsDaft({
            ...isDaft,
            schema_info: {
                ...isDaft.schema_info,
                origin_data: {
                    ...isDaft.schema_info.origin_data,
                    origin_attributes: updatedAttributes,
                },
            },
        });

        // Set the index to the newly added attribute
        setAttributeIndex(updatedAttributes.length - 1);

        // Set the default values for the input fields
        setDataType(newAttribute.data_type);
        setName(newAttribute.name);
        setTraitType(newAttribute.display_option.opensea.trait_type);

        // Switch to the editing mode
        setIsMain(false);
        setIsNewAttribute(true)
    };

    const deleteAttribute = (attributeIndex: number) => {
        if (isDaft !== null) {
            const updatedAttributes = [...isDaft.schema_info.origin_data.origin_attributes];
            updatedAttributes.splice(attributeIndex, 1);

            setIsDaft({
                ...isDaft,
                schema_info: {
                    ...isDaft.schema_info,
                    origin_data: {
                        ...isDaft.schema_info.origin_data,
                        origin_attributes: updatedAttributes,
                    },
                },
            });

            // If there are no more attributes, switch back to the main view
            if (updatedAttributes.length === 0) {
                setIsMain(true);
            } else {
                // Set the index to the previous attribute if available
                const newIndex = Math.max(0, attributeIndex - 1);
                setAttributeIndex(newIndex);

                // Set the default values for the input fields based on the new attribute
                const newAttribute = updatedAttributes[newIndex];
                setDataType(newAttribute.data_type);
                setName(newAttribute.name);
                setTraitType(newAttribute.display_option.opensea.trait_type);
            }
        }
    };

    // ------------------------Validate Data -----------------------------------------------//
    const validateName = () => {
        const isNameExists = isAttributeExists(name);
        if (uppercaseTest(name)) {
            setValidateStateName(false);
            setErrorMessageName("Uppercase is not allowed");
        } else if (spaceTest(name)) {
            setValidateStateName(false);
            setErrorMessageName("Space is not allowed");
        } else if (specialCharsTest(name)) {
            setValidateStateName(false);
            setErrorMessageName("Special characters are not allowed");
        } else if (isNameExists && isNewAttribute && (name !== "")) {
            setValidateStateName(false);
            setErrorMessageName(`Attribute with name "${name}" already exists.`);
        } else {
            setValidateStateName(true);
            setErrorMessageName("");
        }
    };

    useEffect(() => {
        validateName();
    }, [name]);

    // Check if the attribute with the given name already exists
    const isAttributeExists = (newAttributeName: string) => {
        if (isDaft !== null) {
            return isDaft.schema_info.origin_data.origin_attributes.some(
                (attribute: string) => attribute.name === newAttributeName
            );
        }
        return false;
    };

    const validateTraitType = () => {
        if (specialCharsTestTraitType(traitType)) {
            setValidateStateTraitType(false);
            setErrorMessageTraitType("Special characters are not allowed");
        } else {
            setValidateStateTraitType(true);
            setErrorMessageTraitType("");
        }
    };

    useEffect(() => {
        validateTraitType();
    }, [traitType]);

    // ------------------------Validate Data -----------------------------------------------//

    return (
        <>
            <div className=" w-full h-full min-h-[100vh] flex flex-col justify-between items-center">
                <Stepmenu schemacode={schemacode} currentStep={3}></Stepmenu>
                {isMain ?
                    <div className=" w-full h-[70vh] grid grid-cols-4 gap-4 overflow-scroll p-4">
                        <div onClick={() => { createNewAttribute() }}>
                            <NewCollecitonCard></NewCollecitonCard>
                        </div>
                        {isDaft !== null && (isDaft.schema_info.origin_data.origin_attributes).map((item, index) => (
                            <div>
                                <div className=" relative w-draftCardWidth hover:scale-105 duration-300 cursor-pointer   " >
                                    <Image
                                        className='z-20 w-7 h-7 hover:scale-110 duration-300 cursor-pointer absolute top-2 right-2'
                                        src={deleate_icon}
                                        alt={'delete'}
                                        onClick={() => deleteAttribute(index)}
                                    ></Image>
                                    <div onClick={() => openSettingBar(item.name, item.data_type, item.display_option.opensea.trait_type, index)}>
                                        <AttributeCard key={index} name={item.name} dataType={item.data_type} traitType={item.display_option.opensea.trait_type}></AttributeCard>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    :
                    <div className=" w-full h-full min-h-[70vh] flex flex-col justify-between items-center">
                        <InputCardOneLine title={"Name"} require={true} placeholder={"Add attribute name"} validate={validateStateName} errorMassage={errorMessageName} value={name} onChange={handleInputChangeName} ></InputCardOneLine>
                        <InputSelectCard title={"Data type"} require={true} value={dataType} onChange={handleInputChangeChaDataType}></InputSelectCard>
                        <InputCardOneLine title={"Trait type"} require={true} placeholder={"Add trait type here"} validate={validateStateTraitType} errorMassage={errorMessageTraitType} value={traitType} onChange={handleInputChangeTraitType} ></InputCardOneLine>
                        <div className=" w-full flex justify-end items-center">
                            <div onClick={() => { canCel() }}>
                                <CancelButton></CancelButton>
                            </div>
                            <div onClick={() => { saveAttribute() }}>
                                <SaveButton></SaveButton>
                            </div>
                        </div>
                    </div>
                }
                {isMain &&

                    <div className=' w-[90%] h-20 flex justify-between items-center'>
                        <BackPageButton></BackPageButton>
                        <div >
                            <NextPageButton></NextPageButton>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

