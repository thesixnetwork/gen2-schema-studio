"use client";

import ActionHeader from "@/components/ActionHeader";
import ActionThenTransferNumber from "@/components/ActionThenTransferNumber";
import ActionThenTransformDynamic from "@/components/ActionThenTransformDynamic";
import ActionThenTransformStatic from "@/components/ActionThenTransformStatic";
import ActionThenUpdateAttribute from "@/components/ActionThenUpdateAttribute";
import { useState, useEffect } from "react";

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const [metaFunction, setMetaFunction] = useState("");
  const [actionThenType, setActionThenType] = useState("");
  const [transformType, setTransformType] = useState("");

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
        actionThenType={actionThenType}
        handleActionThenTypeChange={handleActionThenTypeChange}
        handleTransformTypeChange={handleTransformTypeChange}
        metaFunction={metaFunction}
      />
      {actionThenType === "updateAttribute" && <ActionThenUpdateAttribute />}
      {actionThenType === "transferNumber" && <ActionThenTransferNumber />}
      {actionThenType === "transform" && transformType === "static" && (
        <ActionThenTransformStatic />
      )}
      {actionThenType === "transform" && transformType === "dynamic" && (
        <ActionThenTransformDynamic actionName="test" schemaRevision="test" isDraft={true} />
      )}
      <button onClick={() => console.log(actionThenType)}>logger</button>
    </section>
  );
};

export default Page;
