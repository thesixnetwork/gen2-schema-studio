import { useEffect, useState, useRef } from "react";
import { Handle, Position, useStoreApi } from "reactflow";
import { useReactFlow } from "reactflow";
import { getCookie } from "@/service/getCookie";

interface CircleNodeProps {
  data: {
    id: string;
    showType: string;
    value: string | boolean | number;
    dataType: string;
    isFetch: boolean;
    condition: string;
  };
}

interface EventProps {
  target: {
    value: string;
  };
}

interface AttributeOptionProps{
  name: string;
  dataType: string;
}

const DynamicNode = (props: CircleNodeProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [inputValue, setInputValue] = useState(props.data.value);
  const [valueNodeType, setValueNodeType] = useState(props.data.dataType);
  const [selectedValueNode, setSelectedValueNode] = useState(
    props.data.value === true ? "yes" : "no"
  );
  const [selectValue, setSelectValue] = useState({
    name: props.data.value,
    dataType: props.data.dataType,
  });
  const attributeOption = JSON.parse(
    decodeURIComponent(getCookie("action-attribute") ?? "")
  );
  const handleDragEnter = () => {
    setHovered(true);
  };

  const handleDragLeave = () => {
    setHovered(false);
  };

  const handleDrop = () => {
    setHovered(false);
  };

  const onChange = (e: EventProps) => {
    const { nodeInternals } = store.getState();
    setInputValue(e.target.value);
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === props.data.id) {
          node.data.value = e.target.value;
        }
        return node;
      })
    );
  };

  const handleSelect = (e: EventProps) => {
    setIsSelected(true);
    const selectedOption = JSON.parse(e.target.value);
    setSelectValue({
      name: selectedOption.name,
      dataType: selectedOption.dataType,
    });
    // props.data.value = selectedOption.name
    // props.data.dataType = selectedOption.dataType
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === props.data.id) {
          props.data.isFetch = false;
          props.data.value = selectedOption.name;
          props.data.dataType = selectedOption.dataType;
        }
        return node;
      })
    );
  };

  const handleSelectParamNode = (e: EventProps) => {
    setIsSelected(true);
    const selectedOption = JSON.parse(e.target.value);
    // props.data.value = selectedOption.name
    props.data.dataType = selectedOption.dataType;
    setSelectValue({
      name: selectedOption.name,
      dataType: selectedOption.dataType,
    });
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === props.data.id) {
          props.data.dataType = selectedOption.dataType;
        }
        return node;
      })
    );
  };

  const handleClickValueNode = (e: any) => {
    const itemId = (e.target as HTMLDivElement).id;
    setSelectedValueNode(itemId);
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (itemId === "yes") {
          props.data.value = true;
        } else {
          props.data.value = false;
        }
        return node;
      })
    );
  };

  const getElementWidth = (element: any) => {
    if (!element) {
      console.error("Element is null or undefined");
      return null;
    }

    return element.offsetWidth;
  };

  useEffect(() => {
    console.log("!valuenodetype: ", valueNodeType);
  }, [valueNodeType]);

  useEffect(() => {
    setValueNodeType(props.data.dataType);
    const { nodeInternals } = store.getState();
    if (
      props.data.showType === "valueNode" &&
      props.data.dataType === "boolean" &&
      props.data.isFetch === false
    ) {
      setNodes(
        Array.from(nodeInternals.values()).map((node) => {
          props.data.value = "false";
          return node;
        })
      );
    } else if (
      props.data.showType === "valueNode" &&
      props.data.dataType === "number" &&
      props.data.isFetch === false
    ) {
      setNodes(
        Array.from(nodeInternals.values()).map((node) => {
          props.data.value = 0;
          return node;
        })
      );
    } else if (
      props.data.showType === "valueNode" &&
      props.data.dataType === "string" &&
      props.data.isFetch === false
    ) {
      setNodes(
        Array.from(nodeInternals.values()).map((node) => {
          props.data.value = "";
          return node;
        })
      );
    } else if (props.data.showType === "paramNode") {
      console.log("|||:", props.data.value, props.data.dataType);
      setInputValue(props.data.value);
      setSelectValue({
        name: props.data.value,
        dataType: props.data.dataType,
      });
    }
  }, [props.data.dataType, props.data.isFetch]);

  useEffect(() => {
    if (props.data.showType === "valueNode") {
      if (props.data.dataType === "boolean") {
        setSelectedValueNode(props.data.value === true ? "yes" : "no");
      } else {
        setInputValue(props.data.value);
      }
    } else if (props.data.showType === "attributeNode") {
      setSelectValue({
        name: props.data.value,
        dataType: props.data.dataType,
      });
    }
  }, [props.data.value, props.data.showType, props.data.dataType]);

 

  useEffect(() => {
    if (inputRef.current != null) inputRef.current.focus();
  },[props.data.showType, inputRef]);

  return props.data.showType === "valueNode" ? (
    <div
      className={`w-full p-2 rounded-md flex items-center justify-center border text-black bg-[#DADEF2]
                ${hovered ? "border-indigo-600 opacity-80" : "border-Act6"}`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() =>
        console.log(
          getElementWidth(document.getElementById(props.data.showType))
        )
      }
      id={props.data.showType}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center">
        {valueNodeType === "boolean" ? (
          <>
            <p
              className={`font-bold ${
                hovered ? "text-indigo-600" : "text-Act6"
              }`}
            >
              {" "}
              V:&nbsp;{" "}
            </p>
            <div className="flex w-full  space-evenly">
              <div
                onClick={(e) => handleClickValueNode(e)}
                id="yes"
                className={`cursor-pointer rounded-l-sm hover:scale-110 duration-500 w-14 h-6  flex justify-center items-center border border-Act6 text-Act6 ${
                  selectedValueNode === "yes"
                    ? "bg-Act6 text-white"
                    : "bg-white"
                }`}
              >
                <span
                  onClick={(e) => handleClickValueNode(e)}
                  id="yes"
                  className={
                    selectedValueNode === "yes" ? "font-bold" : "font-normal"
                  }
                >
                  Yes
                </span>
              </div>
              <div
                onClick={(e) => handleClickValueNode(e)}
                id="no"
                className={`cursor-pointer rounded-r-sm hover:scale-110 duration-500 w-14 h-6  flex justify-center items-centerborder border-Act6 text-Act6 ${
                  selectedValueNode === "no" ? "bg-Act6 text-white" : "bg-white"
                }`}
              >
                <span
                  onClick={(e) => handleClickValueNode(e)}
                  id="no"
                  className={
                    selectedValueNode === "no" ? "font-bold" : "font-normal"
                  }
                >
                  No
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p
              className={` font-bold ${
                hovered ? "text-indigo-600" : "text-Act6"
              }`}
            >
              {" "}
              V:&nbsp;{" "}
            </p>
            <input
              ref={inputRef}
              type="text"
              name=""
              id=""
              className="w-16 rounded-sm pl-1 bg-white text-main2"
              onChange={(e) => {
                onChange(e);
              }}
              value={inputValue}
            />
          </>
        )}
      </div>
    </div>
  ) : props.data.showType === "attributeNode" ? (
    <div
      className={`w-full p-2 rounded-md  flex items-center justify-center border bg-[#DADEF2]

                ${hovered ? "border-indigo-600 opacity-80" : "border-Act6"}`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      id={props.data.showType}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center justify-center">
        <p
          className={`${
            hovered ? "text-indigo-600 font-bold " : "text-Act6 font-bold"
          }`}
          onClick={() =>
            console.log(
              getElementWidth(document.getElementById(props.data.showType))
            )
          }
        >
          @:&nbsp;
        </p>
        <select
          id=""
          name=""
          form=""
          className="rounded-sm text-main2 bg-white border border-Act6"
          onChange={handleSelect}
          value={selectValue.name}
        >
          <option value={selectValue.name} disabled selected hidden>
            {selectValue.name === "" || selectValue.name === undefined
              ? "-- select --"
              : selectValue.name}
          </option>
          {attributeOption.map((item:AttributeOptionProps, index:number) => (
            <option
              key={index}
              value={JSON.stringify({
                name: item.name,
                dataType: item.dataType,
              })}
              disabled={
                props.data.condition !== "equal" &&
                props.data.condition !== "notEqual" &&
                item.dataType === "boolean"
              }
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  ) : props.data.showType === "paramNode" ? (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className={`w-full p-2 rounded-md flex flex-col items-center justify-between border border-Act6 bg-[#DADEF2]

      ${hovered ? "border-indigo-600 opacity-80" : "border-gray-600"}`}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        id={props.data.showType}
      >
        <div className="flex h-full w-32 items-center justify-between flex-col">
          <p
            className={`font-bold ${
              hovered ? "text-indigo-600 " : "text-Act6"
            } `}
            onClick={() =>
              console.log(
                getElementWidth(document.getElementById(props.data.showType))
              )
            }
          >
            Param:
          </p>
          <select
            className="bg-white text-main2 border border-Act6 rounded-sm w-32 my-2"
            onChange={handleSelectParamNode}
          >
            <option value={selectValue.dataType} disabled selected hidden>
              {selectValue.dataType === "" || selectValue.dataType === undefined
                ? "-- select type --"
                : selectValue.dataType}
            </option>
            <option
              value={JSON.stringify({ name: "number", dataType: "number" })}
            >
              number
            </option>
            <option
              value={JSON.stringify({ name: "string", dataType: "string" })}
            >
              string
            </option>
          </select>
          <div className="flex items-center justify-center">
            <input
              type="text"
              name=""
              id=""
              className="w-32 rounded-sm bg-white text-main2"
              onChange={onChange}
              placeholder="Input param name"
              value={inputValue}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <div
      id={props.data.showType}
      className={`w-10 h-10 rounded-full flex items-center justify-center border
                ${
                  props.data.showType === "orNode"
                    ? "bg-[#DADEF2]"
                    : props.data.showType === "andNode"
                    ? "bg-[#DADEF2]"
                    : props.data.showType === "equalNode"
                    ? "bg-[#DADEF2]"
                    : props.data.showType === "notEqualNode"
                    ? "bg-[#DADEF2]"
                    : props.data.showType === "moreThanNode"
                    ? "bg-[#DADEF2]"
                    : props.data.showType === "moreThanAndEqualNode"
                    ? "bg-[#DADEF2]"
                    : props.data.showType === "lessThanNode"
                    ? "bg-[#DADEF2]"
                    : props.data.showType === "lessThanAndEqualNode"
                    ? "bg-[#DADEF2]"
                    : props.data.showType === "addNode"
                    ? "bg-transparent"
                    : "bg-white"
                }
                ${hovered ? "border-indigo-600 opacity-80	" : "border-Act6"}`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="target" position={Position.Top} />
      <p
        className={`${
          hovered ? "text-indigo-600 font-bold" : "text-Act6 font-bold"
        }`}
        onClick={() =>
          console.log(
            getElementWidth(document.getElementById(props.data.showType))
          )
        }
      >
        {props.data.showType === "orNode"
          ? "OR"
          : props.data.showType === "andNode"
          ? "AND"
          : props.data.showType === "equalNode"
          ? "="
          : props.data.showType === "notEqualNode"
          ? "≠"
          : props.data.showType === "moreThanNode"
          ? ">"
          : props.data.showType === "moreThanAndEqualNode"
          ? ">="
          : props.data.showType === "lessThanNode"
          ? "<"
          : props.data.showType === "lessThanAndEqualNode"
          ? "<="
          : props.data.showType === "addNode"
          ? "+"
          : "bg-white"}
      </p>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default DynamicNode;
