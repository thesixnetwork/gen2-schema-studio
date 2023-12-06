interface ActionInfoCardProps{
    name: string;
    description: string;
    when: string;
    then: [string];
}

const ActionInfoCard = (props:ActionInfoCardProps) => {
  return (
    <div className="text-black w-96 border rounded-xl p-4 relative">
        <div className="border border-red-600 rounded-full h-4 w-4 flex items-center justify-center text-red-600 text-xs absolute right-2 top-2 hover:scale-110 duration-300 cursor-pointer">X</div>
      <div>
        <h6 className="text-[#44498D] font-light">Name</h6>
        <p className="text-[#3980F3] font-semibold">{props.name}</p>
      </div>
      <div>
        <h6 className="text-[#44498D] font-light">Description</h6>
        <p className="text-[#3980F3] font-semibold">{props.description}</p>
      </div>
      <div>
        <h6 className="text-[#44498D] font-light">When</h6>
        <p className="text-[#3980F3] font-semibold">
          {props.when}
        </p>
      </div>
      <div className="text-[#3980F3] font-semibold">
        <h6 className="text-[#44498D] font-light">Then</h6>
        <p>meta.scda {props.then}</p>
      </div>
    </div>
  );
};

export default ActionInfoCard;
