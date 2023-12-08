import { useEffect, useState } from "react";
import ThenAttributeFlow from "./ReactFlow/Then/ThenAttributeFlow";
import { ReactFlowProvider } from "reactflow";

interface ActionThenUpdateAttributeProps {
  metaFunction?: string;
  actionName?: string;
  schemaRevision?: string;
}
const ActionThenUpdateAttribute = (props:ActionThenUpdateAttributeProps) => {


  const metaFunction = props.metaFunction ?? "";
  const schemaRevision = props.schemaRevision ?? "";
  const actionName = props.actionName ?? "";

  return (
    <div>
      <ReactFlowProvider>
        <ThenAttributeFlow
          isDraft={false}
          metaFunction={metaFunction}
          schemaRevision={actionName}
          actionName={schemaRevision}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default ActionThenUpdateAttribute;
