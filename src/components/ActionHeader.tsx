import { useEffect, useState } from "react";
import { Select } from "@chakra-ui/react";
import Stepmenu from "@/components/Stepmenu";
import { getCookie } from "@/service/getCookie";
interface ActionHeaderProps {
  type: string;
  metaFunction: string;
  actionName: string;
  actionThenType?: string;
  transformType?: string;
  handleActionThenTypeChange?: (newActionThenType: string) => void;
  handleTransformTypeChange?: (newActionThenType: string) => void;
}

const ActionHeader = (props: ActionHeaderProps) => {
  const schemaCode = getCookie("schemaCode") ?? "";
  return (
    <div>
      <header>
        <Stepmenu schemacode={schemaCode} currentStep={6}></Stepmenu>
      </header>
      <div className="text-black flex items-center my-4">
        <h6>
          Action: <span className="font-semibold">{props.actionName}</span> |{" "}
          {props.type == "when" ? "When" : "Then"}
        </h6>
        {props.type == "then" && (
          <Select
            w={320}
            justifyContent={"center"}
            alignContent={"center"}
            onChange={(e) => props.handleActionThenTypeChange?.(e.target.value)}
            mx={4}
            value={
              props.actionThenType === "create-new-then"
                ? ""
                : props.actionThenType
            }
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
          <Select
            w={320}
            justifyContent={"center"}
            alignContent={"center"}
            onChange={(e) => props.handleTransformTypeChange?.(e.target.value)}
            value={props.transformType}
          >
            <option value="" disabled selected hidden>
              -- Plase select your transform type --
            </option>
            <option value="static">Static Image Path</option>
            <option value="dynamic">Dynamic Image Path</option>
          </Select>
        )}
      </div>
      <div className="p-4 w-full max-h-14 overflow-scroll bg-gray-300 rounded-md text-Act6">
        {props.metaFunction === "create-new-then" &&
        props.actionThenType === "create-new-then"
          ? "Please select your then action and add item"
          : (props.actionThenType === "updateAttribute" ||
              props.actionThenType === "transferNumber") &&
            props.metaFunction === "create-new-then"
          ? "Please add item"
          : props.actionThenType === "transform" &&
            props.transformType === "dynamic" &&
            !props.metaFunction
          ? "Please input your dynamic image path"
          : props.actionThenType === "transform" &&
            props.transformType === "static" &&
            !props.metaFunction
          ? "Please input your static image path"
          : props.actionThenType === "transform" && !props.metaFunction
          ? "Please select your transform type"
          : props.metaFunction === "create-new-when"
          ? "Please add item"
          : props.metaFunction}
      </div>
    </div>
  );
};

export default ActionHeader;
