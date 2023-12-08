import { ReactFlowProvider } from "reactflow";
import ThenTransferFlow from "./ReactFlow/Then/ThenTransferFlow";

interface ActionThenTransferNumbeProps {
  metaFunction?: string;
  actionName?: string;
  schemaRevision?: string;
}

const ActionThenTransferNumber = (props:ActionThenTransferNumbeProps) =>{

  const metaFunction = props.metaFunction ?? "";
  const schemaRevision = props.schemaRevision ?? "";
  const actionName = props.actionName ?? "";

    return (
        <div>
            <ReactFlowProvider>
                <ThenTransferFlow
                  isDraft={false}
                  metaFunction={metaFunction}
                  schemaRevision={actionName}
                  actionName={schemaRevision}
                />
              </ReactFlowProvider>
        </div>
    )
}

export default ActionThenTransferNumber;