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
import { IActions } from "@/type/Nftmngr";
import parser_then from "@/function/ConvertMetadataToObject/action_then";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionHeader from "@/components/ActionHeader";
import SaveButton from "@/components/button/SaveButton";
import CancelButton from "@/components/button/CancelButton";
import { setCookie } from "@/service/setCookie";
import { getCookie } from "@/service/getCookie";
import AlertModal from "@/components/AlertModal";
interface ThenAttributeFlowProps {
  metaFunction: string;
  actionName: string;
  schemaRevision: string;
  isDraft: boolean;
  transformType: string;
  actionThenType: string;
  setMetaFunction: React.Dispatch<React.SetStateAction<string>>;
  handleActionThenTypeChange: (newActionThenType: string) => void;
  handleTransformTypeChange: (newActionThenType: string) => void;
}

interface NodeProps {
  width?: number | null | undefined;
  height?: number | null | undefined;
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  draggable: boolean;
  data: {
    showType: string;
    id: string;
    parentNode: string | number;
    label: {
      x: number;
      y: number;
    };
    value: string | number | boolean;
    dataType: string;
    isFetch?: boolean;
    isSet?: boolean;
    width?: number;
    height?: number;
  };

  selected?: boolean;
  positionAbsolute: {
    x: number;
    y: number;
  };
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

const mockNode: Node[] = [
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

const nodeTypes = {
  customInputNode: InputNode,
};

const ThenAttributeFlow = (props: ThenAttributeFlowProps) => {
  const router = useRouter();
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const reactFlowWrapper = useRef<any | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const nodeTypes = useMemo(() => {
  //   return {
  //     customInputNode: InputNode,
  //   };
  // }, []);

  // const nodeTypes = {
  //   myCustomNode: InputNode,
  // };
  const [originalMetaFunction, setOriginalMetaFunction] = useState(
    props.metaFunction
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [metaFunction, setMetaFunction] = useState("");
  const { setCenter, project } = useReactFlow();
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [createFirstNode, setCreateFirstNode] = useState(true);
  const [isGenerateGPT, setIsGenerateGPT] = useState(false);
  const getCookieData = localStorage.getItem("action");
  const getActionThenIndexCookie = getCookie("actionThenIndex");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const getActionThanArrCookie = getCookie("action-then-arr");
  const getIsCreateNewThenFromCookie = getCookie("isCreateNewThen");
  const schemacode = getCookie("schemaCode");
  const [isOpen, setIsOpen] = useState(false);
  const [errorModalMessage, setModalErrorMessage] = useState("");
  const nodeWidthAndHeight = {
    width: 150,
    height: 57,
    width_input: 151.2,
    height_input: 35.2,
    grid_padding: 60,
  };

  const onConnect = (params: Connection | Edge) =>
    setEdges((eds) => addEdge(params, eds));
  const onInit = (rfi: ReactFlowInstance) => setReactFlowInstance(rfi);

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const convertObjectToNode = (obj: any) => {
    let nodeIdCounter = 1;
    const outputArray: any[] = [];
    const edgesArr: any[] = [];

    const processNode = (
      node: any,
      parentNodeId: string | null,
      parentPositionY = 0
    ) => {
      const nodeId = `${nodeIdCounter++}`;
      const outputNode = {
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
        id: `${parseInt(nodeId) + 1}`,
        type: "customInputNode",
        position: { x: 0, y: parentPositionY + 150 },
        draggable: false,
        data: {
          showType: "",
          id: `${parseInt(nodeId) + 1}`,
          parentNode: `${parseInt(parentNodeId ?? "0") + 1}`,
          label: { x: 0, y: parentPositionY + 150 },
          value: "",
          dataType: "",
          isFetch: true,
        },
      };


      if (
        node.type === "meta_function" &&
        (node.functionName === "SetNumber" ||
          node.functionName === "SetString" ||
          node.functionName === "SetBoolean" ||
          node.functionName === "SetFloat")
      ) {
        outputNode.data.showType = "selectAttributeNode";
        outputNode.data.value = node.attributeName.value;
        if (node.functionName === "SetNumber") {
          outputNode.data.dataType = "number";
        } else if (node.functionName === "SetString") {
          outputNode.data.dataType = "string";
        } else if (node.functionName === "SetBoolean") {
          outputNode.data.dataType = "boolean";
        } else if (node.functionName === "SetFloat") {
          outputNode.data.dataType = "float";
        }
        setSelectedAttribute(node.attributeName.dataType);
      } else if (
        node.type === "constant" &&
        (node.value ||
          (node.dataType === "bool" && node.type === "constant")) &&
        !node.left
      ) {
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
        if (outputNode2.data.showType === "valueNode") {
          outputArray.push(outputNode, outputNode2);
        } else {
          outputArray.push(outputNode);
        }
      }

      if (node.value1 && node.value1.type !== "math_operation") {
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

    processNode(obj, null, 0);
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
        position: {
          x: number;
          y: number;
        },
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

      const updateNode = (node: NodeProps, type: string) => {
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
      const updatedNodes: any[] = [];
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
          updatedNodes.push(node as NodeProps);
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
                value: "",
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
              updatedNodes.push(onAddNode as NodeProps);
            }
          }
          updatedNodes.push(updateNode(node as NodeProps, type));

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

  const handleNodesChange = (changes: NodeChange[]) => {
    changes.forEach((element) => {
      if (element.type === "remove") {
        const nodeIndex = nodes.findIndex((node) => node.id === element.id);
        if (element.id === "1") {
          setModalErrorMessage(
            "You can't delete the first node(Select your attribute)."
          );
          setIsOpen(true);
        } else {
          const cloneUpdatedNodes = [...nodes];
          // console.log(cloneUpdatedNodes);
          cloneUpdatedNodes[nodeIndex] = {
            ...nodes[nodeIndex],
            data: {
              ...nodes[nodeIndex].data,
              showType: "addNode",
            },
          };
          // console.log("this 3");
          setNodes(cloneUpdatedNodes);
        }
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
  }, [nodes]);

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
  }, [createFirstNode, edges, nodes, setEdges, setNodes]);

  useEffect(() => {
    const firstMetaFunction = props.metaFunction;
    if (
      firstMetaFunction.startsWith("meta.SetString") ||
      firstMetaFunction.startsWith("meta.SetBoolean") ||
      firstMetaFunction.startsWith("meta.SetNumber") ||
      firstMetaFunction.startsWith("meta.SetFloat")
    ) {
      convertObjectToNode(parser_then.parse(firstMetaFunction));
      setMetaFunction(props.metaFunction);
    }
  }, []);

  const getDataFromNode = () => {
    const transformData = (nodes: NodeProps[]) => {
      let result: any = {};

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
          if (nodes[i].data.dataType === "float") {
            result.value1 = {
              type: "constant",
              dataType: nodes[i].data.dataType,
              value: nodes[i].data.value.toString().includes(".")
                ? nodes[i].data.value
                : nodes[i].data.value + ".0",
            };
          } else {
            result.value1 = {
              type: "constant",
              dataType: nodes[i].data.dataType,
              value: nodes[i].data.value,
            };
          }
        } else if (
          nodes[i].data.showType === "valueNode" &&
          nodes[i].data.isSet === false
        ) {
          if (nodes[i].data.dataType === "float") {
            result.value1.right = {
              type: "constant",
              dataType: nodes[i].data.dataType,
              value: nodes[i].data.value.toString().includes(".")
                ? nodes[i].data.value
                : nodes[i].data.value + ".0",
            };
          } else {
            result.value1.right = {
              type: "constant",
              dataType: nodes[i].data.dataType,
              value: nodes[i].data.value,
            };
          }
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

      return result;
    };

    const object = Factory.createObject(
      transformData(nodes as NodeProps[])
    ).toString();

    setMetaFunction(object);
    props.setMetaFunction(object);
    return object;
  };

  const sortNode = (nodes: NodeProps[]) => {
    const nodeSort = nodes.sort((a, b) => {
      const idA = parseInt(a.id);
      const idB = parseInt(b.id);

      if (idA < idB) return -1;
      if (idA > idB) return 1;
      return 0;
    });

    return nodeSort;
  };

  const saveAction = async () => {
    let tempArr;

    const convertStringToArray = (input: string) => {
      const jsonArray = JSON.parse(input);

      const resultArray = jsonArray.map((item: string) => {
        return item;
      });

      return resultArray;
    };

    const updateActionThenByName = (
      array: IActions[],
      name: string,
      oldThen: string,
      newThen: string
    ) => {
      const updatedArray = array.map((action) => {
        if (action.name === name && getIsCreateNewThenFromCookie !== "true") {
          let updatedThen;
          if (getActionThenIndexCookie) {
            updatedThen = action.then.map((item, index) =>
              index === parseInt(getActionThenIndexCookie) ? newThen : item
            );
          }

          return { ...action, then: updatedThen };
        } else if (
          action.name === name &&
          getIsCreateNewThenFromCookie === "true"
        ) {
          const updatedThen = [...action.then, newThen];
          return { ...action, then: updatedThen };
        }
        return action;
      });

      tempArr = updatedArray;
    };

    if (metaFunction.startsWith("meta")) {
      if (getCookieData) {
        const parsedCookieData = JSON.parse(decodeURIComponent(getCookieData));
        updateActionThenByName(
          parsedCookieData,
          props.actionName,
          originalMetaFunction,
          metaFunction
        );
      }

      if (isCreateNewActionCookie) {
        const tempArrCookie = getActionThanArrCookie
          ? convertStringToArray(decodeURIComponent(getActionThanArrCookie))
          : [];

        const metaFunctionToAdd =
          typeof metaFunction === "string"
            ? metaFunction
            : JSON.stringify(metaFunction);

        let updatedTempArrCookie;
        if (getActionThenIndexCookie) {
          updatedTempArrCookie = tempArrCookie.map(
            (item: string, index: number) =>
              index === parseInt(getActionThenIndexCookie)
                ? metaFunctionToAdd
                : item
          );
        }

        if (getIsCreateNewThenFromCookie === "true") {
          if (!tempArrCookie.includes(originalMetaFunction)) {
            updatedTempArrCookie = tempArrCookie;
            updatedTempArrCookie.push(metaFunctionToAdd);
          }
        }

        setCookie("action-then-arr", JSON.stringify(updatedTempArrCookie));
      }


      localStorage.setItem("action", JSON.stringify(tempArr));
      setCookie("action-then", metaFunction);
      setCookie("isEditAction", "true");
      router.push(
        isCreateNewActionCookie === "true"
          ? `/newdraft/6/${schemacode}/action-form/create-new-action`
          : `/newdraft/6/${schemacode}/action-form/${props.actionName}`
      );
    } else {
      setModalErrorMessage("Please create your then");
      setIsOpen(true);
    }
  };

  const removeNodeSuffix = (input: string) => {
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
    (type: string) => {
      let dropped = false;
      const updatedNodes = [];

      const addNodes = nodes.filter((node) => node.data.showType === "addNode");
      addNodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      if (addNodes.length > 0) {
        const lowestNodeId = parseInt(addNodes[0].id);
        let updatedNode = addNodes.find(
          (node) => parseInt(node.id) === lowestNodeId
        );
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
                (edge) => edge.source === updatedNode?.id
              ).length;
              if (childrenCount < 2) {
                setEdges([...edges, ...edgesOnAdd]);
                updatedNodes.push(onAddNode);
              }
            }

            updatedNodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));

            const existingNodeId = new Set(updatedNodes.map((item) => item.id));

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
    },
    [nodes, setNodes]
  );

  const handleNodesLeave = () => {};

  useEffect(() => {
    if (isGenerateGPT) {
      convertObjectToNode(parser_then.parse(metaFunction.toString()));
      setIsGenerateGPT(false);
    }
  }, [isGenerateGPT]);

  useEffect(() => {
  }, [metaFunction, props.metaFunction]);

  useEffect(() => {

    return () => {
      setNodes(mockNode);
    };
  }, []);

  return (
    <div className="flex justify-between px-8 h-full" id="then">
      {isOpen && (
        <AlertModal
          title={errorModalMessage}
          type="error"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      <div className="flex flex-col w-[64vw] mr-12 h-full">
        <ActionHeader
          type="then"
          actionName={props.actionName}
          metaFunction={props.metaFunction}
          transformType={props.transformType}
          actionThenType={props.actionThenType}
          handleActionThenTypeChange={props.handleActionThenTypeChange}
          handleTransformTypeChange={props.handleTransformTypeChange}
        />
        <div className="h-full w-full border rounded-3xl bg-white p-2 mt-4">
          <div ref={reactFlowWrapper} className="h-full">
            <ReactFlow
              zoomOnDoubleClick={false}
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={handleNodesChange}
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
        <div className="flex justify-end gap-x-8 mt-4">
          <Link
            onClick={() => setCookie("isEditAction", "true")}
            href={
              isCreateNewActionCookie === "true"
                ? `/newdraft/6/${schemacode}/action-form/create-new-action`
                : `/newdraft/6/${schemacode}/action-form/${props.actionName}`
            }
          >
            <CancelButton />
          </Link>
          <button
            onClick={async () => {
              await saveAction();
            }}
          >
            <SaveButton />
          </button>
        </div>
      </div>
      <Flowbar
        selectedAttribute={selectedAttribute}
        actionName={props.actionName}
        setIsGenerateGPT={setIsGenerateGPT}
        setMetaData={setMetaFunction}
        metaData={metaFunction}
        type="attribute"
        handleDoubleClickAddNode={handleDoubleClickAddNode}
      ></Flowbar>
    </div>
  );
};

export default ThenAttributeFlow;
