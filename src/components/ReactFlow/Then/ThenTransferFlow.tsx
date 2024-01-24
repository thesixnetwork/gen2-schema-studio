import {
  useEffect,
  useMemo,
  useState,
  DragEvent,
  useRef,
  useCallback,
} from "react";
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
import Link from "next/link";
import { IActions } from "@/type/Nftmngr";
import AlertModal from "@/components/AlertModal";
import parser_then from "@/function/ConvertMetadataToObject/action_then";
import SaveButton from "@/components/button/SaveButton";
import CancelButton from "@/components/button/CancelButton";
// import {
//   getAccessTokenFromLocalStorage,
//   getActionName,
//   getSCHEMA_CODE,
//   saveSCHEMA_CODE,
// } from "@/helpers/AuthService";
import axios from "axios";
import Swal from "sweetalert2";
import ActionHeader from "@/components/ActionHeader";
import { useRouter } from "next/navigation";
import { setCookie } from "@/service/setCookie";
import { getCookie } from "@/service/getCookie";
interface ThenTransferFlowProps {
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
  width?: number;
  height?: number;
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
    parentNode: string | number | null;
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
  positionAbsolute?: {
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

let id = 2;

const getId = () => `${id++}`;

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const NODE_WIDTH = 150;
const NODE_HEIGHT = 57;
const GRID_PADDING = 60;

const nodeTypes = {
  customInputNode: InputNode,
};

const ThenTransferFlow = (props: ThenTransferFlowProps) => {
  const getCookieData = localStorage.getItem("action");
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

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [updatedNodes, setUpdatedNodes] = useState(initialNodes);
  const [metaFunction, setMetaFunction] = useState("");
  const { setCenter, project } = useReactFlow();
  // const navigate = useNavigate();
  const [isDraft, setIsDraft] = useState(false);
  const [actionThenArr, setActionThenArr] = useState([]);
  const [actionThenIndex, setActionThenIndex] = useState(null);
  const [isCreateNewAction, setIsCreateNewAction] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [isGenerateGPT, setIsGenerateGPT] = useState(false);
  const [originalMetaFunction, setOriginalMetaFunction] = useState(
    props.metaFunction
  );
  const getActionThenIndexCookie = getCookie("actionThenIndex");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const getIsCreateNewThenFromCookie = getCookie("isCreateNewThen");
  const getActionThanArrCookie = getCookie("action-then-arr");
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
          // console.log("f**k");
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
                style: { stroke: "#3980F3" },
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
          updatedNodes.push(updateNode(node as NodeProps, type));
          setNodes(sortNode(updatedNodes as NodeProps[]));
        }
      }
    }
  };

  const createToAmountNodes = () => {
    const positionLeftNode = {
      x: nodes[0].position.x - nodeWidthAndHeight.width,
      y:
        nodes[0].position.y +
        nodeWidthAndHeight.height +
        nodeWidthAndHeight.grid_padding,
    };
    const positionRightNode = {
      x: nodes[0].position.x + nodeWidthAndHeight.width,
      y:
        nodes[0].position.y +
        nodeWidthAndHeight.height +
        nodeWidthAndHeight.grid_padding,
    };
    const positionLeftBottomNode = {
      x: nodes[0].position.x - nodeWidthAndHeight.width,
      y:
        (nodes[0].position.y +
          nodeWidthAndHeight.height +
          nodeWidthAndHeight.grid_padding) *
        2,
    };
    const positionRightBottomNode = {
      x: nodes[0].position.x + nodeWidthAndHeight.width,
      y:
        (nodes[0].position.y +
          nodeWidthAndHeight.height +
          nodeWidthAndHeight.grid_padding) *
        2,
    };
    const leftId = getId();
    const rightId = getId();
    const leftBottomId = getId();
    const rightBottomId = getId();

    const leftNode = {
      id: leftId,
      position: positionLeftNode,
      type: "customInputNode",
      data: {
        showType: "toNode",
        label: positionLeftNode,
        id: leftId,
        parentNode: nodes[0].id,
        width: nodeWidthAndHeight.width,
        height: nodeWidthAndHeight.height,
      },
      draggable: false,
    };
    const rightNode = {
      id: rightId,
      position: positionRightNode,
      type: "customInputNode",
      data: {
        showType: "amountNode",
        label: positionRightNode,
        id: rightId,
        parentNode: nodes[0].id,
        width: nodeWidthAndHeight.width,
        height: nodeWidthAndHeight.height,
      },
      draggable: false,
    };
    const leftBottomNode = {
      id: leftBottomId,
      position: positionLeftBottomNode,
      type: "customInputNode",
      data: {
        showType: "addNode",
        label: positionLeftBottomNode,
        id: leftBottomId,
        parentNode: leftId,
        width: nodeWidthAndHeight.width,
        height: nodeWidthAndHeight.height,
      },
      draggable: false,
    };
    const rightBottomNode = {
      id: rightBottomId,
      position: positionRightBottomNode,
      type: "customInputNode",
      data: {
        showType: "addNode",
        label: positionRightBottomNode,
        id: rightBottomId,
        parentNode: rightId,
        width: nodeWidthAndHeight.width,
        height: nodeWidthAndHeight.height,
      },
      draggable: false,
    };

    const newEdges = [
      {
        id: `e1-${leftId}`,
        source: nodes[0].id,
        target: leftId,
        animated: true,
        style: { stroke: "#3980F3" },
        type: "smoothstep",
      },
      {
        id: `e1-${rightId}`,
        source: nodes[0].id,
        target: rightId,
        animated: true,
        style: { stroke: "#3980F3" },
        type: "smoothstep",
      },
      {
        id: `e${leftId}-${leftBottomId}`,
        source: leftId,
        target: leftBottomId,
        animated: true,
        style: { stroke: "#3980F3" },
        type: "smoothstep",
      },
      {
        id: `e${rightId}-${rightBottomId}`,
        source: rightId,
        target: rightBottomId,
        animated: true,
        style: { stroke: "#3980F3" },
        type: "smoothstep",
      },
    ];

    setEdges([...edges, ...newEdges]);
    updatedNodes.push(leftNode, rightNode, leftBottomNode, rightBottomNode);
    setNodes(updatedNodes);
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
    const zoom = 1;
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
        } else if (element.id === "2") {
          setModalErrorMessage("You can't delete amount node.");
          setIsOpen(true);
        } else if (element.id === "3") {
          setModalErrorMessage("You can't delete to node.");
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
          setNodes(cloneUpdatedNodes);
        }
      }
      if (element.type !== "remove") {
        onNodesChange(changes);
      }
    });
    // onNodesChange(changes);
  };

  const getDataFromNode = () => {
    const transformData = (nodes: NodeProps[]) => {
      let result: any = {};

      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].data.showType === "valueNode") {
          nodes[i].data.dataType = nodes[0].data.dataType;
          // console.log("1", nodes[i].data.dataType);
        }

        if (nodes[i].data.showType === "paramNode") {
          // console.log("1", nodes[i].data.dataType);
        }

        if (nodes[i].data.showType === "selectAttributeNode") {
          result.type = "meta_function";
          result.functionName = "TransferNumber";
          result.attributeName = {
            type: "constant",
            dataType: "string",
            value: nodes[i].data.value,
          };
        } else if (
          nodes[i].data.showType === "valueNode" ||
          nodes[i].data.showType === "attributeNode"
        ) {
          {
            nodes[i].id === "4"
              ? (result.value1 = {
                  type: "meta_function",
                  functionName: "GetString",
                  attributeName: {
                    type: "constant",
                    dataType: "string",
                    value: nodes[i].data.value,
                  },
                })
              : nodes[i].data.showType === "valueNode"
              ? (result.value2 = {
                  type: "constant",
                  dataType: "number",
                  value: nodes[i].data.value,
                })
              : (result.value2 = {
                  type: "meta_function",
                  functionName: "GetNumber",
                  attributeName: {
                    type: "constant",
                    dataType: "string",
                    value: nodes[i].data.value,
                  },
                });
          }
        } else if (nodes[i].data.showType === "paramNode") {
          {
            nodes[i].id === "4"
              ? (result.value1 = {
                  type: "param_function",
                  functionName: "GetString",
                  attributeName: {
                    type: "constant",
                    dataType: "string",
                    value: nodes[i].data.value,
                  },
                })
              : (result.value2 = {
                  type: "param_function",
                  functionName: "GetNumber",
                  attributeName: {
                    type: "constant",
                    dataType: "string",
                    value: nodes[i].data.value,
                  },
                });
          }
        }
      }

      return result;
    };

    const object = Factory.createObject(
      transformData(nodes as NodeProps[])
    ).toString();
    // console.log(">", object);
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
        if (action.name === name && getIsCreateNewThenFromCookie === "false") {
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
          typeof metaFunction === "string" ? metaFunction : JSON.stringify(metaFunction);

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

  const convertObjectToNode = (outputObj: any) => {
    setIsDraft(true);
    const tempNodeArray: NodeProps[] = [];
    const tempEdgeArray: any[] = [];
    const processNode = (node: any, parentNode = null, parentPositionY = 0) => {
      const nodeId = tempNodeArray.length + 1;

      const newNode = {
        id: nodeId.toString(),
        type: "customInputNode",
        position: { x: 0, y: parentPositionY },
        draggable: false,
        data: {
          showType: "",
          id: nodeId.toString(),
          parentNode: parentNode,
          label: { x: 0, y: parentPositionY },
          value: "",
          dataType: "",
        },
        positionAbsolute: { x: 0, y: parentPositionY },
      };

      tempNodeArray.push(newNode as NodeProps);

      if (node.attributeName) {
        newNode.data.showType = "selectAttributeNode";
        newNode.data.value = node.attributeName.value;
        newNode.data.dataType = node.attributeName.dataType;
      }

      if (node.value1) {
        const toNode = {
          id: (nodeId + 1).toString(),
          type: "customInputNode",
          position: { x: -150, y: parentPositionY + 150 },
          draggable: false,
          data: {
            showType: "toNode",
            id: (nodeId + 1).toString(),
            parentNode: nodeId.toString(),
            label: { x: 0, y: parentPositionY + 150 },
            value: "toNode",
            dataType: "toNode",
          },
        };

        if (node.value1.type === "param_function") {
          const paramNode = {
            id: (nodeId + 3).toString(),
            type: "customInputNode",
            position: { x: -150, y: parentPositionY + 300 },
            draggable: false,
            data: {
              showType: "paramNode",
              id: (nodeId + 3).toString(),
              parentNode: (nodeId + 1).toString(),
              label: { x: -150, y: parentPositionY + 300 },
              value: node.value1.attributeName.value,
              dataType: node.value1.attributeName.dataType,
            },
          };
          tempNodeArray.push(toNode as NodeProps, paramNode as NodeProps);
        } else {
          const attributeNode = {
            id: (nodeId + 3).toString(),
            type: "customInputNode",
            position: { x: -150, y: parentPositionY + 300 },
            draggable: false,
            data: {
              showType: "attributeNode",
              id: (nodeId + 3).toString(),
              parentNode: (nodeId + 1).toString(),
              label: { x: -150, y: parentPositionY + 300 },
              value: node.value1.attributeName.value,
              dataType: node.value1.attributeName.dataType,
            },
          };
          tempNodeArray.push(toNode as NodeProps, attributeNode as NodeProps);
        }

        const edge = {
          id: `e${nodeId}-${nodeId + 1}`,
          source: nodeId.toString(),
          target: (nodeId + 1).toString(),
          animated: true,
          style: { stroke: "#3980F3" },
          type: "smoothstep",
        };
        const edge2 = {
          id: `e${nodeId + 1}-${nodeId + 3}`,
          source: (nodeId + 1).toString(),
          target: (nodeId + 3).toString(),
          animated: true,
          style: { stroke: "#3980F3" },
          type: "smoothstep",
        };

        tempEdgeArray.push(edge, edge2);
      }

      if (node.value2) {
        const amountNode = {
          id: (nodeId + 2).toString(),
          type: "customInputNode",
          position: { x: 150, y: parentPositionY + 150 },
          draggable: false,
          data: {
            showType: "amountNode",
            id: (nodeId + 2).toString(),
            parentNode: nodeId.toString(),
            label: { x: 0, y: parentPositionY + 150 },
            value: node.attributeName.value,
            dataType: node.attributeName.dataType,
          },
        };

        if (node.value2.type === "meta_function") {
          const attributeNode = {
            id: (nodeId + 4).toString(),
            type: "customInputNode",
            position: { x: 150, y: parentPositionY + 300 },
            draggable: false,
            data: {
              showType: "attributeNode",
              id: (nodeId + 4).toString(),
              parentNode: (nodeId + 3).toString(),
              label: { x: 150, y: parentPositionY + 300 },
              value: node.value2.attributeName.value,
              dataType: node.value2.attributeName.dataType,
            },
          };
          tempNodeArray.push(amountNode, attributeNode);
        } else {
          const valueNode = {
            id: (nodeId + 4).toString(),
            type: "customInputNode",
            position: { x: 150, y: parentPositionY + 300 },
            draggable: false,
            data: {
              showType: "valueNode",
              id: (nodeId + 4).toString(),
              parentNode: (nodeId + 3).toString(),
              label: { x: 150, y: parentPositionY + 300 },
              value: node.value2.value,
              dataType: node.value2.dataType,
            },
          };
          tempNodeArray.push(amountNode, valueNode);
        }

        const edge = {
          id: `e${nodeId}-${nodeId + 2}`,
          source: nodeId.toString(),
          target: (nodeId + 2).toString(),
          animated: true,
          style: { stroke: "#3980F3" },
          type: "smoothstep",
        };
        const edge2 = {
          id: `e${nodeId + 2}-${nodeId + 4}`,
          source: (nodeId + 2).toString(),
          target: (nodeId + 4).toString(),
          animated: true,
          style: { stroke: "#3980F3" },
          type: "smoothstep",
        };

        tempEdgeArray.push(edge, edge2);
      }
      return nodeId;
    };

    processNode(outputObj);
    setNodes(tempNodeArray);
    setEdges(tempEdgeArray);
    return tempNodeArray;
  };

  const handleDoubleClickAddNode = useCallback(
    (type: string) => {
      const updatedNodes = [];

      const addNodes = nodes.filter((node) => node.data.showType === "addNode");
      addNodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      if (addNodes.length > 0) {
        const lowestNodeId = parseInt(addNodes[0].id);
        let updatedNode = addNodes.find(
          (node) => parseInt(node.id) === lowestNodeId
        );

        // console.log(":: add nodes ::", addNodes);
        // console.log(":: 1 ::", lowestNodeId);
        // console.log("updatedNode", updatedNode);
        if (updatedNode) {
          if (
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
    // saveSCHEMA_CODE(props.schemaRevision);
    const firstMetaFunction = props.metaFunction;
    // console.log("firstMetaData", firstMetaFunction);
    if (firstMetaFunction.startsWith("meta.TransferNumber")) {
      // console.log("it's work");
      convertObjectToNode(parser_then.parse(firstMetaFunction));
      setMetaFunction(props.metaFunction);
    }
  }, []);

  useEffect(() => {
    if (nodes[0].data.value && nodes.length < 2 && !isDraft) {
      createToAmountNodes();
      setSelectedAttribute("none");
    }
  }, [nodes[0].data.value]);

  useEffect(() => {
    if (isGenerateGPT) {
      // console.log(`"${metaFunction.toString()}"`);
      convertObjectToNode(parser_then.parse(metaFunction.toString()));
      setSelectedAttribute("none");
      setIsGenerateGPT(false);
    }
  }, [isGenerateGPT]);

  return (
    <div className="flex justify-between px-8 h-full" id="then2">
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
        <div className="h-full  w-full border rounded-3xl bg-white p-2 mt-4">
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
              fitView
              nodeOrigin={nodeOrigin}
            >
              <Controls position="top-left" />
              <MiniMap position="top-right"></MiniMap>
            </ReactFlow>
          </div>
        </div>

        <div className="flex justify-end gap-x-8 mt-4">
          <Link
            href={
              isCreateNewActionCookie === "true"
                ? `/newdraft/6/${schemacode}/action-form/create-new-action`
                : `/newdraft/6/${schemacode}/action-form/${props.actionName}`
            }
            onClick={() => setCookie("isEditAction", "true")}
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
        type="transfer"
        handleDoubleClickAddNode={handleDoubleClickAddNode}
      ></Flowbar>
    </div>
  );
};

export default ThenTransferFlow;
