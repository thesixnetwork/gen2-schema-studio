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
// import { Button, Modal, Box, Typography } from "@";
import { useState, useRef } from "react";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import { styled } from "@mui/material";
import Swal from "sweetalert2";

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
    <div className="w-fit bg-[#D9D9D980] rounded-2xl flex justify-between p-4 items-center text-3xl">
      <div className="flex flex-col gap-y-2">
        {/* <div className="max-w-xl h-16 overflow-scroll">
          <SyntaxHighlighter
            language="go"
            wrapLongLines={true}
            codeTagProps={{
              style: {
                fontSize: "16px",
                lineHeight: "1",
              },
            }}
          >
            {props.metaData}
          </SyntaxHighlighter>
        </div> */}
      </div>
      <div className="flex flex-col w-90">
        <div>
          <span className="text-sm font-bold">Operator</span>
          <div className="flex">
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
          <div className="flex">
            <Menu
              nodeName="equalNode"
              title="="
              handleDoubleClickAddNode={props.handleDoubleClickAddNode}
            />
            <Menu
              nodeName="notEqualNode"
              title="≠"
              handleDoubleClickAddNode={props.handleDoubleClickAddNode}
            />
          </div>
          <div className="flex">
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
        <div className="flex">
          <div className="flex flex-col">
            <span className="text-sm font-bold">Operand</span>
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
        <div>
          <span className="text-sm font-bold">AI Generate</span>
          <button
            className="px-4 flex items-center justify-center rounded-md border text-lg hover:scale-110 duration-300"
            onClick={onOpen}
          >
            ☻ Generate
          </button>
          {/* <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Lorem count={2} />
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="ghost">Secondary Action</Button>
                </ModalFooter>
              </ModalContent>
            </Modal> */}
          {/* <input
                id="1"
                type="text"
                autoFocus
                className={`text-black bg-transparent text-md border-[1px] focus:border-[#D9D9D9DD] placeholder-gray-300 border-dashed border-[#D9D9D9DD] p-1 focus:outline-none focus:scale-105 duration-1000 w-[100%] h-[${20}px]`}
                placeholder={""}
                onChange={(e) => {
                  handleInput(e);
                }}
              /> */}
          {/* <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <Box sx={style}>
              <Text id="modal-modal-title" variant="h6" color={"black"}>
                Generate trees by input
              </Text>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>First name</FormLabel>
                  <Input ref={initialRef} placeholder="First name" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Last name</FormLabel>
                  <Input placeholder="Last name" />
                </FormControl>
              </ModalBody>
              <div className="w-full flex justify-center gap-x-4">
                <Button variant="outlined" onClick={processGPT}>
                  processGPT
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => console.log(outputFromGPT)}
                >
                  output
                </Button>
              </div>
              <div className="py-4">
                <Text sx={{ color: "black" }}>output: {outputFromGPT}</Text>
              </div>
              <div className="w-full flex justify-center gap-x-4">
                <Button variant="outlined" onClick={handleCreate}>
                  Create
                </Button>
                <Button color="error" variant="outlined" onClick={onClose}>
                  Discard
                </Button>
              </div>
            </Box>
          </Modal> */}
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay bg="blackAlpha.800"/>
            <ModalContent bg="rgba(0, 0, 0, 0.6)">
              <ModalHeader color={"white"} textAlign={"center"}>
                ☻ AI Generate
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
                    <Button colorScheme="white" onClick={processGPT} variant={"outline"} ml={4}  _hover={{ borderColor: "blue.500", color:"blue.500" }}>
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
                <Button colorScheme="white" variant='outline' onClick={handleCreate} mr={4}  _hover={{ borderColor: "blue.500", color:"blue.500" }}>
                  Generate
                </Button>
                <Button onClick={onClose} colorScheme="white"  variant='outline' mr={3} _hover={{ borderColor: "blue.500", color:"blue.500" }}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}
