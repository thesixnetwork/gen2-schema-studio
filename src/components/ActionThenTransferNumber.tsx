import { ReactFlowProvider } from "reactflow";
import ThenTransferFlow from "./ReactFlow/Then/ThenTransferFlow";
const ActionThenTransferNumber = () =>{
    return (
        <div>
            <ReactFlowProvider>
                <ThenTransferFlow
                  isDraft={false}
                  metaFunction="create-new-action"
                  schemaRevision="testl"
                  actionName="testkrub"
                />
              </ReactFlowProvider>
        </div>
    )
}

export default ActionThenTransferNumber;