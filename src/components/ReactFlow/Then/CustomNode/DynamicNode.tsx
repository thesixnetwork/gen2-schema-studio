import { useState, useEffect, useRef } from "react";
import { Handle, Position, useStoreApi } from "reactflow";
import { useReactFlow } from "reactflow";
import { getCookie } from "@/service/getCookie";

interface CircleNodeProps {
  data: {
    id: string;
    showType: string;
    value: string | number | boolean;
    dataType: string;
    isFetch: boolean;
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
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState(props.data.value);
  const [isSelected, setIsSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const attributeOption = JSON.parse(
    decodeURIComponent(getCookie("action-attribute") ?? "")
  );
  const [valueNodeType, setValueNodeType] = useState(props.data.dataType);
  const [selectedValueNode, setSelectedValueNode] = useState(
    props.data.value === true ? "yes" : "no"
  );
  const [selectAttributeValue, setSelectAttributeValue] = useState({
    name: props.data.value,
    dataType: props.data.dataType,
  });
  const [selectValue, setSelectValue] = useState({
    name: props.data.value,
    dataType: props.data.dataType,
  });


  console.log(":: valueNodeType :: ", valueNodeType);
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
    const selectedOption = JSON.parse(e.target.value);
    props.data.value = selectedOption.name;
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

  const handleSelectAttribute = (e: EventProps) => {
    const selectedOption = JSON.parse(e.target.value);
    props.data.value = selectedOption.name;
    props.data.dataType = selectedOption.dataType;
    setSelectAttributeValue({
      name: selectedOption.name,
      dataType: selectedOption.dataType,
    });
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
        console.log("props.data.id", props.data);
        if (node.id === props.data.id) {
          props.data.dataType = selectedOption.dataType;
        }
        return node;
      })
    );
  };

  const handleClickValueNode = (e: React.MouseEvent<HTMLElement>) => {
    const itemId = (e.target as HTMLElement).id;
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

  useEffect(() => {
    setSelectAttributeValue({
      name: props.data.value,
      dataType: props.data.dataType,
    });
    console.log(
      "Select Attribute Value:",
      selectAttributeValue,
      props.data.value
    );
  }, [props.data.value]);

  useEffect(() => {
    if (inputRef.current != null) inputRef.current.focus();
  },[props.data.showType, inputRef]);

  useEffect(() => {
    if (props.data.showType === "valueNode") {
      setInputValue(props.data.value);
    } else if (props.data.showType === "attributeNode") {
      setSelectValue({
        name: props.data.value,
        dataType: props.data.dataType,
      });
    } else if (props.data.showType === "paramNode") {
      setInputValue(props.data.value);
      setSelectValue({
        name: props.data.value,
        dataType: props.data.dataType,
      });
    }
  }, [props.data.value]);

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
    console.log("props.data.datatype: ", props.data.dataType);
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
    }
  }, [props.data.dataType, props.data.isFetch]);

  return props.data.showType === "selectAttributeNode" ? (
    <div
      className={`w-full py-2 px-6 rounded-md flex items-center justify-center border bg-[#DADEF2]
                ${
                  hovered ? "border-indigo-600 opacity-80 " : "border-Act6"
                }`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center">
        <p
          className={`text-Act6 font-bold ${
            hovered ? "text-indigo-600 " : "border-Act6"
          }`}
        >
          Select Your Attribute
        </p>
        <select
          value={String(selectAttributeValue.name)}
          id=""
          name=""
          form=""
          className="rounded-sm text-main2 bg-white w-full"
          onChange={handleSelectAttribute}
        >
          <option value={String(selectAttributeValue.name)} disabled selected hidden>
            {selectAttributeValue.name === "" ||
            selectAttributeValue.name === undefined
              ? "-- select type --"
              : selectAttributeValue.name}
          </option>
          {attributeOption.map((item:AttributeOptionProps, index:number) => (
            <option
              key={index}
              value={JSON.stringify({
                name: item.name,
                dataType: item.dataType,
              })}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  ) : props.data.showType === "increaseNode" ||
    props.data.showType === "decreaseNode" ||
    props.data.showType === "setNode" ||
    props.data.showType === "toNode" ||
    props.data.showType === "amountNode" ? (
    <div
      className={`w-32 h-12 flex justify-center items-center font-bold text-Act6 border border-Act6 ${
        props.data.showType === "increaseNode"
          ? "bg-[#DADEF2]"
          : props.data.showType === "decreaseNode"
          ? "bg-[#DADEF2]"
          : props.data.showType === "setNode"
          ? "bg-[#DADEF2]"
          : props.data.showType === "toNode"
          ? "bg-[#DADEF2]"
          : props.data.showType === "amountNode"
          ? "bg-[#DADEF2]"
          : "bg-white"
      } `}
    >
      <Handle type="target" position={Position.Top} />

      <div>
        {props.data.showType === "increaseNode"
          ? "INCREASE"
          : props.data.showType === "decreaseNode"
          ? "DECREASE"
          : props.data.showType === "setNode"
          ? "SET"
          : props.data.showType === "toNode"
          ? "TO"
          : props.data.showType === "amountNode"
          ? "AMOUNT"
          : null}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  ) : props.data.showType === "valueNode" ? (
    <div
      className={`w-full p-2 rounded-md flex items-center justify-center border text-black 
        ${props.data.showType === "valueNode" ? "bg-[#DADEF2]" : "bg-white"}
        ${hovered ? "border-indigo-600 opacity-80" : "border-Act6"}`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center">
        <p className={`${hovered ? "text-indigo-600" : "text-gray-600"}`}>
          V: &nbsp;
        </p>
        <input
          type="text"
          name=""
          id=""
          className="w-16 rounded-full pl-1"
          onChange={(e) => {
            onChange(e);
          }}
          value={inputValue}
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" /> */}
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center">
        {valueNodeType === "boolean" ? (
          <>
            <p className={`font-bold ${hovered ? "text-indigo-600" : "text-Act6"}`}>
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
                  selectedValueNode === "no"
                  ? "bg-Act6 text-white"
                  : "bg-white"
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
            <p className={`font-bold ${hovered ? "text-indigo-600" : "text-Act6"}`}>
              {" "}
              V:&nbsp;{" "}
            </p>
            <input
              type="text"
              name=""
              id=""
              ref={inputRef}
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
      className={`w-full p-2 rounded-md flex items-center justify-center border bg-[#DADEF2]

                ${
                  hovered ? "border-indigo-600 opacity-80" : "border-Act6"
                }`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center">
        <p className={`font-bold ${hovered ? "text-indigo-600 " : "text-Act6"}`}>
          @:&nbsp;
        </p>
        <select
          id=""
          name=""
          form=""
          className="rounded-sm text-main2 bg-white w-24"
          onChange={handleSelect}
          value={selectValue.name}
        >
          <option value={selectValue.name} disabled selected hidden>
            {selectValue.name === "" || selectValue.name === undefined
              ? "-- select type --"
              : selectValue.name}
          </option>
          {attributeOption.map((item:AttributeOptionProps, index:number) => (
            <option
              key={index}
              value={JSON.stringify({
                name: item.name,
                dataType: item.dataType,
              })}
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
        className={`w-full p-2 rounded-md flex flex-col items-center justify-between border bg-[#DADEF2]

      ${hovered ? "border-indigo-600 opacity-80" : "border-Act6"}`}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex h-full w-32 items-center justify-between flex-col">
          <p className={`font-bold ${hovered ? "text-indigo-600 " : "text-Act6"} `}>
            Param:
          </p>
          <select
            className="text-Act6 rounded-sm bg-white w-32 my-2"
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
          {/* {isSelected ? ( */}
          <div className="flex items-center justify-center">
            <input
              type="text"
              name=""
              id=""
              className="w-32 text-Act6 rounded-sm bg-white"
              onChange={onChange}
              placeholder="  Input param name"
              value={inputValue}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-[transparent]
                ${
                  hovered ? "border-indigo-600 opacity-80	" : "border-gray-600"
                }`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="target" position={Position.Top} />
      <p className={`${hovered ? "text-indigo-600" : "text-gray-600"}`}>+</p>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default DynamicNode;
