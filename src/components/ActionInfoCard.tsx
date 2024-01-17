import Link from "next/link";
import { getCookie } from "@/service/getCookie";
import { useState } from "react";
import { Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import delete_icon from "../../public/pic/deleate_attribute_card.png";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import ConfirmModalChakra from "./ConfirmModalChakra";

interface ActionInfoCardProps {
  name: string;
  description: string;
  when: string;
  then: [string];
  index: number;
  handleDelete: (index: number) => void;
}

const ActionInfoCard = (props: ActionInfoCardProps) => {
  const router = useRouter();
  const displayLines = 4;
  const schemacode = getCookie("schemaCode");
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const ListItem: React.FC<{ text: string }> = ({ text }) => (
    <Tooltip label={text}>
      <li className="text-Act6 font-semibold list-disc">
        {convertStringIfTooLong(text, 36)}
      </li>
    </Tooltip>
  );

  const renderItems = props.then && props.then.map((item, index) => (
    <ListItem key={index} text={item} />
  ));


  const visibleItems = expanded
    ? renderItems
    : renderItems && renderItems.slice(0, displayLines);

  const thenStyle = {
    maxHeight: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as "nowrap",
  };

  const convertStringIfTooLong = (str: string, length: number) => {
    if (str.length > length) {
      return str.substring(0, length) + "..";
    } else {
      return str;
    }
  };

  return (
    <div className="text-black w-96 border rounded-xl p-4 relative bg-white flex flex-col h-full overflow-hidden hover:scale-110 duration-300">
      <div
        onClick={() =>
          router.push(`/newdraft/6/${schemacode}/action-form/${props.name}`)
        }
        className="cursor-pointer"
      >
        <Image
          className="z-20 w-7 h-7 hover:scale-110 duration-300 cursor-pointer absolute top-2 right-2"
          src={delete_icon}
          alt={"delete"}
          onClick={(e) => {
            e.stopPropagation();
            // props.handleDelete(props.index);
            setShowModal(true);
          }}
        />
        {showModal && (
          <ConfirmModalChakra
            title="Are you sure to delete?"
            function={() => props.handleDelete(props.index)}
            isOpen={showModal}
            setIsOpen={setShowModal}
            confirmButtonTitle="Yes, delete"
          />
        )}
        <div className="flex flex-col gap-y-3">
          <div>
            <h6 className="text-main2 font-light">Name</h6>
            <p className="text-Act6 font-semibold">{props.name}</p>
          </div>
          <div>
            <h6 className="text-main2 font-light">Description</h6>
            <p
              className={`${
                props.description === "" ? "text-gray-400" : "text-Act6"
              } font-semibold`}
            >
              {props.description === "" ? "Empty" : props.description}
            </p>
          </div>
          <div>
            <h6 className="text-main2 font-light">When</h6>
            {props.when === undefined ||
            props.when === null ||
            props.when === "" ? (
              <p className="text-gray-400 font-semibold">Empty</p>
            ) : (
              <ul className="ml-8">
                <li className="text-Act6 font-semibold list-disc">
                  <Tooltip label={props.when}>
                    <span>{convertStringIfTooLong(props.when, 36)}</span>
                  </Tooltip>
                </li>
              </ul>
            )}
          </div>
          <div className="text-Act6 font-semibold">
            <h6 className="text-main2 font-light">Then</h6>
            {props.then === undefined ||
            props.then === null ||
            props.then.length === 0 ? (
              <p className="text-gray-400 font-semibold">Empty</p>
            ) : (
              <div style={thenStyle}>
                <ul
                  className={`ml-8 expandable-list ${
                    expanded ? "expanded" : ""
                  }`}
                >
                  {visibleItems}
                </ul>
                {!expanded && props.then.length > displayLines && (
                  <span
                    className="text-gray-500 flex justify-center items-center text-center absolute left-1/2 transform -translate-x-1/2 bottom-1"
                    onClick={toggleExpand}
                  >
                    ...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionInfoCard;
