import { useState, useEffect } from "react";
import { IActions } from "@/type/Nftmngr";

interface Action {
  name: string;
  desc: string;
  disable: boolean;
  when: string;
  then: string[];
  allowed_actioner: string;
  params: any[];
}

interface ActionInputProps {
  name: string;
  value: IActions[];
  setValue: any;
  actionIndex: number;
  isCreateNewAction: boolean;
}

const ActionInput = (props: ActionInputProps) => {
  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleValueChange = (e: any) => {
    console.log(
      "input ==>",
      props.actionIndex,
      "= ",
      props.value,
      ", ",
      props.value[props.actionIndex]
    );
    const newValue = e.target.value;
    setValue(newValue);

    props.setValue((prevState: IActions[]) => {
      console.log("prevState ==>", prevState);
      const updatedActions = prevState.map((action: IActions, index: number) =>
        index === props.actionIndex
          ? {
              ...action,
              [props.name === "Name" ? "name" : "desc"]: newValue,
            }
          : action
      );

      return updatedActions;
    });
  };

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

  // const checkDuplicateActionName = (actionNameValue)=>{
  //   let isDuplicate = false
  //   actions.forEach((action)=>{
  //     if(action.name === actionNameValue){
  //       isDuplicate = true
  //     }
  //   })
  //   return isDuplicate
  // }

  const checkActionNameError = async (str: string) => {
    setIsError(false);
    if (containsSpecialChars(str)) {
      setErrorMessage("Can't Contain Special Characters");
      setIsError(true);
    } else if (containsSpace(str)) {
      setErrorMessage("Can't Contain Space");
      setIsError(true);
    } else if (containsUppercase(str)) {
      setErrorMessage("Can't Contain Uppercase");
      setIsError(true);
    }
    // else if (checkDuplicateActionName(str)){
    //   setErrorMessage("Can't Be Duplicate!");
    //   setIsError(true);
    // }
    else {
      setIsError(false);
    }
  };

  useEffect(() => {
    props.value[props.actionIndex] &&
      (props.name === "Name"
        ? setValue(props.value[props.actionIndex].name)
        : setValue(props.value[props.actionIndex].desc));
  }, [props.value]);

  return (
    <div className="border justify-between w-[40vw] relative rounded-md bg-white">
      <div className={`${props.name === "Name" ? "bg-[#44498D] " : "bg-none"} border-[#44498D] border h-3 w-3 rounded-full absolute right-1 top-1`}></div>
      <div className="flex items-center justify-between px-10 h-28">
        <h2 className="text-[#44498D] font-semibold">{props.name}</h2>
        <div className="flex flex-col relative">
          <input
            placeholder={`Input your action ${props.name.toLowerCase()}`}
            className={`pl-4 rounded-sm bg-[#F5F6FA] text-[#3980F3] text-[14px] border-[1px]  ${
              isError
                ? "border-red-500 focus:border-red-500"
                : "border-[#3980F3] focus:border-[#3980F3]"
            } placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-96 h-10`}
            value={value}
            onChange={(e) => {
              handleValueChange(e);
              props.name === "Name" && checkActionNameError(e.target.value);
            }}
          ></input>
          <span className="text-red-500 text-xs absolute mt-10">{isError && errorMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default ActionInput;
