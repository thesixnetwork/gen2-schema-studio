"use client";

import { useState } from "react";
import Link from "next/link";
import ActionInput from "@/components/ActionInput";
import ActionInputThenWhen from "@/components/ActionInputThenWhen";

const Page = () => {
  const [actionNameValue, setActionNameValue] = useState("");
  const [isActionNameError, setIsActionNameError] = useState(false);
  const [actionNameErrorMessage, setActionNameErrorMessage] = useState("");
  const [actionDescriptionValue, setActionDescriptionValue] = useState("");
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

  const containsSpecialChars = (str: string) => {
    const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  };

  const containsSpace = (str: string) => {
    const specialChars = / /;
    return specialChars.test(str);
  };

  const containsUppercase = (str: string) => {
    return /[A-Z]/.test(str);
  };

  //   const checkDuplicateActionName = (actionNameValue:string)=>{
  //     let isDuplicate = false
  //     actions.forEach((action)=>{
  //       if(action.name === actionNameValue){
  //         isDuplicate = true
  //       }
  //     })
  //     return isDuplicate
  //   }

  const checkActionNameError = async (str: string) => {
    setIsActionNameError(false);
    if (!str) {
      setActionNameErrorMessage("Not Availible");
      setIsActionNameError(true);
    } else if (containsSpecialChars(str)) {
      setActionNameErrorMessage("Can't Contain Special Characters");
      setIsActionNameError(true);
    } else if (containsSpace(str)) {
      setActionNameErrorMessage(" Can't Contain Space");
      setIsActionNameError(true);
    } else if (containsUppercase(str)) {
      setActionNameErrorMessage("Can't Contain Uppercase");
      setIsActionNameError(true);
    }
    // else if (checkDuplicateActionName(str)){
    //   setActionNameErrorMessage("Can't Be Duplicate!");
    //   setIsActionNameError(true);
    // }
    else {
      setIsActionNameError(false);
    }
  };

  const checkDescriptionError = async (str: string) => {
    setIsDescriptionError(false);
    if (!str) {
      setDescriptionErrorMessage("Not Availible");
      setIsDescriptionError(true);
    } else {
      setIsDescriptionError(false);
    }
  };

  return (
    // <div className="text-black">
    //   <p>create action</p>
    //   <div className="ml-4">
    //     <h4>Name</h4>
    //     <input
    //       id="1"
    //       type="text"
    //       autoFocus
    //       className={`text-black bg-transparent text-md border-[1px] border-black focus:border-[#D9D9D9DD] placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-[350px] h-[${20}px]`}
    //       placeholder={""}
    //       onChange={(e) => {
    //         setActionNameValue(e.target.value);
    //         checkActionNameError(e.target.value);
    //       }}
    //     />
    //   </div>
    //   <div className="ml-4">
    //     <h4>Description</h4>
    //     <div className=" w-full flex items-center  mt-3 ">
    //       <div className="">
    //         <input
    //           type="text"
    //           autoFocus
    //           className={`text-black bg-transparent text-md border-[1px] border-black focus:border-[#D9D9D9DD] placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-[350px] h-[${20}px]`}
    //           placeholder={""}
    //           onChange={(e) => {
    //             setActionDescriptionValue(e.target.value);
    //             checkDescriptionError(e.target.value);
    //           }}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <div>
    //     <h4>When</h4>
    //     <Link href={`/actions/create-action/when`}>
    //       <button>+ New Condition</button>
    //     </Link>
    //   </div>
    //   <div>
    //     <h4>Then</h4>
    //     <Link href={`/actions/create-action/then`}>
    //       <button>+ New Condition</button>
    //     </Link>
    //   </div>
    // </div>
    <div>
      <ActionInput name="Name" />
      <ActionInput name="Description" />
      <ActionInputThenWhen
        actionType="When"
        action="meta.GetBoolean(‘checked_in’) == false && meta.GetString(‘tier’) != ‘staff’"
      />
       <ActionInputThenWhen
        actionType="Then"
        action="meta.GetBoolean(‘checked_in’) == false && meta.GetString(‘tier’) != ‘staff’"
      />
    </div>
  );
};

export default Page;
