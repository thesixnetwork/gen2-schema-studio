interface ActionInputThenWhenProps {
  actionType: string;
  action: string;
}

const ActionInputThenWhen = (props: ActionInputThenWhenProps) => {
  return (
    <div className="border justify-between w-[40vw] relative rounded-md">
      <div className="bg-[#44498D] h-3 w-3 rounded-full absolute right-1 top-1"></div>
      <div className="flex flex-col justify-between px-10 py-5 gap-y-5">
        <h2 className="text-[#44498D] font-semibold">{props.actionType}</h2>
        <div className="bg-[#F0F1F9] w-full h-full flex justify-between items-center px-4 py-6 rounded-lg">
            <span className="text-[#3980F3] w-[95%]">
              {props.action}
            </span>
            <button className="rounded-full flex h-4 w-4 items-center justify-center border border-[#44498D] text-[#44498D] hover:scale-110 duration-300">
              -
            </button>
        </div>
        <button className="text-[#3980F3] border border-dashed w-fit rounded-sm text-md px-4 py-1.5 hover:scale-110 duration-300">
          <span>+ New Condition</span>
        </button>
      </div>
    </div>
  );
};

export default ActionInputThenWhen;
