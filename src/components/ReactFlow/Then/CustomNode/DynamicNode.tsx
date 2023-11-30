import { useState, useEffect } from "react";
import { Handle, Position, useStoreApi } from "reactflow";
import { useReactFlow } from "reactflow";
import {
  getAccessTokenFromLocalStorage,
  getSCHEMA_CODE,
} from "@/helpers/AuthService";
import axios from "axios";

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

interface Attribute {
  name: string;
  data_type: string;
}

const DynamicNode = (props: CircleNodeProps) => {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();

  const [inputValue, setInputValue] = useState(props.data.value);
  const [isSelected, setIsSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [attributeOption, setAttributeOption] = useState<{ name: string; dataType: string }[]>([]);
  const [attributesObj, setAttributesObj] = useState();
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
  // console.log("props-->", props.data.value);
  // console.log("-->atb", typeof props.data.value + ">" + props.data.value);
  // console.log("atbot--->", selectAttributeValue);

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

  const getAttributeOption = (arr1: Attribute[], arr2: Attribute[]) => {
    const  tempArr: { name: string; dataType: string }[] = [];

    arr1.forEach((item) => {
      tempArr.push({ name: item.name, dataType: item.data_type.toLowerCase() });
    });

    arr2.forEach((item) => {
      tempArr.push({ name: item.name, dataType: item.data_type.toLowerCase() });
    });

    setAttributeOption(tempArr);
  };

  const fetchData = async () => {
    const apiUrl = `${
      process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO
    }schema/get_schema_info/${getSCHEMA_CODE()}`;
    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
    };
    await axios
      .get(apiUrl, {
        params: params,
        headers: headers,
      })
      .then((response) => {
        console.log("Response:", response.data);
        setAttributesObj(
          response.data.data.schema_info.schema_info.onchain_data
        );
        console.log("actionName:", attributesObj);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
    const asyncFetchData = async () => {
      await fetchData();
    };
    asyncFetchData();
  }, []);

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
    if (attributesObj !== undefined) {
      const tokenAttributes = attributesObj.token_attributes;
      const nftAttributes = attributesObj.nft_attributes;
      getAttributeOption(tokenAttributes, nftAttributes);
    }
  }, [attributesObj]);

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
      className={`w-full py-2 px-6 rounded-full flex items-center justify-center border-2 bg-[#ff0072]
                ${
                  hovered ? "border-indigo-600 opacity-80 " : "border-gray-600"
                }`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center">
        <p
          className={`text-white ${
            hovered ? "text-indigo-600 " : "text-gray-600"
          }`}
        >
          Select Your Attribute
        </p>
        <select
          value={selectAttributeValue.name}
          id=""
          name=""
          form=""
          className="rounded-full text-black w-full"
          onChange={handleSelectAttribute}
        >
          <option value={selectAttributeValue.name} disabled selected hidden>
            {selectAttributeValue.name === "" ||
            selectAttributeValue.name === undefined
              ? "-- select type --"
              : selectAttributeValue.name}
          </option>
          {attributeOption.map((item, index) => (
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
      className={`w-32 h-12 flex justify-center items-center border-2 ${
        props.data.showType === "increaseNode"
          ? "bg-[#ff6700]"
          : props.data.showType === "decreaseNode"
          ? "bg-[#6865A5]"
          : props.data.showType === "setNode"
          ? "bg-[#ffc800]"
          : props.data.showType === "toNode"
          ? "bg-[#5E5F9C]"
          : props.data.showType === "amountNode"
          ? "bg-[#B33640]"
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
      className={`w-full p-2 rounded-full flex items-center justify-center border-2 text-black 
        ${props.data.showType === "valueNode" ? "bg-[#6ede87]" : "bg-white"}
        ${hovered ? "border-indigo-600 opacity-80" : "border-gray-600"}`}
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
        <button onClick={() => console.log(valueNodeType)}>log</button>
        {valueNodeType === "boolean" ? (
          <>
            <p className={`${hovered ? "text-indigo-600" : "text-gray-600"}`}>
              {" "}
              V:&nbsp;{" "}
            </p>
            <div className="flex w-full  space-evenly">
              <div
                onClick={(e) => handleClickValueNode(e)}
                id="yes"
                className={`cursor-pointer rounded-l-full hover:scale-110 duration-500 w-10 h-6  flex justify-center items-center bg-white ${
                  selectedValueNode === "yes"
                    ? "bg-opacity-100"
                    : "bg-opacity-40"
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
                className={`cursor-pointer rounded-r-full hover:scale-110 duration-500 w-10 h-6  flex justify-center items-center bg-white ${
                  selectedValueNode === "no"
                    ? "bg-opacity-100"
                    : "bg-opacity-40"
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
            <p className={`${hovered ? "text-indigo-600" : "text-gray-600"}`}>
              {" "}
              V:&nbsp;{" "}
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
          </>
        )}
      </div>
    </div>
  ) : props.data.showType === "attributeNode" ? (
    <div
      className={`w-full p-2 rounded-full flex items-center justify-center border-2 bg-[#D298DD]

                ${
                  hovered ? "border-indigo-600 opacity-80" : "border-gray-600"
                }`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center">
        <p className={`${hovered ? "text-indigo-600 " : "text-gray-600"}`}>
          @:&nbsp;
        </p>
        <select
          id=""
          name=""
          form=""
          className="rounded-full text-black"
          onChange={handleSelect}
          value={selectValue.name}
        >
          <option value={selectValue.name} disabled selected hidden>
            {selectValue.name === "" || selectValue.name === undefined
              ? "-- select type --"
              : selectValue.name}
          </option>
          {attributeOption.map((item, index) => (
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
        className={`w-full p-2 rounded-lg flex flex-col items-center justify-between border-2 bg-[#FFCE74]

      ${hovered ? "border-indigo-600 opacity-80" : "border-gray-600"}`}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex h-full w-32 items-center justify-between flex-col">
          <p className={`${hovered ? "text-indigo-600 " : "text-gray-600"} `}>
            Param:
          </p>
          <select
            className="text-black rounded-full w-32 my-2"
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
              className="w-32 rounded-full text-black"
              onChange={onChange}
              placeholder="  Input Param Name"
              value={inputValue}
            />
          </div>
          {/* ) : (
            <div></div>
          )} */}
        </div>
      </div>
    </>
  ) : (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-[#ffc800]
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
