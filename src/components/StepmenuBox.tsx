import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import ConfirmModalChakra from "./ConfirmModalChakra";
type Props = {
  step: number;
  stepDraft: number;
  stepName: string;
  currentStep: number;
  schemaCode: string;
  onEditing: boolean;
};

function StepmenuBox(props: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const navigate = () => {
    router.push(`/newdraft/${props.step}/${props.schemaCode}`, { scroll: false })
  }

  const check_navigate = () => {
    if (props.stepDraft >= props.step) {
      if (props.onEditing) {
        setIsOpen(true)
      } else{
        navigate()
      }

    }
  }
  return (
    <div onClick={check_navigate} className=" w-36 flex justify-start group duration-300 cursor-pointer ">
      <div
        className={` w-10 h-full ${props.currentStep === props.step
          ? " bg-Act6 "
          : "bg-bg group-hover:bg-Act7 group-hover:border-none "
          } 
          ${props.stepDraft < props.step && " border-t-transparent"}
           border  border-Act6  flex justify-center items-center duration-300 `}
      >
        <p
          className={`  ${props.currentStep === props.step
            ? " text-white "
            : " text-Act6  group-hover:text-white group-hover:font-bold duration-500"
            }  text-4xl 
            ${props.stepDraft < props.step && " font-thin"}
            `}
        >
          {props.step}
        </p>
      </div>
      <div className=" flex justify-center items-center">
        <p
          className={`text-Act6 w-20 flex justify-start items-center ml-2 duration-500 ${props.currentStep === props.step
            ? " font-bold "
            : "group-hover:scale-105"
            }
            ${((props.stepDraft > props.step) && (props.currentStep !== props.step)) && "font-medium"}
            `}
        >
          {props.stepName}
        </p>
      </div>
      <ConfirmModalChakra title={'Are you sure to change page?\nYour draft isn’t saved \n (Next button to save)'} confirmButtonTitle={'Yes'} function={navigate} isOpen={isOpen} setIsOpen={setIsOpen}
      ></ConfirmModalChakra>
    </div>
  );
}

export default StepmenuBox;
