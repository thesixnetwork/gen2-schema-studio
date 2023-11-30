import ReactFlow, {
    Background,
    MiniMap,
    Node,
    addEdge,
    useReactFlow,
    ReactFlowProvider,
    ReactFlowInstance,
    ReactFlowProps,
    Connection,
    Edge,
    useNodesState,
    useEdgesState,
    Panel,
    NodeOrigin,
    Handle,
    Position,
    NodeProps,
    
  } from 'reactflow';

import _ from 'lodash'

const GRID_WIDTH = 150;
const GRID_HEIGHT = 57

export interface ITreeNode {
    id: string;
    name: string;
    parentId?: string;
    children?: ITreeNode[];
}

interface IXRange {
    minX: number;
    maxX: number;
}

interface BoxResult {
    result: boolean;
    maxX?: number;
    box?: any;
    goodX?: number;
}

export class TreeNode implements ITreeNode {
    id: string;
    name: string;
    parentId?: string;
    children?: TreeNode[];
    treeLevel?: number;
    box?: any;

    constructor(id: string, name: string, parentId?: string) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
    }

    getPos() {
        return {
            x : (this.box! as Node).position.x,
            y : (this.box! as Node).position.y,
        }
    }

    setBox(box: any) {
        this.box = box;
    }

    getBox() {
        return this.box;
    }

    setX(x: number) {
        const nodeBox = (this.box! as Node)
        nodeBox.position.x = x;
    }

    getX() {
        return (this.box! as Node).position.x;
    }
}

export class Tree {
    nodes: TreeNode[] = [];
    root: TreeNode;
    nodeMap = new Map<string, TreeNode>();
    maxLevel = 0;

    constructor(nodes: ITreeNode[]) {
        // loop over nodes
        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const newNode = new TreeNode(node.id, node.name, node.parentId)
            this.nodes.push(newNode);
            this.nodeMap.set(node.id, newNode);
        }
        this.root = this.findRoot();
        this.generateTree();
    }

    private generateTree() {
        // create map using id as key from nodes
        this.root.treeLevel = 0;
        this.downTree(this.root);
    }

    private downTree(node: TreeNode) {
        const children = this.nodes.filter(n => n.parentId === node.id);
        if (children.length > 0) {
            node.children = [];
            children.forEach(child => {
                if(node.treeLevel! + 1 > this.maxLevel) {
                    this.maxLevel = node.treeLevel! + 1;
                }
                child.treeLevel = node.treeLevel! + 1;
                node.children?.push(child);
                this.downTree(child);
            });
        }
    }

    findNodeWithBoxByLevel(level: number) {
        const nodes = this.nodes.filter(node => node.treeLevel === level);
        return nodes.filter(node => node.box !== undefined);
    }

    findNodeById(id: string) {
        return this.nodeMap.get(id);
    }


    findRoot(): TreeNode {
        const root = this.nodes.find(node => node.parentId === undefined);
        if (root === undefined) {
            throw new Error('No root node found');
        }
        return root;
    }

    getAllBoxes() {
        return this.nodes.map(node => node.box);
    }
    
}

export const generateTreeFromReactFlow = (nodes:Node[],edges:Edge[]) => {
    const allTreeNodes:ITreeNode[] = [];
    // const nodesMap:[key:string]:ITreeNode{} = {}
    const nodesMap:{[key:string]:ITreeNode} = {}
    for(let i=0;i<nodes.length; i++) {
        const node = nodes[i];
        const treeNode = {
            id: node.id,
            name: node.id,
        }
        allTreeNodes.push(treeNode)
        _.set(nodesMap,node.id,treeNode)
    }
    // loop over edges
    for(let i=0;i<edges.length; i++) {
        const edge = edges[i];
        const targetTree = _.get(nodesMap,edge.target)
        targetTree.parentId = edge.source;
    }
    
    return allTreeNodes;
}

const createBox = (currentNode:TreeNode,tree:Tree,x: number, y: number, content: string, level:number): BoxResult => {
    const paintNodes = tree.findNodeWithBoxByLevel(level)

    if(level==0) {
        return {
            result:true
        }
    }
    // console.log("paintNodes",level,paintNodes)

    // create array of parentId contains nodes
    const parentIds = paintNodes.map(node => node.parentId)
    const parentRange:{[parentId:string]:IXRange} = {}
    // loop over parentIds
    for(let i = 0; i < parentIds.length; i++) {
        const parentId = parentIds[i]
        // console.log("parentId",parentId)
        // find min and max X from paintNodes where parentId is equal to parentId
        const nodes = paintNodes.filter(node => node.parentId === parentId)
        // console.log("nodes",nodes)
        const minX = _.min(nodes.map(node => node.getX()))
        const maxX = _.max(nodes.map(node => node.getX()))
        // console.log("minX",minX)
        // console.log("maxX",maxX)
        parentRange[parentId!] = {
            minX: minX!,
            maxX: maxX!,
        }
    }

    // console.log("parentRange",parentRange)

    // Get the most MAX from all parentRange
    const max = _.max(Object.values(parentRange).map(range => range.maxX))
    // console.log("max",max)

    if(x <= max! + (GRID_WIDTH)) {
        return {
            result: false,
            maxX: max!,
        }
    }

    return {
        result: true,
        goodX: x,
    }
}

export const adjustParents = async (tree:Tree) => {
    const level = tree.maxLevel
    // console.log("maxLevel",level)
    // loop over level from level to 0
    for(let i = level; i > 0; i--) {
        const paintNodes = tree.findNodeWithBoxByLevel(i)
        // console.log("paintNodes",level,paintNodes)
        let parentIds = paintNodes.map(node => node.parentId)
        parentIds = _.uniq(parentIds)
        // loop over parentIds
        for(let j = 0; j < parentIds.length; j++) {
            const parentId = parentIds[j]
            const nodes = paintNodes.filter(node => node.parentId === parentId)
            const minX = _.min(nodes.map(node => node.getX()))
            const maxX = _.max(nodes.map(node => node.getX()))
            const newParentX = Math.round((minX! + maxX!) / 2)
            const parentNode = tree.findNodeById(parentId!)
            parentNode?.setX(newParentX)
        }

    }
}

export const adjustTreePosition = async (tree:Tree,rootOriginX:number) => {
    const diff = rootOriginX - tree.root.getX()!
    // loop al nodes
    for(let i = 0; i < tree.nodes.length; i++) {
        const node = tree.nodes[i]
        node.setX(node.getX()! + diff)
    }
}

export const drawTree = async(nodes:Node[],tree:Tree,node: TreeNode, x: number, y: number):Promise<BoxResult> => {
    // generate nodesMap by node.id
    const nodesMap = _.keyBy(nodes,'id')

    if(node.id===tree.root.id) {
        // console.log("ROOT",node.id)

    }

    return new Promise(async (resolve) => {
        const newBox = createBox(node,tree,x, y, node.name,node.treeLevel!)

        // console.log("newBox",newBox,node.id)

        if(!newBox.result) {
            resolve(newBox)
            return
        }
        if(newBox.result) {
            const drawNode = nodesMap[node.id]
            drawNode.position.x = newBox.goodX!
            node.setBox(drawNode)
            if(node.children && node.children.length > 0) {
                // check if length is even
                const childrenLength = node.children.length
                const isEven = node.children.length % 2 === 0;
                let pX = 0;
                // init start position x
                if(isEven) {
                    // case of even
                    pX = (node.children.length-1) * -(GRID_WIDTH)
                }else{ 
                    // case of odd
                    pX = ((node.children.length-1) * -(GRID_WIDTH))

                    // console.log("pX",pX)
                }
                const pY = y + GRID_HEIGHT

                const firstDrew = false;

                let updatedX = x;

                // while(!firstDrew) {
                    for(let i = 0; i < node.children.length; i++) {
                        const child = node.children[i]
                        let drawStatus = false;
                        while(!drawStatus) {
                                const drawResult = await drawTree(nodes,tree,child, updatedX +pX, pY)
                                drawStatus = drawResult.result
                                // console.log("======-drawStatus",drawStatus)
                
                                if(!drawStatus) {
                                    updatedX += (drawResult.maxX! - (updatedX +pX)) + (GRID_WIDTH*2)
                                    // console.log("updatedX",updatedX)
                                }
                             
                        }
                        
                        pX += (GRID_WIDTH * 2)
                    }
                // }
                if(updatedX!=x) {
                    node.setX(updatedX)
                    // console.log("update X",node.id,node.getPos().x,x)
                }
            }
        }

        resolve(newBox)
        return;
    })
}


