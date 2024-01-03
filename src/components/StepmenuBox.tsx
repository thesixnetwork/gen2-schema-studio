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
    <Link href={`/newdraft/${props.step}/${props.schemaCode}_v1`}>
      <div className=" w-36 flex justify-center  items-center group duration-300 ">
        <div
          className={` w-10 h-16 ${
            props.currentStep === props.step
              ? " bg-Act6 "
              : "bg-bg group-hover:bg-Act7 group-hover:border-none "
          } border  border-Act6 flex justify-center items-center duration-300 `}
        >
          <p
            className={` font-bold ${
              props.currentStep === props.step
                ? " text-white "
                : " text-Act6 font-thin group-hover:text-white duration-300"
            }  text-4xl `}
          >
            {props.step}
          </p>
        </div>
        <div className=" flex justify-center items-center">
          <p
            className={`text-Act6 w-20 flex justify-start items-center ml-2 duration-300 ${
              props.currentStep === props.step
                ? " font-bold "
                : "group-hover:scale-105"
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
