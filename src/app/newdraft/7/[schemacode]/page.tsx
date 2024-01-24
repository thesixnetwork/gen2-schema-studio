"use client";

import {
  Text,
  Flex,
} from "@chakra-ui/react";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import { useCallback, useEffect, useState } from "react";
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
import Stepmenu from "@/components/Stepmenu";
import Loading from "@/components/Loading";
import { MsgCreateNFTSchema } from "@/type/tx";
import { SigningStargateClient } from "@cosmjs/stargate";
import { GasPrice } from "@cosmjs/stargate/build/fee";
import BackPageButton from "@/components/BackPageButton";
import Link from "next/link";
import BackToHomeButton from "@/components/button/BackToHomeButton";
import postAction7 from "@/service/postAction7";

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
  const [chainId, setChainId] = useState(ENV.CHAINID);
  const [rpcEndpoint, setRpcEndpoint] = useState(ENV.RPC_FIVENET2);
  const [stepDraft, setStepDraft] = useState(6);

  const getAccount = useCallback(async () => {
    const offlineSigner = await window.getOfflineSigner(chainId);
    const keplrAccounts = await offlineSigner.getAccounts();
    setOfflineSigner(offlineSigner);
    setIsAccount(keplrAccounts);
  }, [chainId]);

  useEffect(() => {
    (async () => {
      try {
        const send = await getSchemaInfo(schemacode);
        setIsDaft(send);
        if (send && send.current_state) {
          setStepDraft(send?.current_state);
        }
        if (send) {
          await getAccount();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [getAccount, schemacode]);

  return (
    <>
      <header>
        <Stepmenu
          schemacode={schemacode}
          currentStep={7}
          schemacodeNavigate={schemacode}
          stepDraft={stepDraft}
        ></Stepmenu>
      </header>
      {isDaft && (
        <Flex display={"flex"} flexDirection={"column"} my={24}>
          <Flex
            id="con-card-deploy"
            width="100%"
            justifyContent="center"
            columnGap={48}
          >
            <CustomCardDeploy
              text={"Testnet"}
              isAccount={isAccount}
              offlineSigner={offlineSigner}
              isDaft={isDaft}
              schemacode={schemacode}
              onClick={() => {}}
            />
            <CustomCardDeploy
              text={"Mainnet"}
              isAccount={isAccount}
              offlineSigner={offlineSigner}
              isDaft={isDaft}
              schemacode={schemacode}
              onClick={() => {}}
            />
          </Flex>
          <div className="w-full flex flex-end justify-end gap-x-8 mt-24">
            <Link href={`/newdraft/6/${schemacode}`}>
              <BackPageButton />
            </Link>
            <BackToHomeButton />
          </div>
        </Flex>
      )}

      <button onClick={async () => await postAction7(schemacode, "Testnet")}>
        log jar
      </button>

      {!isDaft && !loading && (
        <Flex p={4} flexWrap={"wrap"}>
          <Text>NOT FOUND SCHEMA CODE</Text>
        </Flex>
      )}
      {loading && !isDaft && <Loading />}
    </>
  );
}
