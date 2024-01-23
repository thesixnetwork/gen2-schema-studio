"use client";
import { useState } from "react";
import WhenFlow from "@/components/ReactFlow/When/WhenFlow";
import { ReactFlowProvider } from "reactflow";

const Page = ({ params }: { params: { param: string } }) => {
  const schemaCode = params.param[0];
  const actionName = params.param[1];
  const [metaFunction, setMetaFunction] = useState(
    decodeURIComponent(params.param[2])
  );

  return (
        <div className="h-[75vh]">
          <ReactFlowProvider>
            <WhenFlow
              isDraft={false}
              metaFunction={metaFunction}
              schemaCode={schemaCode}
              actionName={actionName}
              setMetaFunction={setMetaFunction}
            />
          </ReactFlowProvider>
        </div>
  );
};

export default Page;
