"use client";

import ThenAttributeFlow from "@/components/ReactFlow/Then/ThenAttributeFlow";
import ThenTransferFlow from "@/components/ReactFlow/Then/ThenTransferFlow";
import { ReactFlowProvider } from "reactflow";
import ActionHeader from "@/components/ActionHeader";
import ActionThenTransformDynamic from "@/components/ActionThenTransformDynamic";
import ActionThenTransformStatic from "@/components/ActionThenTransformStatic";
import { useState, useEffect } from "react";
import { getCookie } from "@/service/getCookie";
import { setCookie } from "@/service/setCookie";
import Link from "next/link";
import CancelButton from "@/components/button/CancelButton";
import deleteCookie from "@/service/deleteCookie";

const Page = ({ params }: { params: { param: string } }) => {
  // const [metaFunction, setMetaFunction] = useState("");
  const [actionThenType, setActionThenType] = useState("");
  const [transformType, setTransformType] = useState("");
  const schemaRevision = params.param[0];
  const actionName = params.param[1];
  const dataFromCookie = getCookie("action-then");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const [isActionThenTypeChange, setIsActionThenTypeChange] = useState(false);
  const [metaFunction, setMetaFunction] = useState(
    params.param[2]?.startsWith("meta.SetImage")
      ? decodeURIComponent(dataFromCookie ?? "")
      : decodeURIComponent(params.param[2])
  );

  useEffect(() => {
    if (metaFunction.startsWith("meta.SetImage(meta.ReplaceAllString")) {
      setActionThenType("transform");
      setTransformType("dynamic");
    } else if (metaFunction.startsWith("meta.SetImage")) {
      setActionThenType("transform");
      setTransformType("static");
    } else if (metaFunction.startsWith("meta.Set")) {
      setActionThenType("updateAttribute");
    } else if (metaFunction.startsWith("meta.Transfer")) {
      setActionThenType("transferNumber");
    } else if (metaFunction.startsWith("create-new-then")) {
      setActionThenType("create-new-then");
    }

    return () => {
      deleteCookie("isTransformImage");
    };
  }, [metaFunction]);

  const handleActionThenTypeChange = (newActionThenType: string) => {
    if (newActionThenType === "transform") {
      setCookie("isTransformImage", "true");
    } else {
      setCookie("isTransformImage", "false");
    }
    setActionThenType(newActionThenType);
    setIsActionThenTypeChange(true);
  };

  const handleTransformTypeChange = (transformType: string) => {
    setTransformType(transformType);
  };

  // useEffect(()=>{
  //   setMetaFunction("")
  // },[actionThenType])

  useEffect(() => {
    if (isActionThenTypeChange) {
      setMetaFunction("");
      setIsActionThenTypeChange(false);
    }
    // console.log("metaFunction", metaFunction);
    // console.log("mafak", isActionThenTypeChange);
  }, [actionThenType, isActionThenTypeChange]);

  useEffect(() => {
    // console.log(">log<", metaFunction);
  }, [metaFunction]);

  useEffect(() => {
    "log here";
  }, [setMetaFunction]);

  return (
    <section
      className={`text-black ${
        actionThenType === "transform" && transformType === "dynamic"
          ? "h-full"
          : "h-[75vh]"
      }`}
    >
      {actionThenType === "create-new-then" && (
        <div className="px-8">
          <ActionHeader
            type="then"
            actionName={actionName}
            metaFunction={metaFunction}
            transformType={transformType}
            actionThenType={actionThenType}
            handleActionThenTypeChange={handleActionThenTypeChange}
            handleTransformTypeChange={handleTransformTypeChange}
          />
        </div>
      )}
      {actionThenType !== "" &&
        actionThenType !== "create-new-then" &&
        actionThenType !== "transform" && (
          <ReactFlowProvider>
            {actionThenType === "updateAttribute" && (
              <ThenAttributeFlow
                isDraft={false}
                metaFunction={metaFunction}
                schemaRevision={schemaRevision}
                actionName={actionName}
                transformType={transformType}
                actionThenType={actionThenType}
                handleActionThenTypeChange={handleActionThenTypeChange}
                handleTransformTypeChange={handleTransformTypeChange}
                setMetaFunction={setMetaFunction}
              />
            )}
            {actionThenType === "transferNumber" && (
              <ThenTransferFlow
                isDraft={false}
                metaFunction={metaFunction}
                schemaRevision={schemaRevision}
                actionName={actionName}
                transformType={transformType}
                actionThenType={actionThenType}
                handleActionThenTypeChange={handleActionThenTypeChange}
                handleTransformTypeChange={handleTransformTypeChange}
                setMetaFunction={setMetaFunction}
              />
            )}
          </ReactFlowProvider>
        )}
      {actionThenType === "transform" && (
        <ActionThenTransformStatic
          isDraft={false}
          metaFunction={metaFunction}
          schemaRevision={schemaRevision}
          actionName={actionName}
          transformType={transformType}
          actionThenType={actionThenType}
          handleActionThenTypeChange={handleActionThenTypeChange}
          handleTransformTypeChange={handleTransformTypeChange}
        />
      )}
      {actionThenType === "transform" && transformType === "dynamic" && (
        <ActionThenTransformDynamic
          schemaRevision={schemaRevision}
          actionName={actionName}
          isDraft={true}
          transformType={transformType}
          actionThenType={actionThenType}
          handleActionThenTypeChange={handleActionThenTypeChange}
          handleTransformTypeChange={handleTransformTypeChange}
          metaFunction={metaFunction}
        />
      )}
      {(actionThenType === "" ||
        actionThenType === "create-new-then" ||
        (actionThenType === "transform" && transformType === "")) && (
        <Link
          onClick={() => setCookie("isEditAction", "true")}
          className="flex justify-end	px-8 pt-4"
          href={
            isCreateNewActionCookie === "true"
              ? `/newdraft/6/${schemaRevision}/action-form/create-new-action`
              : `/newdraft/6/${schemaRevision}/action-form/${actionName}`
          }
        >
          <CancelButton />
        </Link>
      )}
    </section>
  );
};
export default Page;
