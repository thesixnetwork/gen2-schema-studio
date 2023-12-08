import Link from "next/link";

interface ActionInputThenWhenProps {
  actionType: string;
  action: string[];
  actionName: string;
  schemaRevision: string;
}

const ActionInputThenWhen = (props: ActionInputThenWhenProps) => {
  console.log(">>1", props.actionType);
  console.log(">>2", props.action);
  console.log(">>3", props.schemaRevision);
  return (
    <div className="border justify-between w-[40vw] relative rounded-md">
      <div className="bg-[#44498D] h-3 w-3 rounded-full absolute right-1 top-1"></div>
      <div className="flex flex-col justify-between px-10 py-5 gap-y-5">
        <h2 className="text-[#44498D] font-semibold">
          {props.actionType === "when" ? "When" : "Then"}
        </h2>
        {props.action.map((item, index) => (
          <Link
            href={
              props.actionType === "when"
                ? `/actions/create-action/when/${props.schemaRevision}/${props.actionName}/${item}`
                : `/actions/create-action/then/${props.schemaRevision}/${props.actionName}/${item}`
            }
            key={index}
          >
            <div
              key={index}
              className="bg-[#F0F1F9] w-full h-full flex justify-between items-center px-4 py-6 rounded-lg cursor-pointer hover:bg-[#dbe7ff]"
            >
              <span className="text-[#3980F3] w-[95%]">{item}</span>
              <button className="rounded-full flex h-4 w-4 items-center justify-center border border-[#44498D] text-[#44498D]  hover:scale-110 duration-300">
                -
              </button>
            </div>
          </Link>
        ))}
        {((props.actionType === "when" && props.action.length === 0) ||
          props.actionType === "then") && (
          <Link
            href={
              props.actionType === "when"
                ? `/actions/create-action/when/${props.schemaRevision}/${props.actionName}/create-new-when`
                : `/actions/create-action/then/${props.schemaRevision}/${props.actionName}/create-new-then`
            }
          >
            <button className="text-[#3980F3] border border-dashed w-fit rounded-sm text-md px-4 py-1.5 hover:scale-110 duration-300">
              <span>+ New Condition</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ActionInputThenWhen;
