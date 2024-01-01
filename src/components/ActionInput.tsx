import { useState, useEffect } from "react";
import { IActions } from "@/type/Nftmngr";
import { getCookie } from "@/service/getCookie";

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
  const actionCookieString = getCookie("action");

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
    <div className="border justify-between w-[40vw] relative rounded-md bg-white">
      <div
        className={`${
          props.name === "Name" ? "bg-main2 " : "bg-none"
        } border-main2 border h-3 w-3 rounded-full absolute right-1 top-1`}
      ></div>
      <div className="flex items-center justify-between px-10 h-28">
        <h2 className="text-main2 font-semibold">{props.name}</h2>
        <div className="flex flex-col relative">
          <input
            placeholder={`Input your action ${props.name.toLowerCase()}`}
            className={`pl-4 rounded-sm bg-[#F5F6FA] text-Act6 text-[14px] border-[1px]  ${
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
          <span className="text-red-500 text-xs absolute mt-10">
            {isError && errorMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionInput;
