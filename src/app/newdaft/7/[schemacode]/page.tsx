"use client";

import TapState from "@/components/TapState";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Text,
  Flex,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import { useEffect, useState, useRef } from "react";
import { ISchemaInfo } from "@/type/Nftmngr";
import CustomButton from "@/components/CustomButton";
import CustomCardDeploy from "@/components/CustomCardDeploy";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import ENV from "@/utils/ENV";
import { EncodeObject, OfflineSigner, Registry } from "@cosmjs/proto-signing";
import { Skeleton } from "@chakra-ui/react";

import { MsgCreateNFTSchema } from "@/type/tx";
import { SigningStargateClient } from "@cosmjs/stargate";
import { GasPrice } from "@cosmjs/stargate/build/fee";

export default function Page({
  params: { schemacode },
}: {
  params: { schemacode: string };
}) {
  // console.log(session)
  //   // setIsClient(true);
  const { data: session } = useSession();
  const [isDaft, setIsDaft] = useState<ISchemaInfo | null>(null);
  const [isAccount, setIsAccount] = useState<OfflineSigner[]>();
  const [offlineSigner, setOfflineSigner] = useState();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [chainId, setChainId] = useState("fivenet");
  const [rpcEndpoint, setRpcEndpoint] = useState(ENV.RPC_FIVENET);

  useEffect(() => {
    (async () => {
      try {
        const send = await getSchemaInfo(schemacode);
        setIsDaft(send);
        if (send) {
          await getAccount();
        }
        setLoading(false);
        // Process the response or update state as needed
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    })();
  }, [schemacode]);

  const getAccount = async () => {
    const offlineSigner = await window.getOfflineSigner(chainId);
    const keplrAccounts = await offlineSigner.getAccounts();

    setOfflineSigner(offlineSigner);
    setIsAccount(keplrAccounts);
  };

  // const isDaft = await getSchemaInfo(schemacode);
  // console.log(JSON.stringify(isDaft, null, 2));
  return (
    <>
      {isDaft && !loading && (
        <Flex p={10} flexWrap={"wrap"}>
          <Text
            color="#44498D"
            fontFamily="Montserrat"
            fontSize="32px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="normal"
          >
            {isDaft.schema_code}
          </Text>
          <Divider borderColor={"brand"} />
          <TapState isCurren={7} schemaCode={schemacode} />
          <Flex
            id="con-card-deploy"
            width="100%"
            justifyContent="space-evenly"
            marginTop="85px"
          >
            <CustomCardDeploy
              text={"Testnet"}
              isAccount={isAccount}
              offlineSigner={offlineSigner}
              isDaft={isDaft}
              schemacode={schemacode}
              onClick={() => {}}
            />
            <CustomCardDeploy text={"Mainnet"} onClick={() => {}} />
          </Flex>
          <Flex width="100%" justifyContent="space-between" marginTop="96px">
            <CustomButton text={"Back"} isCurren={7} schemaCode={schemacode} />
          </Flex>
        </Flex>
      )}

      {!isDaft && !loading && (
        <Flex p={4} flexWrap={"wrap"}>
          <Text>NOT FOUND SCHEMA CODE</Text>
        </Flex>
      )}

      {loading && !isDaft && (
        <Flex
          p={10}
          flexWrap={"wrap"}
        >
          <Text
            color="#44498D"
            fontFamily="Montserrat"
            fontSize="32px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="normal"
          >
            {schemacode}
          </Text>
          <Divider borderColor={"brand"} />
          <TapState isCurren={7} schemaCode={schemacode} />
          <Flex
            id="con-card-deploy-30"
            width="100%"
            justifyContent="space-evenly"
            marginTop="85px"
          >
            {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              margin="10px"
              maxW="200px"
              bgColor="#F5F6FA"
              width="200px"
              height="265px"
              borderRadius="8px"
            ></Skeleton>
          ))}
          </Flex>
        </Flex>
      )}
    </>
  );
}
