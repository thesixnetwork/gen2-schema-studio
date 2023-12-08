"use client";

import WhenFlow from "@/components/ReactFlow/When/WhenFlow";
import { ReactFlowProvider } from "reactflow";
import ActionHeader from "@/components/ActionHeader";
const Page = ({ params }: { params: { param: string } }) => {
  const metaFunction = decodeURIComponent(params.param[2]);
  const schemaRevision = params.param[1];
  const actionName = params.param[0];

  console.log("!!!>",metaFunction)

  return (
    <div>
      <ActionHeader type="when" actionName="test" metaFunction="meta.test" />
      <div className="mt-[20px] flex flex-col items-center justify-center">
        <ReactFlowProvider>
          <WhenFlow
            isDraft={false}
            // metaFunction="create-new-when"
            // schemaRevision={"test"}
            // actionName={"test"}
            metaFunction={metaFunction}
            schemaRevision={actionName}
            actionName={schemaRevision}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Page;
