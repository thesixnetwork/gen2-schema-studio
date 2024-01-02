import React from "react";
import Link from "next/link";
type Props = {
  step: number;
  stepName: string;
  currentStep: number;
  schemaCode: string;
};

function StepmenuBox(props: Props) {
  return (
    <Link href={`/newdraft/${props.step}/${props.schemaCode}`}>
      <div className=" w-36 flex justify-center  items-center group ">
        <div
          className={` w-10 h-16 ${
            props.currentStep === props.step
              ? " bg-Act6 "
              : "bg-bg group-hover:bg-Act7"
          } border  border-Act6 flex justify-center items-center `}
        >
          <p
            className={` font-bold ${
              props.currentStep === props.step
                ? " text-white "
                : " text-Act6 font-thin group-hover:text-white"
            }  text-4xl `}
          >
            {props.step}
          </p>
        </div>
        <div className=" flex justify-center items-center">
          <p
            className={`text-Act6 w-20 flex justify-start items-center ml-2 ${
              props.currentStep === props.step
                ? " font-bold "
                : "group-hover:underline"
            }`}
          >
            {props.stepName}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default StepmenuBox;
