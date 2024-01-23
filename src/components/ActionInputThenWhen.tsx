import { useEffect, useState } from "react";
import { setCookie } from "@/service/setCookie";
import { getCookie } from "@/service/getCookie";
import { IActions } from "@/type/Nftmngr";
import { useRouter } from "next/navigation";
import ConfirmModalChakra from "./ConfirmModalChakra";
import AlertModal from "./AlertModal";

interface ActionInputThenWhenProps {
  actionType: string;
  action: IActions[];
  actionIndex: number;
  schemaRevision: string;
  isCreateNewAction: boolean;
  isError: boolean;
  isNameEmpty: boolean;
  setAction: any;
}

const ActionInputThenWhen = (props: ActionInputThenWhenProps) => {
  const router = useRouter();
  const actionName = props.action[props.actionIndex]?.name || "";
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showModalIndex, setShowModalIndex] = useState<number>(0);
  const [action, setAction] = useState<string | string[]>(
    props.actionType === "then"
      ? props.action[props.actionIndex]?.then || []
      : props.action[props.actionIndex]?.when || []
  );
  const schemacode = getCookie("schemaCode");

  const handleClickWhen = () => {
    setCookie(`action-name`, actionName);
    setCookie(`action-${props.actionType}`, String(action));
    localStorage.setItem("action", JSON.stringify(props.action));
  };

  const handleClickThen = (actionThen: string) => {
    setCookie(`action-name`, actionName);
    setCookie(`action-${props.actionType}`, actionThen);
    localStorage.setItem("action", JSON.stringify(props.action));
  };

  const handleDeleteWhen = () => {
    const updatedActionCopy = [...props.action];
    updatedActionCopy[props.actionIndex].when = "";
    setAction("");
    props.setAction(updatedActionCopy);
  };

  const handleDeleteThen = (index: number) => {
    const updatedThen = [...props.action[props.actionIndex]?.then];
    const updatedActionCopy = [...props.action];
    updatedThen.splice(index, 1);
    setAction(updatedThen);
    updatedActionCopy[props.actionIndex].then = updatedThen;
    props.setAction(updatedActionCopy);
  };

  const handleCreateNewAction = () => {
    if (!props.isCreateNewAction) {
      localStorage.setItem("action", JSON.stringify(props.action));
    } else {
      setCookie("action-name", props.action[props.actionIndex]?.name);
      setCookie("action-desc", props.action[props.actionIndex]?.desc);
      setCookie("action-then-arr", JSON.stringify(props.action[props.actionIndex]?.then));
    }
    setCookie("isCreateNewThen", "true");

    if (props.isNameEmpty) {
      setIsOpen(true);
    } else {
      router.push(
        props.actionType === "when"
          ? `/newdraft/6/${schemacode}/action-form/when/${props.schemaRevision}/${actionName}/create-new-when`
          : `/newdraft/6/${schemacode}/action-form/then/${props.schemaRevision}/${actionName}/create-new-then`
      );
    }
  };

  useEffect(() => {
    if (props.actionType === "when") {
      setAction(props.action[props.actionIndex]?.when);
    } else if (props.actionType === "then") {
      setAction(props.action[props.actionIndex]?.then);
    }
  }, [props.action, props.actionIndex]);


  return (
    <div className="border justify-between w-[40vw] relative rounded-2xl bg-white">
      <div
        className={`bg-main2  w-5 h-5 rounded-full border border-main2 absolute right-2 top-2`}
      ></div>
      <div className="flex flex-col justify-between px-20 py-8 gap-y-5">
        <h2 className="text-main2 text-2xl font-bold">
          {props.actionType === "when" ? "When" : "Then"}
        </h2>
        {props.actionType === "when" &&
        props.action[props.actionIndex]?.when !== "null" &&
        props.action[props.actionIndex]?.when !== "" ? (
          <div
            onClick={() =>
              router.push(
                `/newdraft/6/${schemacode}/action-form/when/${props.schemaRevision}/${actionName}/${action}`
              )
            }
            className="cursor-pointer"
          >
            <div
              onClick={() => handleClickWhen()}
              className="bg-[#F0F1F9] w-full h-full flex justify-between items-center px-4 py-6 rounded-lg cursor-pointer hover:bg-[#dbe7ff]"
            >
              <span className="text-Act6 text-xl w-[95%]">
                {props.action[props.actionIndex]?.when}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="rounded-full flex h-4 w-4 items-center justify-center border border-main2 text-main2 hover:scale-110 duration-300"
              >
                -
              </button>
              {showModal && (
                <ConfirmModalChakra
                  title="Are you sure to delete when?"
                  function={() => handleDeleteWhen()}
                  isOpen={showModal}
                  setIsOpen={setShowModal}
                  confirmButtonTitle="Yes, delete"
                />
              )}
            </div>
          </div>
        ) : (
          props.actionType === "then" &&
          props.action[props.actionIndex]?.then &&
          props.action[props.actionIndex]?.then.map((item, index) => (
            <div
              onClick={() =>
                router.push(
                  `/newdraft/6/${schemacode}/action-form/then/${props.schemaRevision}/${actionName}/${item}`
                )
              }
              className="cursor-pointer"
              key={index}
            >
              {item !== "" && (
                <div
                  onClick={() => {
                    handleClickThen(item);
                    setCookie("actionThenIndex", index.toString());
                    setCookie("isEditInCreateNewAction", "true");
                  }}
                  key={index}
                  className="bg-[#F0F1F9] w-full h-full flex justify-between items-center px-4 py-6 rounded-lg cursor-pointer hover:bg-[#dbe7ff]"
                >
                  <span className="text-Act6 text-xl w-[95%]">{item}</span>
                  <div
                    className="z-100 rounded-full flex h-4 w-4 items-center justify-center border bg-main border-main2 text-main2 hover:scale-110 duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                      setShowModalIndex(index);
                    }}
                  >
                    -
                  </div>
                  {showModal && showModalIndex === index && (
                    <ConfirmModalChakra
                      title="Are you sure to delete then?"
                      function={() => handleDeleteThen(index)}
                      isOpen={showModal}
                      setIsOpen={setShowModal}
                      confirmButtonTitle="Yes, delete"
                    />
                  )}
                </div>
              )}
            </div>
          ))
        )}
        {((props.actionType === "when" &&
          (props.action[props.actionIndex]?.when === "" ||
            props.action[props.actionIndex]?.when === undefined ||
            props.action[props.actionIndex]?.when === null ||
            props.action[props.actionIndex]?.when === "null")) ||
          props.actionType === "then") && (
          <div className="flex items-center">
            {props.isNameEmpty && (
              <AlertModal
                title="Name can't be empty"
                type="error"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            )}
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
