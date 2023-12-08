import { useEffect, useMemo } from "react";
import { useState, DragEvent, useRef, useCallback } from "react";

import ReactFlow, {
  addEdge,
  ReactFlowInstance,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  useReactFlow,
  NodeChange,
  NodeOrigin,
} from "reactflow";
import "reactflow/dist/base.css";
import { Factory } from "@/function/ConvertObjectToMetadata/Factory";
import Flowbar from "./Flowbar";
import InputNode from "./CustomNode/InputNode";

// import { useParams } from "react-router-dom";
import parser_then from "@/function/ConvertMetadataToObject/action_then";

// import SyntaxHighlighter from "react-syntax-highlighter";

// import NormalButton from "../../NormalButton";
import {
  getAccessTokenFromLocalStorage,
  saveSCHEMA_CODE,
} from "@/helpers/AuthService";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Link from "next/link";

interface ThenAttributeFlowProps {
  metaFunction: string;
  actionName: string;
  schemaRevision: string;
  isDraft: boolean;
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "customInputNode",
    position: { x: 0, y: 0 },
    draggable: false,
    data: {
      showType: "selectAttributeNode",
      id: "1",
      parentNode: "root",
      label: { x: 0, y: 0 },
    },
  },
];

let id = 2;

const getId = () => `${id++}`;

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const NODE_WIDTH = 150;
const NODE_HEIGHT = 57;
const GRID_PADDING = 60;

const ThenAttributeFlow = (props: ThenAttributeFlowProps) => {
  // const param = useParams();
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const nodeTypes = useMemo(() => {
    return {
      customInputNode: InputNode,
      textUpdate: InputNode,
    };
  }, []);

  console.log("--nodeOrigin--", nodeOrigin);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [updatedNodes, setUpdatedNodes] = useState(initialNodes);
  const [metaData, setMetaData] = useState("please add item");
  const { setCenter, project } = useReactFlow();
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [createFirstNode, setCreateFirstNode] = useState(true);
  const [actionData, setActionData] = useState();
  const [actionThenArr, setActionThenArr] = useState([]);
  const [actionThenIndex, setActionThenIndex] = useState(null);
  const [isCreateNewAction, setIsCreateNewAction] = useState(false);
  const [isGenerateGPT, setIsGenerateGPT] = useState(false);
  // const navigate = useNavigate();
  const nodeWidthAndHeight = {
    width: 150,
    height: 57,
    width_input: 151.2,
    height_input: 35.2,
    grid_padding: 60,
  };

  const isBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (error) {
      return false;
    }
  };

  const onConnect = (params: Connection | Edge) =>
    setEdges((eds) => addEdge(params, eds));
  const onInit = (rfi: ReactFlowInstance) => setReactFlowInstance(rfi);

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const convertObjectToNode = (obj) => {
    let nodeIdCounter = 1;
    const outputArray = [];
    const edgesArr = [];

    const processNode = (node, parentNodeId = null, parentPositionY = 0) => {
      console.log("log herre", node)
      const nodeId = `${nodeIdCounter++}`;
      const outputNode = {
        width: 128,
        height: 57,
        id: nodeId,
        type: "customInputNode",
        position: { x: 0, y: parentPositionY },
        draggable: false,
        data: {
          showType: "",
          id: nodeId,
          parentNode: parentNodeId,
          label: { x: 0, y: parentPositionY },
          value: "",
          dataType: "",
          isFetch: true,
        },
      };

      const outputNode2 = {
        width: 124,
        height: 57,
        id: `${parseInt(nodeId) + 1}`,
        type: "customInputNode",
        position: { x: 0, y: parentPositionY + 150 },
        draggable: false,
        data: {
          showType: "",
          id: `${parseInt(nodeId) + 1}`,
          parentNode: `${parseInt(parentNodeId) + 1}`,
          label: { x: 0, y: parentPositionY + 150 },
          value: "",
          dataType: "",
          isFetch: true,
        },
      };

      console.log("node==>", node);

      console.log("value", node.value);

      if (
        node.type === "meta_function" &&
        (node.functionName === "SetNumber" ||
          node.functionName === "SetString" ||
          node.functionName === "SetBoolean" ||
          node.functionName === "SetFloat")
      ) {
        outputNode.data.showType = "selectAttributeNode";
        outputNode.data.value = node.attributeName.value;
        outputNode.width = 202;
        if (node.functionName === "SetNumber") {
          outputNode.data.dataType = "number";
        } else if (node.functionName === "SetString") {
          outputNode.data.dataType = "string";
        } else if (node.functionName === "SetBoolean") {
          outputNode.data.dataType = "boolean";
        }
        setSelectedAttribute(node.attributeName.dataType);
      } else if (node.type === "constant" && (node.value || (node.dataType === "bool" && node.type === "constant")) && !node.left) {
        outputNode.data.showType = "setNode";
        outputNode2.data.showType = "valueNode";
        outputNode2.data.value = node.value;
      } else if (node.type === "constant" && node.dataType) {
        outputNode.data.showType = "valueNode";
        outputNode.data.value = node.value;
      } else if (node.right.type === "constant" && node.dataType) {
        outputNode.data.showType = "valueNode";
        outputNode.data.value = node.value;
      } else if (
        node.type === "math_operation" &&
        node.value === "+" &&
        node.left
      ) {
        outputNode.data.showType = "increaseNode";
        outputNode2.data.showType = "valueNode";
        outputNode2.data.value = node.right.value;
      } else if (
        node.type === "math_operation" &&
        node.value === "-" &&
        node.left
      ) {
        outputNode.data.showType = "decreaseNode";
        outputNode2.data.showType = "valueNode";
        outputNode2.data.value = node.right.value;
      } else if (node.type === "math_operation" && node.value === "+") {
        outputNode.data.showType = "increaseNode";
        outputNode.data.value = node.value;
      } else if (node.type === "math_operation" && node.value === "-") {
        outputNode.data.showType = "decreaseNode";
        outputNode.data.value = node.value;
      }

      if (node.type === "constant" && node.value) {
        if (outputNode2.data.showType === "valueNode") {
          outputArray.push(outputNode, outputNode2);
        } else {
          outputArray.push(outputNode);
        }
      } else {
        console.log("A===", outputArray);
        if (outputNode2.data.showType === "valueNode") {
          outputArray.push(outputNode, outputNode2);
        } else {
          outputArray.push(outputNode);
        }
      }

      if (
        node.value1 && node.value1.type !== "math_operation"
      ) {
        console.log("<---", node.value1);
        edgesArr.push(
          {
            id: `e${nodeId}-${parseInt(nodeId) + 1}`,
            source: nodeId,
            target: processNode(node.value1, nodeId, parentPositionY + 150).id,
            animated: true,
            style: { stroke: "#79A0EF" },
            type: "smoothstep",
          },
          {
            id: `e${parseInt(nodeId) + 1}-${parseInt(nodeId) + 2}`,
            source: `${parseInt(nodeId) + 1}`,
            target: `${parseInt(nodeId) + 2}`,
            animated: true,
            style: { stroke: "#79A0EF" },
            type: "smoothstep",
          }
        );
      }

      if (node.value1 && node.value1.right) {
        const edgeId = `e${nodeId}-${parseInt(nodeId) + 1}`;
        edgesArr.push(
          {
            id: edgeId,
            source: nodeId,
            target: processNode(node.value1, nodeId, parentPositionY + 150).id,
            animated: true,
            style: { stroke: "#79A0EF" },
            type: "smoothstep",
          },
          {
            id: `e${parseInt(nodeId) + 1}-${parseInt(nodeId) + 2}`,
            source: `${parseInt(nodeId) + 1}`,
            target: `${parseInt(nodeId) + 2}`,
            animated: true,
            style: { stroke: "#79A0EF" },
            type: "smoothstep",
          }
        );
      }

      return outputNode;
    };

    processNode(obj);
    setEdges(edgesArr);
    setNodes(outputArray);
  };

  const onDrop = async (event: DragEvent) => {
    event.preventDefault();
    if (reactFlowInstance) {
      const type = event.dataTransfer.getData("application/reactflow");
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const mousePosition = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const isInsideLength = (
        position: object,
        startX: number,
        startY: number,
        width: number,
        height: number
      ) => {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        return (
          position.x >= startX - halfWidth &&
          position.x <= startX + halfWidth &&
          position.y >= startY - halfHeight &&
          position.y <= startY + halfHeight
        );
      };

      const updateNode = (node: object, type: string) => {
        let updatedNode;
        if (type === "increaseNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "increase",
              showType: "increaseNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "decreaseNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "decrease",
              showType: "decreaseNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "valueNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "",
              showType: "valueNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "paramNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "",
              showType: "paramNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "attributeNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "false",
              showType: "attributeNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "setNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "set",
              showType: "setNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        }
        return updatedNode;
      };
      const updatedNodes = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const { id, position } = node;
        const { x, y } = position;

        if (
          !isInsideLength(
            mousePosition,
            node.position.x,
            node.position.y,
            NODE_WIDTH,
            NODE_HEIGHT
          )
        ) {
          console.log("f**k");
          updatedNodes.push(node);
        } else {
          if (
            type !== "valueNode" &&
            type !== "paramNode" &&
            type !== "attributeNode"
          ) {
            const onAddNodeId = getId();

            const onAddNodePosition = {
              x: 0,
              y: node.position.y + NODE_HEIGHT + GRID_PADDING,
            };

            const onAddNode = {
              id: onAddNodeId,
              position: onAddNodePosition,
              type: "customInputNode",
              data: {
                showType: "addNode",
                label: onAddNodePosition,
                id: onAddNodeId,
                parentNode: node.id,
              },
              draggable: false,
            };

            const edgesOnAdd = [
              {
                id: `e1-${onAddNodeId}`,
                source: node.id,
                target: onAddNodeId,
                animated: true,
                style: { stroke: "#79A0EF" },
                type: "smoothstep",
              },
            ];
            const childrenCount = edges.filter(
              (edge) => edge.source === node.id
            ).length;
            if (childrenCount < 1) {
              setEdges([...edges, ...edgesOnAdd]);
              updatedNodes.push(onAddNode);
            }
          }
          updatedNodes.push(updateNode(node, type));
          setNodes(sortNode(updatedNodes));
        }
      }
    }
  };

  const focusNode = () => {
    const positionX = [];
    const positionY = [];
    const minMax = {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    };
    for (let i = 0; i < nodes.length; i++) {
      positionX.push(nodes[i].position.x);
      positionY.push(nodes[i].position.y);
    }

    minMax.minX = Math.min(...positionX);
    minMax.maxX = Math.max(...positionX);
    minMax.minY = Math.min(...positionY);
    minMax.maxY = Math.max(...positionY);

    const x = (minMax.minX + minMax.maxX) / 2;
    const y = (minMax.minY + minMax.maxY) / 2;
    let zoom = 1;
    if (nodes.length == 2) {
      zoom = 0.9;
    }
    if (nodes.length == 3) {
      zoom = 0.8;
    }
    if (nodes.length >= 4) {
      zoom = 0.7;
    }
    if (nodes.length >= 6) {
      zoom = 0.6;
    }
    if (nodes.length >= 8) {
      zoom = 0.4;
    }
    setCenter(x, y, { zoom, duration: 1000 });
  };

  const handleEdgesChange = (changes: NodeChange[]) => {
    console.log(changes);
    changes.forEach((element) => {
      console.log("here", element);
    });
    // onEdgesChange(changes);
  };

  const handleNodesChange = (changes: NodeChange[]) => {
    changes.forEach((element) => {
      if (element.type === "remove") {
        const nodeIndex = nodes.findIndex((node) => node.id === element.id);
        console.log("-------------here", element);
        console.log("--1", element.id);
        console.log("--2", element.id);
        const cloneUpdatedNodes = [...nodes];
        console.log(cloneUpdatedNodes);
        cloneUpdatedNodes[nodeIndex] = {
          ...nodes[nodeIndex],
          data: {
            ...nodes[nodeIndex].data,
            showType: "addNode",
          },
        };
        setUpdatedNodes(cloneUpdatedNodes);
      }
      if (element.type !== "remove") {
        onNodesChange(changes);
      }
    });
    // onNodesChange(changes);
  };

  useEffect(() => {
    if (nodes.length > 1 && nodes.length < 10) {
      focusNode();
    }
  }, [nodes]);

  useEffect(() => {
    if (nodes.length > 1) {
      getDataFromNode();
    }
  }, [nodes, setNodes]);

  useEffect(() => {
    setSelectedAttribute(nodes[0].data.dataType);
  }, [nodes[0].data.dataType]);

  useEffect(() => {
    if (nodes[0].data.value && nodes.length < 2 && createFirstNode) {
      setCreateFirstNode(false);
      const onAddId = getId();
      const nodeOnAdd = {
        id: onAddId,
        position: { x: 0, y: 150 },
        type: "customInputNode",
        data: {
          showType: "addNode",
          label: { x: 0, y: 100 },
          id: onAddId,
          parentNode: 1,
        },
        draggable: false,
      };

      const edgesOnAdd = [
        {
          id: `e1-${onAddId}`,
          source: "1",
          target: onAddId,
          animated: true,
          style: { stroke: "#79A0EF" },
          type: "smoothstep",
        },
      ];

      setNodes([...nodes, nodeOnAdd]);
      setEdges([...edges, ...edgesOnAdd]);
    }
  }, [nodes[0].data.value]);

  useEffect(() => {
    saveSCHEMA_CODE(props.schemaRevision);

    const firstMetaData = props.metaFunction;
    if (
      firstMetaData.startsWith("meta.SetString") ||
      firstMetaData.startsWith("meta.SetBoolean") ||
      firstMetaData.startsWith("meta.SetNumber") ||
      firstMetaData.startsWith("meta.SetFloat")
    ) {
      console.log("it's work");
      convertObjectToNode(parser_then.parse(firstMetaData));
      setMetaData(props.metaFunction);
      console.log("metaData", metaData);
    }
  }, []);

  const getDataFromNode = () => {
    const transformData = (nodes) => {
      let result = {};

      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (
            nodes[i].id === nodes[j].data.parentNode &&
            nodes[i].data.showType === "setNode" &&
            nodes[j].data.showType === "valueNode"
          ) {
            nodes[j].data.isSet = true;
          } else if (
            nodes[i].id === nodes[j].data.parentNode &&
            (nodes[i].data.showType === "increaseNode" ||
              nodes[i].data.showType === "decreaseNode") &&
            nodes[j].data.showType === "valueNode"
          ) {
            nodes[j].data.isSet = false;
          }

          // if (nodes[j].data.dataType === "boolean" && nodes[i].data.showType !== "setNode" ){
          //   nodes[i].data.showType === "setNode"
          // }
        }

        if (nodes[i].data.showType === "valueNode") {
          nodes[i].data.dataType = nodes[0].data.dataType;
          nodes[i].data.isFetch = nodes[0].data.isFetch;
        }

        if (nodes[i].data.showType === "selectAttributeNode") {
          result.type = "meta_function";
          result.functionName =
            nodes[i].data.dataType === "float"
              ? "SetFloat"
              : nodes[i].data.dataType === "number"
              ? "SetNumber"
              : nodes[i].data.dataType === "boolean"
              ? "SetBoolean"
              : "SetString";
          result.attributeName = {
            type: "constant",
            dataType: "string",
            value: nodes[i].data.value,
          };
        } else if (
          nodes[i].data.showType === "increaseNode" ||
          nodes[i].data.showType === "decreaseNode" ||
          nodes[i].data.showType === "addNode"
        ) {
          result.value1 = {
            type:
              nodes[i].data.showType === "addNode"
                ? "addNode"
                : "math_operation",
            value:
              nodes[i].data.showType === "increaseNode"
                ? "+"
                : nodes[i].data.showType === "decreaseNode"
                ? "-"
                : "=",
            left: {
              type: "meta_function",
              functionName:
                result.functionName === "SetFloat"
                  ? "GetFloat"
                  : result.functionName === "SetNumber"
                  ? "GetNumber"
                  : result.functionName === "SetBoolean"
                  ? "GetBoolean"
                  : "GetString",
              attributeName: {
                type: "constant",
                dataType: "string",
                value: result.attributeName.value,
              },
            },
            right: {},
          };
        } else if (
          nodes[i].data.showType === "valueNode" &&
          nodes[i].data.isSet === true
        ) {
          result.value1 = {
            type: "constant",
            dataType: nodes[i].data.dataType,
            value: nodes[i].data.value,
          };
        } else if (
          nodes[i].data.showType === "valueNode" &&
          nodes[i].data.isSet === false
        ) {
          result.value1.right = {
            type: "constant",
            dataType: nodes[i].data.dataType,
            value: nodes[i].data.value,
          };
        } else if (nodes[i].data.showType === "paramNode") {
          result.value1 = {
            type: "param_function",
            functionName:
              nodes[i].data.dataType === "float"
                ? "GetFloat"
                : nodes[i].data.dataType === "number"
                ? "GetNumber"
                : nodes[i].data.dataType === "boolean"
                ? "GetBoolean"
                : "GetString",
            attributeName: {
              type: "constant",
              dataType: nodes[i].data.dataType,
              value: nodes[i].data.value,
            },
          };
        } else if (nodes[i].data.showType === "attributeNode") {
          result.value1 = {
            type: "meta_function",
            functionName:
              nodes[i].data.dataType === "float"
                ? "GetFloat"
                : nodes[i].data.dataType === "number"
                ? "GetNumber"
                : nodes[i].data.dataType === "boolean"
                ? "GetBoolean"
                : "GetString",
            attributeName: {
              type: "constant",
              dataType: nodes[i].data.dataType,
              value: nodes[i].data.value,
            },
          };
        }
      }

      console.log("----result", result);
      return result;
    };

    const object = Factory.createObject(transformData(nodes)).toString();
    setMetaData(object);
    return object;
  };

  const sortNode = (nodes) => {
    const nodeSort = nodes.sort((a, b) => {
      const idA = parseInt(a.id);
      const idB = parseInt(b.id);

      if (idA < idB) return -1;
      if (idA > idB) return 1;
      return 0;
    });

    return nodeSort;
  };

  const findSchemaCode = async () => {
    const apiUrl = `${process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO}schema/get_schema_info/${props.schemaRevision}`;
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
        setActionData(
          response.data.data.schema_info.schema_info.onchain_data.actions
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const saveAction = async () => {
    console.log("-->", (actionThenArr[actionThenIndex] = metaData));
    console.log("arr= ", actionThenArr);
    const apiUrl = `${process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO}schema/set_actions`;
    let requestData;
    if (isCreateNewAction) {
      requestData = {
        payload: {
          schema_code: props.schemaRevision,
          update_then: false,
          name: props.actionName,

          then: [...actionThenArr, metaData],
        },
      };
    } else {
      requestData = {
        payload: {
          schema_code: props.schemaRevision,
          update_then: false,
          name: props.actionName,
          then: actionThenArr,
        },
      };
    }

    await axios
      .post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
        },
      })
      .then((response) => {
        console.log(
          "API Response saveOnchainCollectionAttributes :",
          response.data
        );
        console.log("Request :", requestData);
        // You can handle the API response here
      })
      .catch((error) => {
        console.error("API Error:", error);
        // Handle errors here
      });
  };

  const removeNodeSuffix = (input) => {
    const suffixToRemove = "node";
    if (
      input.endsWith(suffixToRemove) &&
      input.length > suffixToRemove.length
    ) {
      return input.slice(0, -suffixToRemove.length);
    }
    return input;
  };

  const handleDoubleClickAddNode = useCallback(
    (type) => {
      let dropped = false;
      const updatedNodes = [];

      console.log("type===", type);
      const addNodes = nodes.filter((node) => node.data.showType === "addNode");
      addNodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      if (addNodes.length > 0) {
        const lowestNodeId = parseInt(addNodes[0].id);
        let updatedNode = addNodes.find(
          (node) => parseInt(node.id) === lowestNodeId
        );

        console.log(":: add nodes ::", addNodes);
        console.log(":: 1 ::", lowestNodeId);
        console.log("updatedNode", updatedNode);
        if (updatedNode) {
          if (
            type === "increaseNode" ||
            type === "decreaseNode" ||
            type === "setNode"
          ) {
            updatedNode = {
              ...updatedNode,
              data: {
                ...updatedNode.data,
                value: removeNodeSuffix(type.toLowerCase()),
                showType: type,
                label: { x: updatedNode.position.x, y: updatedNode.position.y },
              },
            };
          } else if (
            type === "valueNode" ||
            type === "attributeNode" ||
            type === "paramNode"
          ) {
            updatedNode = {
              ...updatedNode,
              data: {
                ...updatedNode.data,
                value: "",
                showType: type,
                dataType: "",
                label: { x: updatedNode.position.x, y: updatedNode.position.y },
                width: nodeWidthAndHeight.width_input,
                height: nodeWidthAndHeight.height_input,
              },
            };
          }

          updatedNodes.push(updatedNode);

          if (!dropped) {
            dropped = true;
            const onAddNodeId = getId();

            const onAddNodePosition = {
              x: 0,
              y: updatedNode.position.y + NODE_HEIGHT + GRID_PADDING,
            };

            if (
              type !== "paramNode" &&
              type !== "attributeNode" &&
              type !== "valueNode"
            ) {
              const onAddNode = {
                id: onAddNodeId,
                position: onAddNodePosition,
                type: "customInputNode",
                data: {
                  showType: "addNode",
                  label: onAddNodePosition,
                  id: onAddNodeId,
                  parentNode: updatedNode.id,
                },
                draggable: false,
              };

              const edgesOnAdd = [
                {
                  id: `e1-${onAddNodeId}`,
                  source: updatedNode.id,
                  target: onAddNodeId,
                  animated: true,
                  style: { stroke: "#79A0EF" },
                  type: "smoothstep",
                },
              ];
              const childrenCount = edges.filter(
                (edge) => edge.source === updatedNode.id
              ).length;
              if (childrenCount < 2) {
                setEdges([...edges, ...edgesOnAdd]);
                updatedNodes.push(onAddNode);
              }
            }

            if (
              updatedNode.id === "1" &&
              (type == "valueNode" ||
                type == "attributeNode" ||
                type == "paramNode")
            ) {
              Swal.fire(
                "First node can't be value node, attribute node, or param node"
              );
            } else {
              updatedNodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));

              const existingNodeId = new Set(
                updatedNodes.map((item) => item.id)
              );

              nodes.forEach((item) => {
                if (!existingNodeId.has(item.id)) {
                  updatedNodes.push(item);
                  existingNodeId.add(item.id);
                }
              });

              updatedNodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));
              setNodes(updatedNodes);
            }
          }
        }
      }
    },
    [nodes, setNodes]
  );

  const handleNodesLeave = () => {};

  useEffect(() => {
    const convertFromBase64 = (str) => {
      console.log("str: ", str);
      return atob(str);
    };
    if (actionData !== undefined) {
      const getDataByName = (data, name) => {
        return data.find((item) => item.name === name);
      };
      if (props.isDraft && isBase64(props.metaFunction)) {
        const result = getDataByName(actionData, props.actionName);
        console.log("result: ", actionData);
        console.log("actionName: ", props.actionName);
        setActionThenArr(result.then);
        const index = actionThenArr.indexOf(
          convertFromBase64(props.metaFunction)
        );
        console.log("--: ", index);
        setActionThenIndex(index);
      } else {
        const result = getDataByName(actionData, props.actionName);
        console.log("result: ", result);
        setActionThenArr(result.then);
        const index = actionThenArr.indexOf(props.metaFunction);
        console.log("--: ", index);
        setActionThenIndex(index);
      }

      if (props.metaFunction === "create-new-action") {
        setIsCreateNewAction(true);
      }
    }
  }, [actionData]);

  useEffect(() => {
    findSchemaCode();
  }, []);

  useEffect(() => {
    if (isGenerateGPT) {
      // console.log(`"${metaData.toString()}"`);
      convertObjectToNode(parser_then.parse(metaData.toString()));
      setIsGenerateGPT(false);
    }
  }, [isGenerateGPT]);

  return (
    <div className="flex justify-between w-full">
      <div>
        {/* <div className="w-[885px] h-16 overflow-scroll	">
          <SyntaxHighlighter
            language="go"
            wrapLongLines={true}
            codeTagProps={{
              style: {
                fontSize: "16px",
                lineHeight: "1",
              },
            }}
          >
            {metaData}
          </SyntaxHighlighter>
        </div> */}
        <div style={{ height: 536, width: "80vw" }}>
          <div ref={reactFlowWrapper} className="h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onEdgesChange={onEdgesChange}
              onNodesChange={onNodesChange}
              onConnect={onConnect}
              onInit={onInit}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeOrigin={nodeOrigin}
              nodeDragThreshold={1}
              onNodeMouseLeave={handleNodesLeave}
              fitView
            >
              <Controls position="top-left" />
              <MiniMap position="top-right"></MiniMap>
            </ReactFlow>
          </div>
        </div>
        <div className="flex gap-x-5 justify-center">
          <Link
            href={
              props.isDraft
                ? `/draft/actions/edit/then/${props.actionName}/${props.metaFunction}/${props.schemaRevision}`
                : "/newintregation/beginer"
            }
          >
            <div className="flex justify-center">Back</div>
          </Link>
          <Link
            href={
              props.isDraft
                ? `/draft/actions/${props.schemaRevision}`
                : "/newintregation/beginer"
            }
          >
            <div
              className="flex justify-center"
              onClick={async () => {
                await saveAction();
              }}
            >
              Save
            </div>
          </Link>
        </div>
        <button onClick={()=>console.log(nodes)}>logger</button>
      </div>
      <Flowbar
        selectedAttribute={selectedAttribute}
        actionName={props.actionName}
        setIsGenerateGPT={setIsGenerateGPT}
        setMetaData={setMetaData}
        metaData={metaData}
        type="attribute"
        handleDoubleClickAddNode={handleDoubleClickAddNode}
      ></Flowbar>
    </div>
  );
};

export default ThenAttributeFlow;
