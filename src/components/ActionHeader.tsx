import { useState } from "react";
import { Select } from "@chakra-ui/react";

interface ActionHeaderProps {
  type: string;
  actionThenType: string;
  actionName: string;
  metaFunction: string;
  handleActionThenTypeChange: (newActionThenType: string) => void;
  handleTransformTypeChange: (newActionThenType: string) => void;
}

const ActionHeader = (props: ActionHeaderProps) => {
  return (
    <>
      <div className="text-black flex items-center">
        <h6>
          Action: <span className="font-semibold">{props.actionName}</span> |{" "}
          {props.type == "when" ? "When" : "Then"}
        </h6>
        {props.type == "then" && (
          <Select
            w={320}
            justifyContent={"center"}
            alignContent={"center"}
            onChange={(e) => props.handleActionThenTypeChange(e.target.value)}
            mx={4}
          >
            <option value="" disabled selected hidden>
              -- Plase select your action type --
            </option>
            <option value="updateAttribute">Update Attribute</option>
            <option value="transferNumber">Transfer Number</option>
            <option value="transform">Transform</option>
          </Select>
        )}
        {props.type == "then" && props.actionThenType === "transform" && (
          <Select w={320} justifyContent={"center"} alignContent={"center"} onChange={(e)=>props.handleTransformTypeChange(e.target.value)}>
            <option value="" disabled selected hidden>
              -- Plase select your transform type --
            </option>
            <option value="static">Static Image Path</option>
            <option value="dynamic">Dynamic Image Path</option>
          </Select>
        )}
      </div>
      <div className="p-4 w-[75%] max-h-14 overflow-scroll bg-gray-300 rounded-md ">please add item</div>
    </>
  );
};

export default ActionHeader;
