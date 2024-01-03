import React from "react";
import StepmenuBox from "./StepmenuBox";
type Props = {
  schemacode: string;
  currentStep: number;
};

function Stepmenu(props: Props) {
  const stateDetail = [
    {
      state: 1,
      text: "Basic data",
    },
    {
      state: 2,
      text: "Origin collection data",
    },
    {
      state: 3,
      text: "Origin token attributes",
    },
    {
      state: 4,
      text: "Onchain collection attributes",
    },
    {
      state: 5,
      text: "Onchain token attributes",
    },
    {
      state: 6,
      text: "Action",
    },
    {
      state: 7,
      text: "Deploy",
    },
  ];

  return (
    <div className=" w-full h-full duration-300 relative">
      {props.schemacode !== "" && props.schemacode !== null && (
        <div className=" h-20 min-h-20 w-full flex justify-start items-end absolute top-[-5rem] left-2">
          <p className=" mb-4 text-main2 text-3xl duration-300">
            {props.schemacode}
          </p>
        </div>
      )}
      <div className=" w-full h-20 flex justify-between border-t border-t-2nd4 duration-300">
        {stateDetail.map((stepDetail) => (
          <StepmenuBox
            key={stepDetail.state}
            step={stepDetail.state}
            stepName={stepDetail.text}
            currentStep={props.currentStep}
            schemaCode={props.schemacode}
          ></StepmenuBox>
        ))}
      </div>
    </div>
  );
}

export default Stepmenu;
