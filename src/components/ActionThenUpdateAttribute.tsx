import ThenAttributeFlow from "./ReactFlow/Then/ThenAttributeFlow";
import { ReactFlowProvider } from "reactflow";

const ActionThenUpdateAttribute = () => {
  return (
    <div>
      <ReactFlowProvider>
        <ThenAttributeFlow
          isDraft={false}
          metaFunction="create-new-action"
          schemaRevision="test"
          actionName="test krub"
        />
      </ReactFlowProvider>
    </div>
  );
};

export default ActionThenUpdateAttribute;
