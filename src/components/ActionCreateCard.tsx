import Link from "next/link";

const ActionCreateCard = () => {
  return (
    <Link href="/actions/action-form/create-new-action">
      <div className="w-48 h-48 text-black flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-2xl hover:scale-110 duration-300 gap-y-2">
        <h2 className="text-[#3980F3] border border-[#3980F3] flex items-center justify-center rounded-full h-6 w-6">+</h2>
        <h6 className="text-[#3980F3]">New Action</h6>
      </div>
    </Link>
  );
};

export default ActionCreateCard;
