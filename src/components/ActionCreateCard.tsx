import Link from "next/link";
import { getCookie } from "@/service/getCookie";

const ActionCreateCard = () => {
  const schemacode = getCookie("schemaCode");
  return (
    <Link href={`/newdraft/6/${schemacode}/action-form/create-new-action`}>
      <div className="w-48 h-48 text-black flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-2xl hover:scale-110 duration-300 gap-y-2">
        <h2 className="text-Act6 border border-Act6 flex items-center justify-center rounded-full h-6 w-6">+</h2>
        <h6 className="text-Act6">New Action</h6>
      </div>
    </Link>
  );
};

export default ActionCreateCard;
