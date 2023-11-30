import Link from "next/link";

const ActionCreateCard = () => {
  return (
    <Link href="/actions/create-action">
      <div className="w-48 h-48 text-black flex flex-col justify-center items-center border border-red-600">
        <h2>+</h2>
        <h6>New Action</h6>
      </div>
    </Link>
  );
};

export default ActionCreateCard;
