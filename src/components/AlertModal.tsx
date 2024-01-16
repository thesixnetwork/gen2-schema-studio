import Swal, { SweetAlertIcon } from "sweetalert2";
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
import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import WarningCircle from "../../public/pic/WarningCircle.png";
interface Props {
  title: string;
  type: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AlertModal = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClose, setIsClose] = useState(true);
  //   const initialRef = useRef(null);
  //   const finalRef = useRef(null);

  const handleClose = () => {
    onClose();
    props.setIsOpen(false)
  };

  const handleCloseButton = () => {
    setIsClose(true);
    props.setIsOpen(false);
    console.log("dddd");
    onClose();
  };

  useEffect(() => {
    props.isOpen && onOpen();
  }, [props.isOpen]);

  useEffect(() => {
    !props.isOpen && onClose();
  }, [isClose]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(5px) " />
        <ModalContent bg="rgba(0, 0, 0, 0.6)" padding={4}>
          <ModalHeader
            color={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {props.type === "success" ? (
              <Image alt="success-img" src={WarningCircle} className="w-24" />
            ) : (
              <Image alt="warning-img" src={WarningCircle} className="w-24" />
            )}
          </ModalHeader>
          <ModalBody pb={6} textAlign={"center"}>
            <span className="ml-1 font-bold text-xl">{props.title}</span>
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Button
              colorScheme="#2F3030"
              variant="outline"
              onClick={handleCloseButton}
              mr={4}
              _hover={{ borderColor: "blue.500", color: "blue.500" }}
              bgColor={"#2F3030"}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AlertModal;
