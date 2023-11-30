import { useEffect, useState } from "react";
import { Handle, Position, useStoreApi } from "reactflow";
import { useReactFlow } from "reactflow";
import axios from "axios";
import {
  getAccessTokenFromLocalStorage,
  getSCHEMA_CODE,
} from "@/helpers/AuthService";
import { set } from "lodash";

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

const DynamicNode = (props: CircleNodeProps) => {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();

  const [hovered, setHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [attributeOption, setAttributeOption] = useState([]);
  const [attributesObj, setAttributesObj] = useState();
  const [inputValue, setInputValue] = useState(props.data.value);
  const [valueNodeType, setValueNodeType] = useState(props.data.dataType);
  const [selectedValueNode, setSelectedValueNode] = useState(
    props.data.value === true ? "yes" : "no"
  );
  const [selectValue, setSelectValue] = useState({
    name: props.data.value,
    dataType: props.data.dataType,
  });

  //getAttribute from token attribute and nftattribute
  const combineArrays = (arr1, arr2) => {
    const tempArr = [];

    arr1.forEach((item) => {
      tempArr.push({ name: item.name, dataType: item.data_type.toLowerCase() });
    });

    arr2.forEach((item) => {
      tempArr.push({ name: item.name, dataType: item.data_type.toLowerCase() });
    });

    setAttributeOption(tempArr);
    console.log("!!---->", attributeOption);
  };

  const handleDragEnter = () => {
    setHovered(true);
  };

  const handleDragLeave = () => {
    setHovered(false);
  };

  const handleDrop = () => {
    setHovered(false);
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
        setAttributesObj(
          response.data.data.schema_info.schema_info.onchain_data
        );
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

  const handleClickValueNode = (e) => {
    const itemId = e.target.id;
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

  // useEffect(() => {
  //   console.log("!valuenodetype: ", valueNodeType);
  // }, [valueNodeType]);

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
    }
  }, [props.data.dataType, props.data.isFetch]);

  useEffect(() => {
    const asyncFetchData = async () => {
      await fetchData();
    };
    asyncFetchData();
  }, [props.data.showType]);

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
    if (attributesObj !== undefined) {
      const tokenAttributes = attributesObj.token_attributes;
      const nftAttributes = attributesObj.nft_attributes;
      combineArrays(tokenAttributes, nftAttributes);
    }
  }, [attributesObj]);

  return props.data.showType === "valueNode" ? (
    <div
      className={`w-full p-2 rounded-full flex items-center justify-center border-2 text-black bg-[#E8EFFF]
                ${
                  hovered ? "border-indigo-600 opacity-80" : "border-gray-600"
                }`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center">
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
                    ? "bg-opacity-100 font-bold"
                    : "bg-opacity-40 font-normal"
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
            onChange={handleSelect}
          >
            <option value="" disabled selected hidden>
              - select type -
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
          {isSelected ? (
            <div className="flex items-center justify-center">
              <input
                type="text"
                name=""
                id=""
                className="w-32 rounded-full text-black"
                onChange={onChange}
                placeholder="  Input Param Name"
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  ) : (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center border-2
                ${
                  props.data.showType === "orNode"
                    ? "bg-[#ff6700]"
                    : props.data.showType === "andNode"
                    ? "bg-[#6865A5]"
                    : props.data.showType === "equalNode"
                    ? "bg-[#7da4f7]"
                    : props.data.showType === "notEqualNode"
                    ? "bg-[#ff0072]"
                    : props.data.showType === "moreThanNode"
                    ? "bg-[#00d7ca]"
                    : props.data.showType === "moreThanAndEqualNode"
                    ? "bg-[#6ede87]"
                    : props.data.showType === "lessThanNode"
                    ? "bg-[#9ca8b3]"
                    : props.data.showType === "lessThanAndEqualNode"
                    ? "bg-[#FF99C3]"
                    : props.data.showType === "addNode"
                    ? "bg-[#ffc800]"
                    : "bg-white"
                }
                ${
                  hovered ? "border-indigo-600 opacity-80	" : "border-gray-600"
                }`}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="target" position={Position.Top} />
      <p className={`${hovered ? "text-indigo-600" : "text-gray-600"}`}>
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
