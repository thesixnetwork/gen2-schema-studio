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
import Menu from "./Sidebar/Menu";

// import SyntaxHighlighter from "react-syntax-highlighter";
import OpenAI from "openai";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import GenerateGPTimg from "../../../../public/pic/GenerateGPT.png";
import GenerateGPTimgWhite from "../../../../public/pic/GenerateGPT-white.png";
import Image from "next/image";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface MetaDataProps {
  metaData: string;
  actionName: string;
  setMetaData: React.Dispatch<React.SetStateAction<string>>;
  setIsGenerateGPT: React.Dispatch<React.SetStateAction<boolean>>;
  handleDoubleClickAddNode: (type: string) => void;
}

export default function Flowbar(props: MetaDataProps) {
  console.log("here", process.env.NEXT_TEST);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState("");
  const [outputFromGPT, setOutputFromGPT] = useState("");
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  // const Robot = styled(SmartToyIcon)({
  //   borderRadius: "16px",
  //   transition: "color 0.3s, border 0.3s",
  //   border: "1px solid white",
  //   cursor: "pointer",
  // });

  const processGPT = async () => {
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
        prompt: `I want to transform from statement text into programming condition comparison. For example the statement is when points are more than 100 the result will be "meta.GetNumber('points') > 100.\nWhere meta.GetNumber means data type of 'point' is number. meta.GetString would be character (string) and meta.GetBoolean would be boolean. Here are some rules.\n- If the attribute data type is boolean , result will be meta.GetBoolean('attributeName') == true \n- more than one comparison join together. For example statement when points are more than 100 and already check in , the result will be meta.GetNumber('points') > 100 && meta.GetBoolean('checked_in') == true\n- These are the symbol which cannot be used '!' for example if not check in the output can't be !meta.GetBoolean('checked_in') the output must be meta.GetBoolean('checked_in') == false and the answer should be only meta function do not provide any guildline \n\nWhat if the statement is\n${inputValue}\n\n\n\nWhat would be the answer ===>`,
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
    console.log(">>", props.metaData);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="w-80 bg-[#DADEF2] flex text-3xl">
      <div className="flex flex-col pl-6 pt-6 gap-y-8">
        <div className="flex">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-main2">Operator</span>
            <div className="flex ">
              <div className="flex flex-col border-r border-Act6 pr-2">
                <Menu
                  nodeName="andNode"
                  title="AND"
                  handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                />
                <Menu
                  nodeName="orNode"
                  title="OR"
                  handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                />
              </div>
              <div className="pl-2">
                <div className="flex">
                  <Menu
                    nodeName="equalNode"
                    title="="
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                  <Menu
                    nodeName="moreThanNode"
                    title=">"
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                  <Menu
                    nodeName="moreThanAndEqualNode"
                    title=">="
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                </div>
                <div className="flex">
                  <Menu
                    nodeName="notEqualNode"
                    title="≠"
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                  <Menu
                    nodeName="lessThanNode"
                    title="<"
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                  <Menu
                    nodeName="lessThanAndEqualNode"
                    title="<="
                    handleDoubleClickAddNode={props.handleDoubleClickAddNode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-main2">Operand</span>
            <div className="flex">
              <Menu
                nodeName="valueNode"
                title="V"
                handleDoubleClickAddNode={props.handleDoubleClickAddNode}
              />
              <Menu
                nodeName="attributeNode"
                title="@"
                handleDoubleClickAddNode={props.handleDoubleClickAddNode}
              />
              <Menu
                nodeName="paramNode"
                title="P"
                handleDoubleClickAddNode={props.handleDoubleClickAddNode}
              />
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-main2">AI Generate</span>
            <button
              className="px-4 flex items-center justify-center rounded-md border border-Act6 text-lg hover:scale-110 duration-300 text-Act6"
              onClick={onOpen}
            >
              <Image src={GenerateGPTimg} alt="generate-icon" width={20} />
              <span className="ml-1">Generate</span>
            </button>
            <Modal
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay bg="blackAlpha.800" />
              <ModalContent bg="rgba(0, 0, 0, 0.6)">
                <ModalHeader
                  color={"white"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Image
                    src={GenerateGPTimgWhite}
                    alt="generate-icon"
                    width={20}
                  />{" "}
                  <Text ml={1}>AI Generate</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="white" mb="1rem">
                      Input
                    </FormLabel>
                    <Flex mb="1rem">
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
                    colorScheme="#2F3030"
                    variant="outline"
                    onClick={handleCreate}
                    mr={4}
                    _hover={{ borderColor: "blue.500", color: "blue.500" }}
                    bgColor={"#2F3030"}
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
      </div>
    </div>
  );
}
