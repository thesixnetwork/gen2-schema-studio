"use client";

import WhenFlow from "@/components/ReactFlow/When/WhenFlow";
import { ReactFlowProvider } from "reactflow";
import ActionHeader from "@/components/ActionHeader";
const Page = () => {
  return (
    <div>
      <ActionHeader type="when" actionName="test" metaFunction="meta.test" />
      <div className="mt-[20px] flex flex-col items-center justify-center">
        <ReactFlowProvider>
          <WhenFlow
            isDraft={false}
            metaFunction="create-new-when"
            schemaRevision={"test"}
            actionName={"test"}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Page;
