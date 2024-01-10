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
import ActionCreateCard from "@/components/ActionCreateCard";
import ActionInfoCard from "@/components/ActionInfoCard";
import ActionInput from "@/components/ActionInput";
import ActionInputThenWhen from "@/components/ActionInputThenWhen";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import postUpdateAction6 from "@/service/postUpdateAction6";
import Loading from "@/components/Loading";
import NextPageButton from "@/components/NextPageButton";
import BackPageButton from "@/components/BackPageButton";
import { setCookie } from "@/service/setCookie";
import { ItokenAttributes } from "@/type/Nftmngr";
import { INftAttributes } from "@/type/Nftmngr";
import Stepmenu from "@/components/Stepmenu";
import ConfirmModalChakra from "@/components/ConfirmModalChakra";

const Page = ({ params }: { params: { schemacode: string } }) => {
  const [action, setAction] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [stepDraft, setStepDraft] = useState(5)
  const [tokenAttributes, setTokenAttributes] = useState<ItokenAttributes[]>(
    []
  );
  const [nftAttributes, setNftAttributes] = useState<INftAttributes[]>([]);

  const schemacode = params.schemacode;

  const handleDelete = async (index: number) => {
    const newAction = [...action];
    newAction.splice(index, 1);
    setAction(newAction);
    await postUpdateAction6(schemacode, newAction);
  };

  const combineArrays = (
    arr1: { name: string; data_type: string }[],
    arr2: { name: string; data_type: string }[]
  ) => {
    const tempArr: { name: string; dataType: string }[] = [];
    arr1.forEach((item) => {
      tempArr.push({ name: item.name, dataType: item.data_type.toLowerCase() });
    });

    arr2.forEach((item) => {
      tempArr.push({ name: item.name, dataType: item.data_type.toLowerCase() });
    });
    setCookie("action-attribute", JSON.stringify(tempArr));
  };

  useEffect(() => {
    const deleteCookie = (cookieName: string) => {
      document.cookie =
        cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };

    deleteCookie("isCreateNewAction");
    deleteCookie("action");
    deleteCookie("isEditAction");
    deleteCookie("action-name");
    deleteCookie("action-desc");
    deleteCookie("action-when");
    deleteCookie("action-then");
    deleteCookie("action-then-arr");
  }, []);

  useEffect(() => {
    combineArrays(tokenAttributes, nftAttributes);
  }, [tokenAttributes, nftAttributes]);

  useEffect(() => {
    console.log("calling");
    (async () => {
      try {
        const response = await getSchemaInfo(schemacode);
        if (
          response &&
          response.schema_info &&
          response.schema_info.onchain_data
        ) {
          setAction(response.schema_info.onchain_data.actions);
          setTokenAttributes(
            response.schema_info.onchain_data.token_attributes
          );
          setNftAttributes(response.schema_info.onchain_data.nft_attributes);
          setLoading(false);
          setStepDraft(response.current_state)
        } else {
          console.error("Invalid :", response);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    })();
  }, [schemacode]);

  useEffect(() => {
    setCookie("schemaCode", schemacode);    
  }, []);


  return (
    <>
      {loading && <Loading />}
      <header>
        <Stepmenu schemacode={schemacode} currentStep={6} schemacodeNavigate={schemacode} stepDraft={stepDraft} />
      </header>
      <section className="mt-12">
      <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center">
        <ActionCreateCard />
          {action !== undefined &&
            action.map((item, index) => (
              <div key={index}>
                <ActionInfoCard
                  name={item.name}
                  description={item.desc}
                  when={item.when}
                  then={item.then}
                  index={index}
                  handleDelete={handleDelete}
                />
              </div>
            ))}

        </div>
        <div className="w-full flex justify-between px-24 my-12">
          <Link href={`/newdraft/5/${schemacode}`}>
            <BackPageButton />
          </Link>
          <Link href={`/newdraft/7/${schemacode}`}>
            <NextPageButton />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Page;
