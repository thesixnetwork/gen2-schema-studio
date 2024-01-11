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
import Image from "next/image";
import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import WarningCircle from "../../public/pic/WarningCircle.png";
interface Props {
  title: string;
  confirmButtonTitle: string;
  function: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ConfirmModalChakra = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  //   const initialRef = useRef(null);
  //   const finalRef = useRef(null);

  const handleConfirm = () => {
    props.function();
    props.setIsOpen(false);
    onClose();
  };
  const handleCancel = () => {
    props.setIsOpen(false);
    onClose();
  };

  const handleClose = () =>{
    onClose()
    props.setIsOpen(false)
  }

  useEffect(() => {
    props.isOpen && onOpen();
    console.log("props.isOpen", props.isOpen)
  }, [props.isOpen]);


  return (
    <>
      <Modal
      
        // initialFocusRef={initialRef}
        // finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(5px) "/>
        <ModalContent bg="rgba(0, 0, 0, 0.6)" padding={4}>
          <ModalHeader
            color={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image alt="warning-img" src={WarningCircle} className="w-24" />{" "}
          </ModalHeader>
          <ModalBody pb={6} textAlign={"center"}>
            <span className="ml-1 font-bold text-xl">{props.title}</span>
          </ModalBody>

          <ModalFooter justifyContent={"center"}>
            <Button
              colorScheme="#2F3030"
              variant="outline"
              onClick={handleConfirm}
              mr={4}
              _hover={{ borderColor: "blue.500", color: "blue.500" }}
              bgColor={"#2F3030"}
            >
              {props.confirmButtonTitle}
            </Button>
            <Button
              onClick={handleCancel}
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
    </>
  );
};

export default ConfirmModalChakra;