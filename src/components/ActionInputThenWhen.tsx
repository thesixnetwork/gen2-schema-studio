import Link from "next/link";
import { useEffect, useState } from "react";
import { setCookie } from "@/service/setCookie";
import { getCookie } from "@/service/getCookie";
import { IActions } from "@/type/Nftmngr";
interface ActionInputThenWhenProps {
  actionType: string;
  action: IActions[];
  actionIndex: number;
  schemaRevision: string;
  isCreateNewAction: boolean;
  isError: boolean;
}

const ActionInputThenWhen = (props: ActionInputThenWhenProps) => {
  const actionName = props.action[props.actionIndex]?.name || "";
  const [action, setAction] = useState(props.action[props.actionIndex]?.when);
  const actionCookieString = getCookie("action");
  const schemacode = getCookie("schemaCode");
  const allAction =
    actionCookieString !== null
      ? JSON.parse(decodeURIComponent(actionCookieString) as string)
      : null;

  const handleClickWhen = () => {
    setCookie(`action-name`, actionName);
    setCookie(`action-${props.actionType}`, action);
  };

  const handleClickThen = (actionThen: string) => {
    setCookie(`action-name`, actionName);
    setCookie(`action-${props.actionType}`, actionThen);
  };

  const handleDeleteWhen = () => {
    props.action[props.actionIndex].when = "";
    console.log("deleted");
  };

  const handleDeleteThen = (index: number) => {
    console.log("deleted");
    props.action[props.actionIndex]?.then.splice(index, 1);
    console.log(props.action[props.actionIndex]?.then);
  };

  const handleCreateNewAction = () => {
    if (!props.isCreateNewAction) {
      setCookie("action", JSON.stringify(props.action));
    } else {
      setCookie("action-name", props.action[props.actionIndex]?.name);
      setCookie("action-desc", props.action[props.actionIndex]?.desc);
    }
    setCookie("isCreateNewThen", "true");
  };

  const checkActionNameIsEmpty = (actionName: string) => {
    return actionName === "";
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
    console.log(":::>", props.action);
    let isDuplicate = false;
    if (allAction !== null) {
      allAction.forEach((item:IActions) => {
        if (item.name === actionNameValue) {
          isDuplicate = true;
        }
      });
    }
    return isDuplicate;
  };

  useEffect(() => {
    setAction(props.action[props.actionIndex]?.when);
  }, [props.action, props.actionIndex]);

  return (
    <div className="border justify-between w-[40vw] relative rounded-md bg-white">
      <div
        className={`${
          props.actionType === "when" ? "bg-main2 " : "bg-none"
        } border-main2 border h-3 w-3 rounded-full absolute right-1 top-1`}
      ></div>
      <div className="flex flex-col justify-between px-10 py-5 gap-y-5">
        <h2 className="text-main2 font-semibold">
          {props.actionType === "when" ? "When" : "Then"}
        </h2>
        {props.actionType === "when" &&
        props.action[props.actionIndex]?.when !== "null" &&
        props.action[props.actionIndex]?.when !== "" ? (
          <Link
            href={`/newdraft/6/${schemacode}/action-form/when/${props.schemaRevision}/${actionName}/${action}`}
          >
            <div
              onClick={() => handleClickWhen()}
              className="bg-[#F0F1F9] w-full h-full flex justify-between items-center px-4 py-6 rounded-lg cursor-pointer hover:bg-[#dbe7ff]"
            >
              <span className="text-Act6 w-[95%]">
                {props.action[props.actionIndex]?.when}
              </span>
              <button
                onClick={handleDeleteWhen}
                className="rounded-full flex h-4 w-4 items-center justify-center border border-main2 text-main2 hover:scale-110 duration-300"
              >
                -
              </button>
            </div>
          </Link>
        ) : (
          props.actionType === "then" &&
          props.action[props.actionIndex]?.then &&
          props.action[props.actionIndex]?.then.map((item, index) => (
            <Link
              href={`/newdraft/6/${schemacode}/action-form/then/${props.schemaRevision}/${actionName}/${item}`}
              key={index}
            >
              {item !== "" && (
                <div
                  onClick={() => {
                    handleClickThen(item);
                  }}
                  key={index}
                  className="bg-[#F0F1F9] w-full h-full flex justify-between items-center px-4 py-6 rounded-lg cursor-pointer hover:bg-[#dbe7ff]"
                >
                  <span className="text-Act6 w-[95%]">{item}</span>
                  <div
                    className="rounded-full flex h-4 w-4 items-center justify-center border border-main2 text-main2 hover:scale-110 duration-300"
                    onClick={() => handleDeleteThen(index)}
                  >
                    -
                  </div>
                </div>
              )}
            </Link>
          ))
        )}
        {((props.actionType === "when" &&
          (props.action[props.actionIndex]?.when === "" ||
            props.action[props.actionIndex]?.when === undefined ||
            props.action[props.actionIndex]?.when === null ||
            props.action[props.actionIndex]?.when === "null")) ||
          props.actionType === "then") && (
          <div className="flex items-center">
            <Link
              href={
                props.actionType === "when"
                  ? `/newdraft/6/${schemacode}/action-form/when/${props.schemaRevision}/${actionName}/create-new-when`
                  : `/newdraft/6/${schemacode}/action-form/then/${props.schemaRevision}/${actionName}/create-new-then`
              }
            >
              <button
                className={`${
                  props.isError
                    ? "text-gray-500"
                    : "text-Act6 hover:scale-110 duration-300"
                } border border-dashed w-fit rounded-sm text-md px-4 py-1.5`}
                onClick={handleCreateNewAction}
                disabled={props.isError}
              >
                <span>+ New Condition</span>
              </button>
            </Link>
            {props.isError && (
              <span className="text-red-500 ml-4">
                *Name can&apos;t be empty or error
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionInputThenWhen;
