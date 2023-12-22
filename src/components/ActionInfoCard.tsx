import Link from "next/link";
interface ActionInfoCardProps {
  name: string;
  description: string;
  when: string;
  then: [string];
  index: number;
  handleDelete: (index: number) => void;
}

const ActionInfoCard = (props: ActionInfoCardProps) => {
  console.log("::props name", props.name);

  return (
    <Link href={`/actions/action-form/${props.name}`}>
      <div className="text-black w-96 border rounded-xl p-4 relative bg-white">
        <div
          className="border border-red-600 rounded-full h-4 w-4 flex items-center justify-center text-red-600 text-xs absolute right-2 top-2 hover:scale-110 duration-300 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            props.handleDelete(props.index);
          }}
        >
          X
        </div>
        <div className="flex flex-col gap-y-3">
          <div>
            <h6 className="text-[#44498D] font-light">Name</h6>
            <p className="text-[#3980F3] font-semibold">{props.name}</p>
          </div>
          <div>
            <h6 className="text-[#44498D] font-light">Description</h6>
            <p
              className={`${
                props.description === "" ? "text-gray-400" : "text-[#3980F3]"
              } font-semibold`}
            >
              {props.description === "" ? "Empty" : props.description}
            </p>
          </div>
          <div>
            <h6 className="text-[#44498D] font-light">When</h6>
            <p className="text-[#3980F3] font-semibold">{props.when}</p>
          </div>
          <div className="text-[#3980F3] font-semibold">
            <h6 className="text-[#44498D] font-light">Then</h6>
            {props.then === undefined ||
            props.then === null ||
            props.then.length === 0 ? (
              <p className="text-gray-400 font-semibold">Empty</p>
            ) : (
              <ul>
                {props.then.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActionInfoCard;
