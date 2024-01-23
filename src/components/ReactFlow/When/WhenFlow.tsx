"use client";

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
} from "reactflow";
import "reactflow/dist/base.css";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import ActionHeader from "@/components/ActionHeader";
import {
  saveSCHEMA_CODE
} from "@/helpers/AuthService";
import _ from "lodash";

import { IActions } from "@/type/Nftmngr";
import AlertModal from "@/components/AlertModal";
import InputNode from "./CustomNode/InputNode";

import SaveButton from "@/components/button/SaveButton";
import CancelButton from "@/components/button/CancelButton";
import Flowbar from "./Flowbar";
import { Factory } from "@/function/ConvertObjectToMetadata/Factory";
import parser_when from "@/function/ConvertMetadataToObject/action_when";
import {
  Tree,
  adjustParents,
  adjustTreePosition,
  drawTree,
  generateTreeFromReactFlow,
} from "@/function/auto-layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "@/service/setCookie";
import { getCookie } from "@/service/getCookie";
interface NodeProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  draggable: boolean;
  showType?: string;
  dataType?: string;
  value?: string | number | boolean;
  dataTypeFromValue?: string;
  parentNode?: number | string;
  data: {
    id: string;
    showType: string;
    value: string;
    dataType: string;
    label: { x: number; y: number };
  };
}

interface WhenFlowProps {
  metaFunction: string;
  setMetaFunction: React.Dispatch<React.SetStateAction<string>>;
  actionName: string;
  schemaCode: string;
  isDraft: boolean;
}

const nodeWidthAndHeight = {
  width: 40,
  height: 40,
  width_value: 102,
  height_value: 40,
  width_attribute: 154,
  height_attribute: 40,
  width_param: 147,
  height_param: 40,
  width_input: 151.2,
  height_input: 35.2,
  grid_padding: 60,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "customInputNode",
    position: { x: 0, y: 0 },
    draggable: false,
    data: {
      showType: "addNode",
      id: "1",
      parentNode: "root",
      label: { x: 0, y: 0 },
      width: nodeWidthAndHeight.width,
      height: nodeWidthAndHeight.height,
    },
  },
];

const WhenFlow = (props: WhenFlowProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [errorModalMessage, setModalErrorMessage] = useState(
    "Something went wrong"
  );
  const [metaData, setMetaData] = useState("");
  const [updatedNodes, setUpdatedNodes] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [isGenerateGPT, setIsGenerateGPT] = useState(false);
  const getCookieData = localStorage.getItem("action");
  const schemacode = getCookie("schemaCode");
  const isCreateNewActionCookie = getCookie("isCreateNewAction");
  const nodeTypes = useMemo(() => {
    return {
      customInputNode: InputNode,
      textUpdate: InputNode,
    };
  }, []);
  const { setCenter } = useReactFlow();
  //   const navigate = useNavigate();

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const [redraw, setRedraw] = useState(false);

  const reactFlowWrapper = useRef<any | null>(null);

  const findLastedId = () => {
    let max = 0;
    for (let i = 0; i < nodes.length; i++) {
      if (parseInt(nodes[i].id) > max) {
        max = parseInt(nodes[i].id);
      }
    }
    return max;
  };

  let id = findLastedId() + 1;
  const getId = useCallback(() => `${id++}`,[id]);

  const onConnect = (params: Connection | Edge) =>
    setEdges((eds) => addEdge(params, eds));
  const onInit = (rfi: ReactFlowInstance) => setReactFlowInstance(rfi);

  const convertObject = useCallback((obj: any) => {
    const outputArray: any = [];
    const edgesArr: any = [];
    let nodeIdCounter = 1;
    const processNode = (
      node: any,
      parentNodeId: null | string = null,
      parentPositionY = 0
    ) => {
      console.log(">..", node);
      const nodeId = `${nodeIdCounter++}`;
      console.log("---node>", node);
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
          width: 150,
          height: 57,
          value: "",
          dataType: "",
          isFetch: true,
        },
      };

      if (node.type === "condition_oper" && node.value === "AND") {
        outputNode.data.showType = "andNode";
        outputNode.data.value = "and";
      } else if (node.type === "condition_oper" && node.value === "OR") {
        outputNode.data.showType = "orNode";
        outputNode.data.value = "or";
      } else if (
        (node.type === "string_compare_oper" ||
          node.type === "boolean_compare_oper" ||
          node.type === "number_compare_oper" ||
          node.type === "float_compare_oper") &&
        node.value === "=="
      ) {
        outputNode.data.showType = "equalNode";
        outputNode.data.value = "equal";
      } else if (
        (node.type === "string_compare_oper" ||
          node.type === "boolean_compare_oper" ||
          node.type === "number_compare_oper" ||
          node.type === "float_compare_oper") &&
        node.value === "!="
      ) {
        outputNode.data.showType = "notEqualNode";
        outputNode.data.value = "notequal";
      } else if (
        (node.type === "string_compare_oper" ||
          node.type === "boolean_compare_oper" ||
          node.type === "number_compare_oper" ||
          node.type === "float_compare_oper") &&
        node.value === ">"
      ) {
        outputNode.data.showType = "moreThanNode";
        outputNode.data.value = "morethan";
      } else if (
        (node.type === "string_compare_oper" ||
          node.type === "boolean_compare_oper" ||
          node.type === "number_compare_oper" ||
          node.type === "float_compare_oper") &&
        node.value === ">="
      ) {
        outputNode.data.showType = "moreThanAndEqualNode";
        outputNode.data.value = "morethanandequal";
      } else if (
        (node.type === "string_compare_oper" ||
          node.type === "boolean_compare_oper" ||
          node.type === "number_compare_oper" ||
          node.type === "float_compare_oper") &&
        node.value === "<"
      ) {
        outputNode.data.showType = "lessThanNode";
        outputNode.data.value = "lessthan";
      } else if (
        (node.type === "string_compare_oper" ||
          node.type === "boolean_compare_oper" ||
          node.type === "number_compare_oper" ||
          node.type === "float_compare_oper") &&
        node.value === "<="
      ) {
        outputNode.data.showType = "lessThanAndEqualNode";
        outputNode.data.value = "lessthanandequal";
      } else if (
        node.type === "meta_function" &&
        node.attributeName.type === "param_function"
      ) {
        outputNode.data.showType = "paramNode";
        outputNode.data.dataType = node.attributeName.attributeName.dataType;
        outputNode.data.value = node.attributeName.attributeName.value;
      } else if (node.type === "meta_function") {
        outputNode.data.showType = "attributeNode";
        outputNode.data.value = node.attributeName.value;
        if (node.functionName === "GetString") {
          outputNode.data.dataType = "string";
        } else if (node.functionName === "GetNumber") {
          outputNode.data.dataType = "number";
        } else if (node.functionName === "GetBoolean") {
          outputNode.data.dataType = "boolean";
        } else if (node.functionName === "GetFloat") {
          outputNode.data.dataType = "float";
        }
      } else if (node.type === "constant") {
        outputNode.data.showType = "valueNode";
        outputNode.data.value = node.value;
      }

      console.log("here ja", outputNode);

      outputArray.push(outputNode);

      if (node.left) {
        const edgeId = `e${nodeId}-${node.left.type}`;
        edgesArr.push({
          id: edgeId,
          source: nodeId,
          target: processNode(node.left, nodeId, parentPositionY + 150).id,
          animated: true,
          style: { stroke: "#79A0EF" },
          type: "smoothstep",
        });
      }

      if (node.right) {
        const edgeId = `e${nodeId}-${node.right.type}`;
        edgesArr.push({
          id: edgeId,
          source: nodeId,
          target: processNode(node.right, nodeId, parentPositionY + 150).id,
          animated: true,
          style: { stroke: "#79A0EF" },
          type: "smoothstep",
        });
      }

      return outputNode;
    };

    processNode(obj);
    setNodes(outputArray);
    setEdges(edgesArr);
  },[setEdges, setNodes]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  };  

  const onDrop = async (event:  React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (reactFlowInstance) {
      const type = event.dataTransfer?.getData("application/reactflow");
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const mousePosition = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const isInsideLength = (
        position: any,
        startX: number,
        startY: number,
        width: number,
        height: number
      ) => {
        // const halfWidth = width / 2;
        // const halfHeight = height / 2;

        // return (
        //   position.x >= startX - halfWidth &&
        //   position.x <= startX + halfWidth &&
        //   position.y >= startY - halfHeight &&
        //   position.y <= startY + halfHeight
        // );

        return (
          position.x >= startX &&
          position.x <= startX + width &&
          position.y >= startY &&
          position.y <= startY + height
        );
      };

      const updateNode = (node: any, type: string) => {
        let updatedNode;
        if (type === "orNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "or",
              showType: "orNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "andNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "and",
              showType: "andNode",
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
              dataType: "",
              label: { x: node.position.x, y: node.position.y },
              width: nodeWidthAndHeight.width_value,
              height: nodeWidthAndHeight.height_value,
            },
          };
        } else if (type === "attributeNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              dataType: "",
              value: "",
              showType: "attributeNode",
              label: { x: node.position.x, y: node.position.y },
              width: nodeWidthAndHeight.width_attribute,
              height: nodeWidthAndHeight.height_attribute,
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
              width: nodeWidthAndHeight.width_param,
              height: nodeWidthAndHeight.height_param,
              dataTypeFromValue: "",
            },
          };
        } else if (type === "equalNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "equal",
              dataType: "",
              showType: "equalNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "notEqualNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "notequal",
              dataType: "",
              showType: "notEqualNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "moreThanNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "morethan",
              dataType: "",
              showType: "moreThanNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "moreThanAndEqualNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "morethanandequal",
              dataType: "",
              showType: "moreThanAndEqualNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "lessThanNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "lessthan",
              dataType: "",
              showType: "lessThanNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        } else if (type === "lessThanAndEqualNode") {
          updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: "lessthanandequal",
              dataType: "",
              showType: "lessThanAndEqualNode",
              label: { x: node.position.x, y: node.position.y },
            },
          };
        }

        return updatedNode;
      };

      const updatedNodes = [];
      let dropped = false;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (
          !isInsideLength(
            mousePosition,
            node.position.x,
            node.position.y,
            node.data.width,
            node.data.height
          )
        ) {
          console.log(type);
          console.log("f**k");
          updatedNodes.push(node);
        } else {
          if (!dropped) {
            dropped = true;
            if (
              type !== "paramNode" &&
              type !== "attributeNode" &&
              type !== "valueNode"
            ) {
              const positionLeftNode = {
                x: node.position.x + nodeWidthAndHeight.width,
                y:
                  node.position.y +
                  nodeWidthAndHeight.height +
                  nodeWidthAndHeight.grid_padding,
              };
              const positionRightNode = {
                x: node.position.x - nodeWidthAndHeight.width,
                y:
                  node.position.y +
                  nodeWidthAndHeight.height +
                  nodeWidthAndHeight.grid_padding,
              };
              const leftId = getId();
              const rightId = getId();

              const leftNode = {
                id: leftId,
                position: positionLeftNode,
                type: "customInputNode",
                data: {
                  showType: "addNode",
                  label: positionLeftNode,
                  id: leftId,
                  parentNode: node.id,
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
                  showType: "addNode",
                  label: positionRightNode,
                  id: rightId,
                  parentNode: node.id,
                  width: nodeWidthAndHeight.width,
                  height: nodeWidthAndHeight.height,
                },
                draggable: false,
              };

              const newEdges = [
                {
                  id: `e1-${rightId}`,
                  source: node.id,
                  target: rightId,
                  animated: true,
                  style: { stroke: "#79A0EF" },
                  type: "smoothstep",
                },
                {
                  id: `e1-${leftId}`,
                  source: node.id,
                  target: leftId,
                  animated: true,
                  style: { stroke: "#79A0EF" },
                  type: "smoothstep",
                },
              ];
              const childrenCount = edges.filter(
                (edge) => edge.source === node.id
              ).length;
              if (childrenCount < 2) {
                setEdges([...edges, ...newEdges]);
                updatedNodes.push(leftNode);
                updatedNodes.push(rightNode);
              }
            }
            console.log(">>", type);
            if (
              node.id === "1" &&
              (type == "valueNode" ||
                type == "attributeNode" ||
                type == "paramNode")
            ) {
              setModalErrorMessage(
                "First node can't be value node, attribute node (@) or param node (P)"
              );
              setIsOpen(true);
            } else if (
              (type == "moreThanNode" ||
                type == "lessThanNode" ||
                type == "moreThanAndEqualNode" ||
                type == "lessThanAndEqualNode") &&
              node.data.dataType === "boolean"
            ) {
              setModalErrorMessage(
                "The boolean type can only be used with the equal node (==) or not equal node (!=) ."
              );
              setIsOpen(true);
            } else {
              updatedNodes.push(updateNode(node as NodeProps, type as string));
              setNodes(updatedNodes);
              if (dropped) {
                setNodes(updatedNodes);
                setRedraw(true);
              }
            }
          }
        }
      }
    }
  };

  const handleNodesChange = (changes: NodeChange[]) => {
    changes.forEach((element) => {
      if (element.type === "remove") {
        const nodeIndex = nodes.findIndex((node) => node.id === element.id);
        const cloneUpdatedNodes: any = [...nodes];
        cloneUpdatedNodes[nodeIndex] = {
          ...nodes[nodeIndex],
          data: {
            ...nodes[nodeIndex].data,
            showType: "addNode",
          },
        };
        console.log("clone", cloneUpdatedNodes);
        setNodes(cloneUpdatedNodes);
      }
      if (element.type !== "remove") {
        onNodesChange(changes);
      }
    });
  };

  const handleSaveAction = async () => {
    const updateActionWhenByName = (
      array: IActions[],
      name: string,
      newWhen: string
    ) => {
      console.log("::1", array);
      const updatedArray = array.map((action) => {
        if (action.name === name) {
          return { ...action, when: newWhen };
        }
        return action;
      });
      return updatedArray;
    };

    if (metaData.startsWith("meta")) {
      if (getCookieData) {
        const parsedCookieData = Array.from(
          JSON.parse(getCookieData)
        ) as IActions[];
        const newAction = JSON.stringify(
          updateActionWhenByName(parsedCookieData, props.actionName, metaData)
        );
        localStorage.setItem("action", newAction);
      }
      setCookie("isEditAction", "true");
      setCookie("action-when", metaData);
      router.push(
        isCreateNewActionCookie === "true"
          ? `/newdraft/6/${schemacode}/action-form/create-new-action`
          : `/newdraft/6/${schemacode}/action-form/${props.actionName}`
      );
    } else {
      setModalErrorMessage("Please create your when");
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
        const highestNodeId = parseInt(
          addNodes[addNodes.length - 1].data.parentNode
        );
        console.log("::lowerstId", lowestNodeId);
        console.log("::highestId", highestNodeId);
        const lowestParentNode = addNodes.filter(
          (node) => parseInt(node.data.parentNode) === highestNodeId
        );
        lowestParentNode.sort(
          (a, b) => parseInt(a.data.parentNode) - parseInt(b.data.parentNode)
        );
        console.log("::parent", lowestParentNode);
        let updatedNode: any;
        if (nodes.length > 1) {
          updatedNode = lowestParentNode[0];
        } else {
          updatedNode = addNodes.find(
            (node) => parseInt(node.id) === lowestNodeId
          );
        }

        console.log(":: add nodes ::", addNodes);
        console.log(":: 1 ::", lowestNodeId);
        console.log("updatedNode", updatedNode);
        if (updatedNode) {
          if (
            type === "orNode" ||
            type === "andNode" ||
            type === "equalNode" ||
            type === "notEqualNode" ||
            type === "moreThanNode" ||
            type === "moreThanAndEqualNode" ||
            type === "lessThanNode" ||
            type === "lessThanAndEqualNode"
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
                width:
                  type === "valueNode"
                    ? nodeWidthAndHeight.width_value
                    : type === "attributeNode"
                    ? nodeWidthAndHeight.width_attribute
                    : nodeWidthAndHeight.width_param,
                height:
                  type === "valueNode"
                    ? nodeWidthAndHeight.height_value
                    : type === "attributeNode"
                    ? nodeWidthAndHeight.height_attribute
                    : nodeWidthAndHeight.height_param,
              },
            };
          }

          updatedNodes.push(updatedNode);

          if (!dropped) {
            dropped = true;
            if (
              type !== "paramNode" &&
              type !== "attributeNode" &&
              type !== "valueNode"
            ) {
              const positionLeftNode = {
                x: updatedNode.position.x + nodeWidthAndHeight.width,
                y:
                  updatedNode.position.y +
                  nodeWidthAndHeight.height +
                  nodeWidthAndHeight.grid_padding,
              };
              const positionRightNode = {
                x: updatedNode.position.x - nodeWidthAndHeight.width,
                y:
                  updatedNode.position.y +
                  nodeWidthAndHeight.height +
                  nodeWidthAndHeight.grid_padding,
              };
              const leftId = getId();
              const rightId = getId();

              const leftNode = {
                id: leftId,
                position: positionLeftNode,
                type: "customInputNode",
                data: {
                  showType: "addNode",
                  label: positionLeftNode,
                  id: leftId,
                  parentNode: updatedNode.id,
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
                  showType: "addNode",
                  label: positionRightNode,
                  id: rightId,
                  parentNode: updatedNode.id,
                  width: nodeWidthAndHeight.width,
                  height: nodeWidthAndHeight.height,
                },
                draggable: false,
              };

              const newEdges = [
                {
                  id: `e1-${rightId}`,
                  source: updatedNode.id,
                  target: rightId,
                  animated: true,
                  style: { stroke: "#79A0EF" },
                  type: "smoothstep",
                },
                {
                  id: `e1-${leftId}`,
                  source: updatedNode.id,
                  target: leftId,
                  animated: true,
                  style: { stroke: "#79A0EF" },
                  type: "smoothstep",
                },
              ];
              const childrenCount = edges.filter(
                (edge) => edge.source === updatedNode.id
              ).length;
              if (childrenCount < 2) {
                setEdges([...edges, ...newEdges]);
                updatedNodes.push(leftNode);
                updatedNodes.push(rightNode);
              }
            }

            if (
              updatedNode.id === "1" &&
              (type == "valueNode" ||
                type == "attributeNode" ||
                type == "paramNode")
            ) {
              setModalErrorMessage(
                "First node can't be value node, attribute node(@) or param node(P)"
              );
              setIsOpen(true);
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
              setRedraw(true);
            }
          }
        }
      }
    },
    [edges, getId, nodes, setEdges, setNodes]
  );

  const handleNodesLeave = () => {};
  console.log("log naja", props.metaFunction);
  useEffect(() => {
    if (props.metaFunction !== "create-new-when" && props.metaFunction !== "") {
      setRedraw(true);
      saveSCHEMA_CODE(props.schemaCode);
      const firstMetaData = props.metaFunction;
      convertObject(parser_when.parse(firstMetaData));
      setMetaData(props.metaFunction);
    }
  }, []);

  useEffect(() => {
    if (isGenerateGPT) {
      // console.log(">",metaData)
      // console.log(">>", parser_when.parse(metaData));
      setRedraw(true);
      console.log(`"${metaData.toString()}"`);
      console.log(convertObject(parser_when.parse(metaData.toString())));
      // convertObject(parser_when.parse("meta.GetNumber('points') > 0"));
      setIsGenerateGPT(false);
    }
  }, [convertObject, isGenerateGPT, metaData]);

  useEffect(() => {
    if (redraw && nodes.length > 0) {
      console.log("==>", nodes);
      const treeNodes = generateTreeFromReactFlow(nodes, edges);
      console.log(treeNodes);
      const tree = new Tree(treeNodes);
      console.log("tree=>", tree);
      tree.root.setBox(nodes.filter((node) => node.id === tree.root.id)[0]);
      // log tree

      const redrawTree = async () => {
        await drawTree(nodes, tree, tree.root, 0, 0);

        // adjust parents
        await adjustParents(tree);
        await adjustTreePosition(tree, 0);
        setNodes(tree.getAllBoxes());
      };
      redrawTree();
      setRedraw(false);
    }
  }, [edges, nodes, redraw, setNodes]);

  useEffect(() => {
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
      if (nodes.length > 5) {
        zoom = 0.8;
      }
      if (nodes.length > 8) {
        zoom = 0.6;
      }
      if (nodes.length > 11) {
        zoom = 0.4;
      }
      setCenter(x, y, { zoom, duration: 1000 });
    };
    if (nodes.length > 1) {
      setTimeout(() => {
        focusNode();
      }, 100);
    }
  }, [nodes, setCenter]);

  useEffect(() => {
    const getDataFromNode = () => {
      const tempArr: NodeProps[] = [];
      nodes.forEach((node) => {
        tempArr.push(node.data);
      });

      const transformData = (data: NodeProps[], id: string) => {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = 0; j < nodes.length; j++) {
            if (
              nodes[i].data.parentNode === nodes[j].data.parentNode &&
              nodes[i].data.showType === "attributeNode" &&
              nodes[j].data.showType === "valueNode"
            ) {
              nodes[j].data.dataType = nodes[i].data.dataType;
              nodes[j].data.isFetch = nodes[i].data.isFetch;
            }

            if (
              nodes[i].id === nodes[j].data.parentNode &&
              (nodes[i].data.showType === "equalNode" ||
                nodes[i].data.showType === "notEqualNode" ||
                nodes[i].data.showType === "moreThanNode" ||
                nodes[i].data.showType === "lessThanNode" ||
                nodes[i].data.showType === "moreThanAndEqualNode" ||
                nodes[i].data.showType === "lessThanAndEqualNode") &&
              nodes[j].data.showType === "attributeNode"
            ) {
              nodes[j].data.condition = nodes[i].data.value;
            }

            if (
              nodes[i].id === nodes[j].data.parentNode &&
              (nodes[i].data.showType === "equalNode" ||
                nodes[i].data.showType === "notEqualNode" ||
                nodes[i].data.showType === "moreThanNode" ||
                nodes[i].data.showType === "lessThanNode" ||
                nodes[i].data.showType === "moreThanAndEqualNode" ||
                nodes[i].data.showType === "lessThanAndEqualNode") &&
              nodes[j].data.showType === "valueNode"
            ) {
              nodes[i].data.dataType = nodes[j].data.dataType;
            }

            if (
              nodes[i].data.parentNode === nodes[j].data.parentNode &&
              nodes[i].data.showType === "paramNode" &&
              nodes[j].data.showType === "valueNode"
            ) {
              const dataType = nodes[j].data.value;
              console.log("1", nodes[i].data);
              console.log("logjuf", dataType);
              if (dataType.toString().includes(".")) {
                nodes[i].data.dataTypeFromValue = "float";
                nodes[j].data.dataType = "float";
              } else {
                const parsedValue = parseInt(dataType);
                if (!isNaN(parsedValue)) {
                  nodes[i].data.dataTypeFromValue = typeof parsedValue;
                  nodes[j].data.dataType = typeof parsedValue;
                } else if (
                  dataType.toLowerCase() === "true" ||
                  dataType.toLowerCase() === "false"
                ) {
                  nodes[i].data.dataTypeFromValue = "boolean";
                  nodes[j].data.dataType = "bool";
                } else {
                  nodes[i].data.dataTypeFromValue = "string";
                  nodes[j].data.dataType = "string";
                }
              }
              nodes[j].data.dataType === nodes[i].data.dataType;
            }
          }
        }
        const node = data.find((item) => item.id === id);
        if (!node) return null;

        const result: any = {};
        if (node.showType === "andNode" || node.showType === "orNode") {
          result.type = "condition_oper";
          result.value = node.showType === "andNode" ? "AND" : "OR";
        } else if (
          node.showType === "equalNode" ||
          node.showType === "notEqualNode" ||
          node.showType === "moreThanNode" ||
          node.showType === "moreThanAndEqualNode" ||
          node.showType === "lessThanNode" ||
          node.showType === "lessThanAndEqualNode"
        ) {
          result.type =
            node.dataType === "number"
              ? "number_compare_oper"
              : node.dataType === "float"
              ? "float_compare_oper"
              : node.dataType === "boolean"
              ? "boolean_compare_oper"
              : "string_compare_oper";
          result.value =
            node.value === "equal"
              ? "=="
              : node.value === "morethan"
              ? ">"
              : node.value === "morethanandequal"
              ? ">="
              : node.value === "lessthan"
              ? "<"
              : node.value === "lessthanandequal"
              ? "<="
              : "!=";
        } else if (node.showType === "attributeNode") {
          result.type = "meta_function";
          if (node.dataType === "boolean") {
            result.functionName = "GetBoolean";
          } else if (node.dataType === "string") {
            result.functionName = "GetString";
          } else if (node.dataType === "number") {
            result.functionName = "GetNumber";
          } else if (node.dataType === "float") {
            result.functionName = "GetFloat";
          }
          result.attributeName = {
            type: "constant",
            dataType: "string",
            value: node.value,
          };
        } else if (node.showType === "paramNode") {
          result.type = "meta_function";
          if (node.dataTypeFromValue === "boolean") {
            result.functionName = "GetBoolean";
          } else if (node.dataTypeFromValue === "string") {
            result.functionName = "GetString";
          } else if (node.dataTypeFromValue === "number") {
            result.functionName = "GetNumber";
          } else if (node.dataTypeFromValue === "float") {
            result.functionName = "GetFloat";
          }

          result.attributeName = {
            type: "param_function",
            functionName:
              node.dataType === "boolean"
                ? "GetBoolean"
                : node.dataType === "number"
                ? "GetNumber"
                : node.dataType === "float"
                ? "GetFloat"
                : "GetString",
            attributeName: {
              type: "constant",
              dataType: "string",
              value: node.value,
            },
          };
        } else if (node.showType === "valueNode") {
          result.type = "constant";
          result.dataType = node.dataType;
          result.value =
            node.dataType === "number"
              ? parseInt(node.value as string)
              : node.dataType === "float"
              ? parseFloat(node.value as string)
              : node.value === "true"
              ? true
              : node.value === "false"
              ? false
              : node.value;
        } else {
          result.type = "addNode";
        }

        const leftNode = data.find(
          (item) => item.parentNode === id && item.id !== id
        );
        if (leftNode) {
          result.left = transformData(data, leftNode.id);
        }

        const rightNode = data.find(
          (item) => item.parentNode === id && item.id !== leftNode?.id
        );
        if (rightNode) {
          result.right = transformData(data, rightNode.id);
        }
        return result;
      };
      const generateObject = transformData(tempArr, "1");
      const result = Factory.createObject(generateObject).toString();
      console.log("!!!", generateObject);
      console.log("-->obj", result);
      setMetaData(result);
      props.setMetaFunction(result);
      console.log("wtf!!", props.metaFunction);
    };
    if (nodes.length > 1) {
      getDataFromNode();
    }
  }, [nodes, props, setNodes]);

  return (
    <div className="flex justify-between px-8 h-full">
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
          type="when"
          actionName={props.actionName}
          metaFunction={props.metaFunction}
        />
        <div className="h-full w-full border rounded-3xl bg-white p-2 mt-4">
          <div ref={reactFlowWrapper} className="h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={handleNodesChange}
              onNodeMouseLeave={handleNodesLeave}
              onConnect={onConnect}
              onInit={onInit}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Controls position="top-left" />
              <MiniMap position="top-right"></MiniMap>
            </ReactFlow>
          </div>
        </div>
        <div>
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
            <button onClick={handleSaveAction}>
              <SaveButton />
            </button>
          </div>
        </div>
      </div>
      <Flowbar
        metaData={metaData}
        setMetaData={setMetaData}
        actionName={props.actionName}
        setIsGenerateGPT={setIsGenerateGPT}
        handleDoubleClickAddNode={handleDoubleClickAddNode}
      ></Flowbar>
    </div>
  );
};

export default WhenFlow;
