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
  subTitle?: string;
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
        <ModalOverlay bg="rgba(135, 140, 168, 0.5)" backdropFilter="blur(5px) " />
        <ModalContent bg="rgba(135, 140, 168, 0.8)" p={4}>
          <ModalHeader
            color={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            p={0}
          >
            {props.type === "success" ? (
              <Image alt="success-img" src={WarningCircle} className="w-24" />
            ) : (
              <Image alt="warning-img" src={WarningCircle} className="w-24" />
            )}
          </ModalHeader>
          <ModalBody textAlign={"center"}>
            <p className=" font-bold text-xl">{props.title}</p>
            <p className=" text-md">{props.subTitle}</p>
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Button
              colorScheme="rgba(135, 140, 168, 1)"
              variant="outline"
              onClick={handleCloseButton}
              mr={4}
              _hover={{ borderColor: "blue.500", color: "blue.500" }}
              bgColor={"rgba(135, 140, 168, 1)"}
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
