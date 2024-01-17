"use client";

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
  Image,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { ConfirmModal } from "@/components/ConfirmModal";
import AlertModal from "@/components/AlertModal";
import { ISchemaInfo } from "@/type/Nftmngr";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import ENV from "@/utils/ENV";
import { EncodeObject, OfflineSigner, Registry } from "@cosmjs/proto-signing";
import { MsgCreateNFTSchema } from "@/type/tx";
import { SigningStargateClient } from "@cosmjs/stargate";
import { GasPrice } from "@cosmjs/stargate/build/fee";
import ConfirmModalChakra from "./ConfirmModalChakra";
import { getCookie } from "@/service/getCookie";
import Loading from "./Loading";
interface Props {
  text: string;
  isAccount?: any;
  offlineSigner?: any;
  isDaft?: ISchemaInfo;
  schemacode?: string;
  onClick: () => void;
}
const CustomCardDeploy: React.FC<Props> = ({
  text,
  onClick,
  isAccount,
  offlineSigner,
  isDaft,
  schemacode,
}) => {
  const { data: session } = useSession();
  const [rpcEndpoint, setRpcEndpoint] = useState(ENV.RPC_FIVENET2);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const getTokenFromCookie = getCookie("token");
  const [showAlert, setShowAlert] = useState("none");
  const [isOpen,setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleDeploy = async (str: string) => {
    // console.log(2222222)
    // console.log(str)
    // const isConfirmed = await ConfirmModal(
    //   `Are you sure you want to ${str}?`,
    //   str
    // );

    // if (isConfirmed) {
    //   // Perform the deployment logic
    //   console.log(isDaft);
    //   console.log("Deployment confirmed");
    // } else {
    //   <AlertModal title="Deployment failed" type="error" />;
    //   console.log("Deployment canceled");
    // }
    setShowModal(true);
  };

  const deploy = async () => {
    let msgArray: Array<EncodeObject> = [];
    setLoading(true)
    const encodeBase64Schema = Buffer.from(
      JSON.stringify(isDaft?.schema_info)
    ).toString("base64");
    console.log("schemaInfo", isDaft);

    if (!isDaft) {
      await Swal.fire({
        position: "center",
        icon: "error",
        title: "NOT FOUND SCHEMA INFO",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    if (isAccount && offlineSigner && isDaft) {
      const msgCreateNFTSchema: MsgCreateNFTSchema = {
        creator: isAccount[0].address,
        nftSchemaBase64: encodeBase64Schema,
      };
      const msgCreateNFTSchemaEndcode: EncodeObject = {
        typeUrl: "/thesixnetwork.sixnft.nftmngr.MsgCreateNFTSchema",
        value: MsgCreateNFTSchema.fromPartial(msgCreateNFTSchema),
      };
      // const msgCreateNFTSchemaEndcode = await TomsgCreateNFTSchema(msgCreateNFTSchema)
      const types = [
        [
          "/thesixnetwork.sixnft.nftmngr.MsgCreateNFTSchema",
          MsgCreateNFTSchema,
        ],
      ];

      // const registry = new Registry(types);
      const registry = new Registry();
      registry.register(
        "/thesixnetwork.sixnft.nftmngr.MsgCreateNFTSchema",
        MsgCreateNFTSchema
      );
      // const registry = new Registry().register(types);

      const rpcClient = await SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        offlineSigner,
        {
          registry: registry,
          gasPrice: GasPrice.fromString("1.25usix"),
        }
      );

      console.log("rpcClient", rpcClient);
      msgArray.push(msgCreateNFTSchemaEndcode);

      try {
        const txResponse = await rpcClient.signAndBroadcast(
          isAccount[0].address,
          msgArray,
          "auto",
          ``
        );
        console.log("tx-----", txResponse);
        const apiUrl = `${ENV.API_URL}schema/set_schema_info`;
        console.log("url",apiUrl)
        const requestData = {
          payload: {
            schema_code: schemacode,
            status: "Testnet",
            current_state: "7",
          },
        };
        await axios
          .post(apiUrl, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${getTokenFromCookie}`,
            },
          })
          .then((response) => {
            console.log("API Response Deploy :", response.data);
            console.log(requestData);
            console.log("success ja");
            // You can handle the API response here
            setShowAlert("success");
            setIsOpen(true)
            setLoading(false)
          })
          .catch((error) => {
            console.log("fail ja");
            setShowAlert("success");
            setIsOpen(true)
            console.error("API Error:", error);
            setLoading(false)

            // Handle errors here
          });

        // router.push("/home");
      } catch (error) {
        console.log("fail ja");
        setShowAlert("fail");
        setIsOpen(true)
        console.log("showAlert",showAlert)
        console.error(error);
        setLoading(false)
      }
    }
  };

  useEffect(() => {
    if (showAlert === "success" || showAlert === "fail") {
      // Display AlertModal or take other actions
      console.log("showAlert changed:", showAlert);
    }
  }, [showAlert]);

  return (
    <>
    {loading && <Loading />}
      {showAlert === "success" && isOpen && (
        <AlertModal title="Deployed successfully" type="warning" isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      {showAlert === "fail" && isOpen  && (
        <AlertModal title="Something went wrong" type="error" isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      {showModal && (
        <ConfirmModalChakra
          title="Are you sure to deploy on testnet?"
          function={() => deploy()}
          isOpen={showModal}
          setIsOpen={setShowModal}
          confirmButtonTitle="Yes, deploy"
        />
      )}
      {text === "Mainnet" && (
        <Flex
          width="200px"
          height="265px"
          borderRadius="4px"
          border="1px solid #3980F3"
          justifyContent="center"
          alignItems="center"
          _hover={{
            bgColor: "#DADEF2",
            color: "blue", // เปลี่ยน color ของ Text เมื่อ hover
            cursor: "pointer",
            transform: "scale(1.05)",
            transitionDuration: "200ms",
          }}
          onClick={() => handleDeploy("Deploy Mainnet")}
        >
          <Flex
            width="auto"
            height="auto"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            <Image src="/pic/logo-six1.png" alt="Mainnet" />
            <span className="text-main2 font-bold pt-4">
              Deploy to {text}
            </span>
          </Flex>
        </Flex>
      )}
      {text === "Testnet" && (
        <Flex
          width="200px"
          height="265px"
          borderRadius="4px"
          border="1px solid #3980F3"
          justifyContent="center"
          alignItems="center"
          _hover={{
            bgColor: "#DADEF2",
            color: "blue", // เปลี่ยน color ของ Text เมื่อ hover
            cursor: "pointer",
            transform: "scale(1.05)",
            transitionDuration: "200ms",
          }}
          onClick={() => handleDeploy("Deploy Testnet")}
        >
          <Flex
            width="auto"
            height="auto"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            <Image src="/pic/logo-six1.png" alt="Mainnet" />
            <span className="text-main2 font-bold pt-4">
              Deploy to {text}
            </span>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default CustomCardDeploy;
