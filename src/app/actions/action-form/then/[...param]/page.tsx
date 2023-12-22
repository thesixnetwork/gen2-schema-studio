"use client";

import ThenAttributeFlow from "@/components/ReactFlow/Then/ThenAttributeFlow";
import ThenTransferFlow from "@/components/ReactFlow/Then/ThenTransferFlow";
import { ReactFlowProvider } from "reactflow";
import ActionHeader from "@/components/ActionHeader";
import ActionThenTransformDynamic from "@/components/ActionThenTransformDynamic";
import ActionThenTransformStatic from "@/components/ActionThenTransformStatic";
import { useState, useEffect } from "react";
import { getCookie } from "@/service/getCookie";

const Page = ({ params }: { params: { param: string } }) => {
  // const [metaFunction, setMetaFunction] = useState("");
  const [actionThenType, setActionThenType] = useState("");
  const [transformType, setTransformType] = useState("");
  const schemaRevision = params.param[0];
  const actionName = params.param[1];
  const dataFromCookie = getCookie("action-then");
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
    }else if ( metaFunction.startsWith("create-new-then")){
      setActionThenType("create-new-then")
    }
  }, []);

  const handleActionThenTypeChange = (newActionThenType: string) => {
    setActionThenType(newActionThenType);
  };

  const handleTransformTypeChange = (transformType: string) => {
    setTransformType(transformType);
  };

  return (
    <section className="text-black">
      {actionThenType === "create-new-then" && (
        <div className="px-8">

        <ActionHeader 
        type="then"
        actionName={actionName}
        metaFunction={metaFunction}
        transformType={transformType}
        actionThenType={actionThenType}
        handleActionThenTypeChange={handleActionThenTypeChange}
        handleTransformTypeChange={handleTransformTypeChange}/>
        </div>
      )}
      {actionThenType === "updateAttribute" && (
        <ReactFlowProvider>
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
        </ReactFlowProvider>
      )}
      {actionThenType === "transferNumber" && (
        <ReactFlowProvider>
          <ThenTransferFlow
            isDraft={false}
            metaFunction={metaFunction}
            schemaRevision={schemaRevision}
            actionName={actionName}
            transformType={transformType}
            actionThenType={actionThenType}
            handleActionThenTypeChange={handleActionThenTypeChange}
            handleTransformTypeChange={handleTransformTypeChange}
            // setMetaFunction={setMetaFunction}
          />
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
    </section>
  );
};
export default Page;
