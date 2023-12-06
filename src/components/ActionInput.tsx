interface ActionInputProps {
  name: string;
}

const ActionInput = (props: ActionInputProps) => {
  return (
    <div className="border justify-between w-[40vw] relative rounded-md">
      <div className="bg-[#44498D] h-3 w-3 rounded-full absolute right-1 top-1"></div>
      <div className="flex items-center justify-between px-10 py-5">
        <h2 className="text-[#44498D] font-semibold">{props.name}</h2>
        <input
          placeholder={`Input your action ${props.name.toLowerCase()}`}
          className="pl-4 rounded-sm bg-[#F5F6FA] text-[#3980F3] text-[14px] border-[1px] border-[#3980F3] focus:border-[#3980F3] placeholder-gray-300 border-dashed p-1 focus:outline-none focus:scale-105 duration-1000 w-96 h-10"
        ></input>
      </div>
    </div>
  );
};

export default ActionInput;
