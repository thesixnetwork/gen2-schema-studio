"use client";

import ActionHeader from "@/components/ActionHeader";
import ActionThenTransferNumber from "@/components/ActionThenTransferNumber";
import ActionThenTransformDynamic from "@/components/ActionThenTransformDynamic";
import ActionThenTransformStatic from "@/components/ActionThenTransformStatic";
import ActionThenUpdateAttribute from "@/components/ActionThenUpdateAttribute";
import { useState, useEffect } from "react";

const Page = ({ params }: { params: { param: string } }) => {
  const [isClient, setIsClient] = useState(false);
  // const [metaFunction, setMetaFunction] = useState("");
  const [actionThenType, setActionThenType] = useState("");
  const [transformType, setTransformType] = useState("");
  const metaFunction = decodeURIComponent(params.param[2]);
  const schemaRevision = params.param[1];
  const actionName = params.param[0];
  console.log("!!!!>", params);

  useEffect(() => {
    if(metaFunction.startsWith("meta.SetImage(meta.ReplaceAllString")){
      setActionThenType("transform")
      setTransformType("dynamic")
    }else if(metaFunction.startsWith("meta.SetImage")){
      setActionThenType("transform")
      setTransformType("static")
    }else if(metaFunction.startsWith("meta.Set")){
      setActionThenType("updateAttribute")
    }else if(metaFunction.startsWith("meta.Transfer")){
      setActionThenType("transferNumber")
    }
  }, []);
  const handleActionThenTypeChange = (newActionThenType: string) => {
    setActionThenType(newActionThenType);
  };

  const handleTransformTypeChange = (transformType: string) => {
    setTransformType(transformType);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  

  return (
    <section className="text-black">
      <ActionHeader
        type="then"
        actionName="test"
        transformType={transformType}
        actionThenType={actionThenType}
        handleActionThenTypeChange={handleActionThenTypeChange}
        handleTransformTypeChange={handleTransformTypeChange}
        metaFunction={metaFunction}
      />
      {actionThenType === "updateAttribute" && (
        <ActionThenUpdateAttribute
          metaFunction={metaFunction}
          schemaRevision={actionName}
          actionName={schemaRevision}
        />
      )}
      {actionThenType === "transferNumber" && (
        <ActionThenTransferNumber
          metaFunction={metaFunction}
          schemaRevision={actionName}
          actionName={schemaRevision}
        />
      )}
      {actionThenType === "transform" && transformType === "static" && (
        <ActionThenTransformStatic />
      )}
      {actionThenType === "transform" && transformType === "dynamic" && (
        <ActionThenTransformDynamic
          actionName="test"
          schemaRevision="test"
          isDraft={true}
        />
      )}
    </section>
  );
};

export default Page;
