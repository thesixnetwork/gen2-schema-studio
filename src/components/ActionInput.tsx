import { useState, useEffect } from "react";
import { IActions } from "@/type/Nftmngr";

interface ActionInputProps {
  name: string;
  value: IActions[];
  setValue: any;
  actionIndex: number;
  isCreateNewAction: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionInput = (props: ActionInputProps) => {
  const [value, setValue] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const actionCookieString = localStorage.getItem('action');

  const allAction =
    actionCookieString !== null
      ? JSON.parse(decodeURIComponent(actionCookieString) as string)
      : null;

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

  const checkDuplicateActionName = (actionNameValue: string) => {
    let isDuplicate = false;
    if (!props.isCreateNewAction) {
      props.value.forEach((item: IActions) => {
        if (item.name === actionNameValue) {
          isDuplicate = true;
        }
      });
    } else if (allAction !== null) {
      allAction.forEach((item: IActions) => {
        if (item.name === actionNameValue) {
          isDuplicate = true;
        }
      });
    }
    return isDuplicate;
  };

  const checkActionNameError = async (str: string) => {
    setIsError(false);
    props.setIsError(false);

    if (checkDuplicateActionName(str)) {
      setErrorMessage("Name can't be duplicate!");
      setIsError(true);
      props.setIsError(true);
    } else if (containsSpecialChars(str)) {
      setErrorMessage("Name can't contain special characters");
      setIsError(true);
      props.setIsError(true);
    } else if (containsSpace(str)) {
      setErrorMessage("Name can't contain space");
      setIsError(true);
      props.setIsError(true);
    } else if (containsUppercase(str)) {
      setErrorMessage("Name can't contain uppercase");
      setIsError(true);
      props.setIsError(true);
    } else {
      setIsError(false);
      props.setIsError(false);
    }
  };

  useEffect(() => {
    props.value[props.actionIndex] &&
      (props.name === "Name"
        ? setValue(props.value[props.actionIndex].name)
        : setValue(props.value[props.actionIndex].desc));
  }, [props.value]);

  return (
    <div className="border justify-between w-[40vw] relative rounded-2xl bg-white">
      <div
        className={`${
          props.name === "Name" ? "bg-main2 " : "bg-none"
        } w-5 h-5 rounded-full border border-main2 absolute right-2 top-2`}
      ></div>
      <div className="flex items-center justify-between px-20 h-28">
        <h2 className="text-main2 text-2xl font-bold">{props.name}</h2>
        <div className="flex flex-col relative">
          <input
            placeholder={`Input your action ${props.name.toLowerCase()}`}
            className={` pl-5 text-xl h-12 rounded-md  bg-[#F5F6FA] text-Act6  border-[1px]  ${
              isError
                ? "border-red-500 focus:border-red-500 text-red-500"
                : "border-Act6 focus:border-Act6"
            } placeholder-gray-300 border-dashed p-1 focus:outline-none  w-96 h-10`}
            value={value}
            onChange={(e) => {
              handleValueChange(e);
              props.name === "Name" && checkActionNameError(e.target.value);
            }}
            onBlur={(e) => {
              console.log(e);
            }}
          ></input>
          <span className="text-red-500 text-xs absolute mt-12">
            {isError && errorMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionInput;
