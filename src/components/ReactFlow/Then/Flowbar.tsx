import Menu from "./Sidebar/Menu";
import {
  Button,
  Modal,
  Box,
  Text,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Flex,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import OpenAI from "openai";
import Swal from "sweetalert2";
import GenerateGPTimg from "../../../../public/pic/GenerateGPT.png";
import GenerateGPTimgWhite from "../../../../public/pic/GenerateGPT-white.png";
import Image from "next/image";

interface FlowbarProps {
  metaData: string;
  selectedAttribute: string | number | boolean;
  actionName: string;
  setMetaData: React.Dispatch<React.SetStateAction<string>>;
  setIsGenerateGPT: React.Dispatch<React.SetStateAction<boolean>>;
  handleDoubleClickAddNode: (type: string) => void;
  type: string;
}

export default function Flowbar(props: FlowbarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [outputFromGPT, setOutputFromGPT] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const processGPT = async () => {
    let prompt;
    if (props.type === "attribute") {
      prompt = `I want to transform from statement text into programming condition comparison. For example the statement is then decrease points 50 the result will be meta.SetNumber('points', meta.GetNumber('points') + 50) Where meta.GetNumber means data type of 'point' is number. meta.GetString would be character (string) and meta.GetBoolean would be boolean. Here are some rules. There are only 3 actions is increase decrease and set if type are number there will have 3 actions but if type are string and boolean actions will be only set and the answer should be only meta function do not provide any guildline if the statement is\n\"${inputValue}\"\n\n\n\nWhat would be the answer ===>`;
    } else if (props.type === "transfer") {
      prompt = `I want to transform from statement text into programming condition comparison. For example the statement is then transfer points to tokenId amount 200 the result will be meta.TransferNumber('points', params['tokenId'].GetString(), 200)  and the another example is transfer points to tokenId amount points the result will be meta.TransferNumber('points', params['token_id'].GetString(), meta.GetNumber('points'))  if the statement is\n\"${inputValue}\"\n\n\n\nWhat would be the answer ===>`;
    }
    const openai = new OpenAI({
      apiKey: process.env.NEXT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const removeLeadingTrailingSpace = (text: string) => {
      let startIndex = 0;
      while (startIndex < text.length && text[startIndex].trim() === "") {
        startIndex++;
      }

      let endIndex = text.length - 1;
      while (endIndex >= 0 && text[endIndex].trim() === "") {
        endIndex--;
      }

      return text.substring(startIndex, endIndex + 1);
    };

    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct-0914",
        prompt: prompt ?? "",
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log(response);

      setOutputFromGPT(removeLeadingTrailingSpace(response.choices[0].text));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = () => {
    onClose();
    if (!outputFromGPT.startsWith("meta")) {
      Swal.fire({
        icon: "error",
        title: "Output must start with meta",
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      props.setMetaData(outputFromGPT);
      props.setIsGenerateGPT(true);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="w-[266px] h-[600px] bg-[#D9D9D980] rounded-2xl p-4 items-center flex flex-col justify-between">
      <div className="flex flex-col items-center justify-between h-full">
        {props.selectedAttribute === "number" ||
        props.selectedAttribute === "float" ||
        props.selectedAttribute === "boolean" ||
        props.selectedAttribute === "string" ? (
          <>
            <div className="flex flex-col justify-center items-center gap-y-2">
              <h2>Function</h2>
              {props.selectedAttribute === "number" ||
              props.selectedAttribute === "float" ? (
                <div className="flex">
                  <Menu
                    nodeName="increaseNode"
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                  <Menu
                    nodeName="decreaseNode"
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                  <Menu
                    nodeName="setNode"
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                </div>
              ) : (
                (props.selectedAttribute === "boolean" ||
                  props.selectedAttribute === "string") && (
                  <>
                    <Menu
                      nodeName="setNode"
                      handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                    />
                  </>
                )
              )}
            </div>
            <div className="flex flex-col justify-center items-center gap-y-2 mb-20">
              <h2>Operand</h2>
              <div className="flex">
                <Menu
                  nodeName="valueNode"
                  handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                />
                <Menu
                  nodeName="attributeNode"
                  handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                />
                <Menu
                  nodeName="paramNode"
                  handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                />
              </div>
            </div>
          </>
        ) : props.selectedAttribute === "none" ? (
          <div className="flex h-full flex-col justify-end items-center gap-y-2 mb-20">
            <div className="flex flex-col items-center justify-center">
              <h2 className="pb-2">Available Operand</h2>
              <div className="flex">
                <Menu
                  nodeName="valueNode"
                  handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                />
                <Menu
                  nodeName="attributeNode"
                  handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                />
                <Menu
                  nodeName="paramNode"
                  handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center h-full">
              <p>Please Select Your Attribute</p>
            </div>
          </>
        )}
      </div>
      <div>
        <span className="text-sm font-bold">AI Generate</span>
        <button
          className="px-4 flex items-center justify-center rounded-md border border-[#3980F3] text-lg hover:scale-110 duration-300 text-[#3980F3]"
          onClick={onOpen}
        >
          <Image src={GenerateGPTimg} alt="generate-icon" width={20} />{" "}
          <span className="ml-1">Generate</span>
        </button>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
          colorScheme="red"
        >
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent bg="rgba(0, 0, 0, 0.6)">
            <ModalHeader
              color={"white"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Image src={GenerateGPTimgWhite} alt="generate-icon" width={20} />{" "}
              <Text ml={1}>AI Generate</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel fontWeight="semibold" color="white">
                  Input
                </FormLabel>
                <Flex>
                  <Input
                    ref={initialRef}
                    placeholder="example: check_in and tier is gold"
                    color={"white"}
                    onChange={(e) => {
                      handleInput(e);
                    }}
                  />
                  <Button
                    colorScheme="white"
                    onClick={processGPT}
                    variant={"outline"}
                    ml={4}
                    _hover={{ borderColor: "blue.500", color: "blue.500" }}
                  >
                    Process
                  </Button>
                </Flex>
              </FormControl>
              <Box>
                <Text fontWeight="semibold" color="white" mb="1rem">
                  Output
                </Text>
                <Box bgColor="#2D2D2F" padding={4} borderRadius={6}>
                  <Text color="white" mb="1rem">
                    {outputFromGPT}
                  </Text>
                </Box>
              </Box>
            </ModalBody>

            <ModalFooter justifyContent={"center"}>
              <Button
                colorScheme="white"
                variant="outline"
                onClick={handleCreate}
                mr={4}
                _hover={{ borderColor: "blue.500", color: "blue.500" }}
              >
                Generate
              </Button>
              <Button
                onClick={onClose}
                colorScheme="white"
                variant="outline"
                mr={3}
                _hover={{ borderColor: "blue.500", color: "blue.500" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
