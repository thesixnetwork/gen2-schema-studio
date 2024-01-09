import React from "react";
import StepmenuBox from "./StepmenuBox";
type Props = {
  schemacode: string;
  currentStep: number;
  schemacodeNavigate: string;
  stepDraft: number;
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

  const getSchemaName = (str: string) => {
    const match = str.match(/^(.+)_v\d+$/);
    return match ? match[1] : str;
  };

  return (
    <div className=" w-full h-full duration-300 relative">
      <div className=" h-20 min-h-20 w-full flex justify-start items-end">
        {props.schemacode !== "" && props.schemacode !== null && (
          <p className=" mb-4 text-main2 text-3xl duration-300">
            {getSchemaName(props.schemacode)}
          </p>
        )}
      </div>
      <div className=" w-full h-20 flex justify-between border-t border-t-2nd4 duration-300">
        {stateDetail.map((stepDetail) => (
          <StepmenuBox
            key={stepDetail.state}
            step={stepDetail.state}
            stepName={stepDetail.text}
            currentStep={props.currentStep}
            schemaCode={props.schemacodeNavigate}
            stepDraft={props.stepDraft}
          ></StepmenuBox>
        ))}
      </div>
    </div>
  );
}

export default Stepmenu;
