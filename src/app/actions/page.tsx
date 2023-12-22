"use client";

import ActionCreateCard from "@/components/ActionCreateCard";
import ActionInfoCard from "@/components/ActionInfoCard";
import ActionInput from "@/components/ActionInput";
import ActionInputThenWhen from "@/components/ActionInputThenWhen";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getSchemaInfo } from "../../service/getSchemaInfo";
import postUpdateAction6 from "../../service/postUpdateAction6";

const Page = () => {
  const [action, setAction] =useState<Array<any>>([])
  const schemacode = "create.new_v1";
  useEffect(() => {
    console.log("calling");

    (async () => {
      try {
        const response = await getSchemaInfo(schemacode, "1");
        if (response && response.schema_info && response.schema_info.onchain_data) {
          setAction(response.schema_info.onchain_data.actions);
          console.log(response.schema_info.onchain_data.actions);
        } else {
          console.error("Invalid :", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [schemacode]);

  const handleDelete = async (index: number) => {
    const newAction = [...action];
    newAction.splice(index, 1);
    setAction(newAction);
    await postUpdateAction6(schemacode, newAction);
  };

  useEffect(() => {
    const deleteCookie = (cookieName:string) => {
      document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  deleteCookie("isCreateNewAction")
  deleteCookie("action")
  deleteCookie("isEditAction")
  deleteCookie("action-name")
  deleteCookie("action-desc")
  deleteCookie("action-when")
  deleteCookie("action-then")
  deleteCookie("action-then-arr")
  },[])

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 justify-items-center	mt-8">
      {action !== undefined &&
        action.map((item, index) => (
          <div
            //   onClick={() => {
            //     handleActionClick(data);
            //   }}
            key={index}
          >
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

      <ActionCreateCard />
      <button onClick={()=>console.log(action)}>log na ja </button>
    </section>
  );
};

export default Page;
