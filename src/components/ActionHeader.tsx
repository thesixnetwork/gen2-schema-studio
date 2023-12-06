import { useState } from "react";
import { Select } from "@chakra-ui/react";

interface ActionHeaderProps {
  type: string;
  actionName: string;
  metaFunction: string;
  actionThenType?: string;
  handleActionThenTypeChange?: (newActionThenType: string) => void;
  handleTransformTypeChange?: (newActionThenType: string) => void;
}

const ActionHeader = (props: ActionHeaderProps) => {
  return (
    <>
      <div className="text-black flex items-center">
        <h6 className="text-[#3980F3]">
          Action: <span className="font-semibold">{props.actionName}</span> |{" "}
          {props.type === "when" ? "When" : "Then"}
        </h6>
        {props.type === "then" && (
          <Select
            w={320}
            justifyContent={"center"}
            alignContent={"center"}
            onChange={(e) => props.handleActionThenTypeChange?.(e.target.value)}
            mx={4}
          >
            {/* Options for "then" type */}
          </Select>
        )}
        {props.type === "then" && props.actionThenType === "transform" && (
          <Select
            w={320}
            justifyContent={"center"}
            alignContent={"center"}
            onChange={(e) =>
              props.handleTransformTypeChange?.(e.target.value)
            }
          >
            {/* Options for transform type */}
          </Select>
        )}
      </div>
      <div className="p-4 w-[75%] max-h-14 overflow-scroll bg-gray-300 rounded-md text-[#3980F3]">
        {props.metaFunction}
      </div>
    </>
  );
};

export default ActionHeader;
