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
  const [rpcEndpoint, setRpcEndpoint] = useState(ENV.RPC_FIVENET);
  const router = useRouter();

  const handleDeploy = async (str: string) => {
    // console.log(2222222)
    // console.log(str)
    const isConfirmed = await ConfirmModal(
      `Are you sure you want to ${str}?`,
      str
    );

    if (isConfirmed) {
      // Perform the deployment logic
      console.log("Deployment confirmed");
      let msgArray: Array<EncodeObject> = [];

      const encodeBase64Schema = Buffer.from(JSON.stringify(isDaft)).toString(
        "base64"
      );
      console.log("schemaInfo", isDaft);

      if(!isDaft){
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

        // try {
        //   const txResponse = await rpcClient.signAndBroadcast(
        //     isAccount[0].address,
        //     msgArray,
        //     "auto",
        //     ``
        //   );
        //   console.log("tx-----", txResponse);
        //   const apiUrl = `${ENV.API_URL}schema/set_schema_info`;
        //   const requestData = {
        //     payload: {
        //       schema_code: schemacode,
        //       status: "Testnet",
        //       current_state: "7",
        //     },
        //   };
        //   await axios
        //     .post(apiUrl, requestData, {
        //       headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${session?.user.accessToken}`,
        //       },
        //     })
        //     .then((response) => {
        //       console.log("API Response Deploy :", response.data);
        //       console.log(requestData);
        //       // You can handle the API response here
        //     })
        //     .catch((error) => {
        //       console.error("API Error:", error);
        //       // Handle errors here
        //     });

        //   await Swal.fire({
        //     position: "center",
        //     icon: "success",
        //     title: "Deployed Successfully",
        //     showConfirmButton: false,
        //     timer: 1500,
        //   });
        //   router.push("/");
        // } catch (error) {
        //   console.error(error);
        //   await Swal.fire({
        //     position: "center",
        //     icon: "error",
        //     title: "Something went wrong",
        //     showConfirmButton: false,
        //     timer: 1500,
        //   });
        // }
      }
    } else {
      // User canceled, do something else or nothing
      console.log("Deployment canceled");
    }
  };

  return (
    <>
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
            <Text color="#44498D" fontWeight={700} fontSize="16px" pt={4}>
              Deploy to {text}
            </Text>
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
            <Text color="#44498D" fontWeight={700} fontSize="16px" pt={4}>
              Deploy to {text}
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default CustomCardDeploy;
