"use client";

import ActionCreateCard from "@/components/ActionCreateCard";
import ActionInfoCard from "@/components/ActionInfoCard";
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
import deleteCookie from "@/service/deleteCookie";

const Page = ({ params }: { params: { schemacode: string } }) => {
  const [action, setAction] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [stepDraft, setStepDraft] = useState(5);
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
    deleteCookie("isCreateNewAction");
    deleteCookie("action");
    deleteCookie("isEditAction");
    deleteCookie("action-name");
    deleteCookie("action-desc");
    deleteCookie("action-when");
    deleteCookie("action-then");
    deleteCookie("action-then-arr");
    deleteCookie("isTransformDynamic");
    deleteCookie("isCreateDyanamicImage");
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
          setStepDraft(response.current_state);
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
  }, [schemacode]);

  return (
    <div className="h-[75vh] flex flex-col justify-between">
      {loading && <Loading />}
      <header>
        <Stepmenu
          schemacode={schemacode}
          currentStep={6}
          schemacodeNavigate={schemacode}
          stepDraft={stepDraft}
        />
      </header>
      <section className="my-6 h-[50vh] overflow-scroll ">
        <div className="py-4 px-8  gap-y-8 gap-x-24 flex flex-wrap ">
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
      </section>
      <div className="flex items-end">
        <div className="w-full flex justify-between px-24">
          <Link href={`/newdraft/5/${schemacode}`}>
            <BackPageButton />
          </Link>
          <Link href={`/newdraft/7/${schemacode}`}>
            <NextPageButton />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
