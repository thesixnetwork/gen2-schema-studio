import Link from "next/link";
import { useEffect, useState } from "react";
import { setCookie } from "@/service/setCookie";
import { IActions } from "@/type/Nftmngr";
interface ActionInputThenWhenProps {
  actionType: string;
  action: IActions[];
  actionIndex: number;
  schemaRevision: string;
  isCreateNewAction: boolean;
}
import { getCookie } from "@/service/getCookie";

const ActionInputThenWhen = (props: ActionInputThenWhenProps) => {
  const getCookieData = getCookie("action");
  console.log(":: action ::", props.action);
  const actionName = props.action[props.actionIndex]?.name || "";
  const initialAction = props.action[props.actionIndex]?.when || "";

  const [action, setAction] = useState(initialAction);
  console.log("::action 2::", action);

  const handleClickWhen = () => {
    setCookie(`action-name`, actionName);
    setCookie(`action-${props.actionType}`, action);
  };

  const handleClickThen = (actionThen: string) => {
    setCookie(`action-name`, actionName);
    setCookie(`action-${props.actionType}`, actionThen);
  };

  const handleDelete = (index: number) => {
    const newAction = [...action];
    newAction.splice(index, 1);
    setAction(newAction);
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

  useEffect(() => {
    setAction(props.action[props.actionIndex]?.when || "");
    console.log("seting");
    console.log(initialAction);
  }, []);

  // useEffect(() => {
  //   if (
  //     allAction &&
  //     Array.isArray(props.action) &&
  //     props.actionIndex >= 0 &&
  //     props.actionIndex < props.action.length
  //   ) {
  //     setAction(
  //       props.actionType === "when"
  //         ? allAction[props.actionIndex]?.when || ""
  //         : allAction[props.actionIndex]?.then || ""
  //     );
  //   }
  // }, [allAction, props.actionIndex, props.actionType]);

  // useEffect(() => {
  //   if (getCookieData && !props.isCreateNewAction) {
  //     const parsedCookieData = JSON.parse(decodeURIComponent(getCookieData));

  //     setAllAction(parsedCookieData);
  //   }

  // }, [getCookieData]);

  return (
    <div className="border justify-between w-[40vw] relative rounded-md bg-white">
      <div
        className={`${
          props.actionType === "when" ? "bg-[#44498D] " : "bg-none"
        } border-[#44498D] border h-3 w-3 rounded-full absolute right-1 top-1`}
      ></div>
      <div className="flex flex-col justify-between px-10 py-5 gap-y-5">
        <h2 className="text-[#44498D] font-semibold">
          {props.actionType === "when" ? "When" : "Then"}
        </h2>
        {props.actionType === "when" &&
        props.action[props.actionIndex]?.when !== "null" &&
        props.action[props.actionIndex]?.when !== "" ? (
          <Link
            href={`/actions/action-form/when/${props.schemaRevision}/${actionName}/${action}`}
          >
            <div
              onClick={() => handleClickWhen()}
              className="bg-[#F0F1F9] w-full h-full flex justify-between items-center px-4 py-6 rounded-lg cursor-pointer hover:bg-[#dbe7ff]"
            >
              <span className="text-[#3980F3] w-[95%]">
                {props.action[props.actionIndex]?.when}
              </span>
              <button className="rounded-full flex h-4 w-4 items-center justify-center border border-[#44498D] text-[#44498D] hover:scale-110 duration-300">
                -
              </button>
            </div>
          </Link>
        ) : (
          props.actionType === "then" &&
          props.action[props.actionIndex]?.then &&
          props.action[props.actionIndex]?.then.map((item, index) => (
            <Link
              href={`/actions/action-form/then/${props.schemaRevision}/${actionName}/${item}`}
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
                  <span className="text-[#3980F3] w-[95%]">{item}</span>
                  <div
                    className="rounded-full flex h-4 w-4 items-center justify-center border border-[#44498D] text-[#44498D] hover:scale-110 duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
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
          <Link
            href={
              props.actionType === "when"
                ? `/actions/action-form/when/${props.schemaRevision}/${actionName}/create-new-when`
                : `/actions/action-form/then/${props.schemaRevision}/${actionName}/create-new-then`
            }
          >
            <button
              className="text-[#3980F3] border border-dashed w-fit rounded-sm text-md px-4 py-1.5 hover:scale-110 duration-300"
              onClick={handleCreateNewAction}
            >
              <span>+ New Condition</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ActionInputThenWhen;
