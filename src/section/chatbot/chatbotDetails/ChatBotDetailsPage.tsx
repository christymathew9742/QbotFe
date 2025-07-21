"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import CustomNode from "./CustomNode";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  NodeChange,
  EdgeChange,
  Node,
  Edge,
  useReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  MarkerType,
} from "reactflow";
import { getBotSelector, getWebSocketStatusSelector } from "@/redux/reducers/chatBot/selectors";
import { useSearchParams,useRouter, usePathname } from 'next/navigation';
import { AppDispatch } from "@/redux/store";
import {
  postBotRequest,
  fetchBotRequest, 
  updateBotRequest,
  webSocketConnected,
} from "@/redux/reducers/chatBot/actions";
import { POST_BOT_REQUEST,UPDATE_BOT_REQUEST } from "@/redux/reducers/chatBot/actionTypes";
import { useDispatch, useSelector } from 'react-redux';
import { messageIcons, groupIcons, replayIcons, Preference } from "@/utils/utils";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "reactflow/dist/style.css";
import {constantsText} from "../../../constant/constant"
import { toast } from "react-toastify";
import { baseURL } from "@/utils/url";

const {
  BOT:{
    STEP,
    SAVE,
    ICON_TITLE1,
    ICON_TITLE2,
    ICON_TITLE3,
    ICON_TITLE4,
    BOT_TITLE,
  },
} = constantsText;

type Input = {
  id: string;
  type: string;
  field: string;
  value: string; 
  editor?: any;
}

type CustomNodeData = {
  inputs: Input[];
  label:string;
  nodeCount:number;
  setInputs: (callback: (inputs: Input[]) => Input[]) => void;
  deleteField: (id: string) => void;
};

interface NodeData {
  deleteField?: any;
  setInputs?: any;
  inputs?: Array<{ editor?: any; [key: string]: any }>;
}

interface Nod {
  data: NodeData;
  id: string; 
  [key: string]: any;
}

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

interface FlowData {
  title:String;
  nodes: Nod[];
  edges: Edge[];
  viewport: Viewport;
  status: Boolean;
  update: Boolean;
  data:any;
}

interface InitialNodeData {
  inputs: any[];
  value?: any;
  setInputs: (callback: (inputs: any[]) => any[]) => void;
  deleteField: (fieldId: string) => void;
  [key: string]: any;
}

interface InitialBotData {
  data: {
    nodes: Node[];
    edges: any[];
    viewport: { x: number; y: number; zoom: number };
  };
}

interface FlowInstance {
  current: {
    setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  } | null;
}

const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes:any = {
  type: 'smoothstep',
};

const isValidConnection = (connection:any) => {
  const { sourceHandle, targetHandle } = connection;
  if (sourceHandle.startsWith('option') && targetHandle.startsWith('replay')) {
    return false; // Prevent option handles from connecting to message handles
  }
  return true;
};

const ChatBotDetails = () => {
  const botData = useSelector(getBotSelector); 
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isTitleEmpt, setIsTitleEmpt] = useState(false);
  const [title, setTitle] = useState<String | any>('');
  const titleRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPath = usePathname()
  const chatbotId:string | any = searchParams.get('botId'); 
  // const isConnected = useSelector(getWebSocketStatusSelector);
  // const isPending = useSelector(getPendingSelector);
  const generatedId:string | any = botData?.data?._id || '';
  const { screenToFlowPosition } = useReactFlow();
  const createNodeId = `group-${Date.now()}`; 

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const updatedEdges = applyEdgeChanges(changes, eds);
        return updatedEdges.map((edge) => ({
          ...edge,
          label:"x",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#b00707'
          },
          type: 'smoothstep',
        }));
      });
    },[]
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: { id: string }) => {
      event.stopPropagation();
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    []
  );

  const onConnect = useCallback(
    (params: any) => {
      if (!params.source || !params.target) {
        console.error("Invalid connection params:", params);
        return;
      }
  
      setEdges((eds) => {
        const isSourceConnectedToAnotherTarget = eds.some(
          (edge) =>
            edge.source === params.source &&
            edge.sourceHandle === params.sourceHandle
        );
  
        if (isSourceConnectedToAnotherTarget) {
          console.warn(
            `Source ${params.source} is already connected to another target. Restricting new connection.`
          );
          return eds; 
        }

        const newEdge: Edge = {
          ...params,
          id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`,
          source: params.source,
          target: params.target,
          label: "x",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#b00707",
          },
          type: "smoothstep",
        };
  
        return addEdge(newEdge, eds);
      });
    },
    [] 
  );
  
  const onDropNode = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow-node");
      if (!nodeType) return;

      const position = screenToFlowPosition({
        x:event.clientX, 
        y:event.clientY
      });
      const newNodeId = createNodeId; 
      const newNode: Node<CustomNodeData> = {
        id: newNodeId,
        type: nodeType,
        position,
        data: {
          inputs: [],
          nodeCount: nodes.length+1,
          label: `${STEP}${nodes.length+1}`,
          setInputs: (callback) =>
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNodeId
                  ? { ...node, data: { ...node.data, inputs: callback(node.data.inputs) } }
                  : node
              )
            ),
          deleteField: (id) =>
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNodeId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        inputs: node.data.inputs.filter((input) => input.id !== id),
                      },
                    }
                  : node
              )
            ),
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, screenToFlowPosition]
  );

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const sanitizeNode = (node: Nod): Nod => ({
    ...node,
    data: {
      ...node.data,
      deleteField: null,
      setInputs: null,
      inputs: node.data?.inputs?.map((input) => {
        if (input.editor) {
          const { editor, ...rest } = input;
          return {
            ...rest,
            options: input.options?.map((option:any) => ({
              ...option,
            })) || [],
          };
        }
        return input;
      }) || [],
    },
  });

  const isEmptyField = (data: { inputs?: { value: string }[] }): boolean => {
    return (
      Array.isArray(data?.inputs) &&
      data.inputs.length > 0 &&
      data.inputs.every(({ value }) => {
        const content =
          new DOMParser().parseFromString(value, "text/html").body.textContent || "";
        return content.trim() !== "";
      })
    );
  };
  
  const sanitizeFlowData = (flowData: FlowData): FlowData => ({
    ...flowData,
    title: title,
    nodes: flowData.nodes.map((node) => sanitizeNode(node)),
    edges: flowData.edges.map((edge) => ({
      ...edge,
    })),
    status: true,
    viewport: {
      ...flowData.viewport,
    },
  });

  const saveData = useCallback(
    async () => {
      if (!reactFlowInstance.current) {
        console.error("React Flow instance is not available");
        return;
      }
      const flowData: FlowData | any = reactFlowInstance.current.toObject();
      console.log("Flow Data:", flowData);
      const sanitizedData = sanitizeFlowData(flowData);
      console.log("Sanitized Data:", sanitizedData);
      const botData = { ...sanitizedData };
      const update = flowData.nodes.length > 0 
        && flowData.nodes.every((node:FlowData) => 
          isEmptyField(node?.data));
      
      if (isTitleEmpt) {
        toast.error('The title cannot be empty');
        return;
      }
  
      if (!update) {
        toast.error('The node or its fields are empty.');
        return;
      }

      try {
        const action = chatbotId
        ? updateBotRequest({ id: chatbotId, payload: { ...botData } })
        : postBotRequest({ ...botData });
        const result = await dispatch(action);
        const handleSuccess = (message: string) => 
          toast.success(message);
        const handleError = (message: string) => toast.error(message);
        switch (result.type) {
          case POST_BOT_REQUEST:
            handleSuccess('Saved.');
            break;
          case UPDATE_BOT_REQUEST:
            handleSuccess('Updated');
            break;
          default:
            handleError("Error saving data.");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Error saving data");
      }
    },
    [chatbotId, dispatch,title]
  );

  const updateNodeData = (nodeId: string, updateCallback: (data: InitialNodeData) => InitialNodeData) => {
    setNodes((nds:any) =>
      nds.map((node:any) =>
        node.id === nodeId ? { ...node, data: updateCallback(node.data) } : node
      )
    );
  };

  const createNode = (
    id: string,
    type: string | any,
    position: { x: number; y: number },
    dataOverrides: Partial<InitialNodeData>
  ): Node => ({
    id,
    type,
    position,
    data: {
      ...dataOverrides,
      setInputs: (callback:any) => 
        updateNodeData(id, (data) => 
          ({ ...data, inputs: callback(data.inputs) })),

      deleteField: (fieldId:any) =>
        updateNodeData(id, (data) => ({
          ...data,
          inputs: data.inputs.filter((input) => input.id !== fieldId),
        })),
    },
  });

  const initializeNodeData = (
    botData: InitialBotData | null,
    reactFlowInstance: ReactFlowInstance |  FlowInstance | any
  ) => {
    const initialNode = createNode(createNodeId, "customNode", { x: 0, y: 0 }, {
      inputs: [],
      nodeCount: nodes.length,
      label: `${STEP}1`,
    });

    if (
      botData?.data?.nodes &&
      botData?.data?.edges &&
      botData?.data?.viewport
    ){
      const sanitizedNodes = botData.data.nodes.map((node) =>
        createNode(node.id, node.type, node.position, {
          ...node.data,
          value: node.data.value,
        })
      );

      setNodes(sanitizedNodes);
      setEdges(botData.data.edges);

      if (reactFlowInstance.current) {
        reactFlowInstance.current.setViewport(botData.data.viewport);
      }
    } else {
      !chatbotId && setNodes([initialNode]);
    }
  };

  useEffect(() => {
    const socketUrl = `${baseURL}`;
    const socket = new WebSocket(socketUrl);
    const handleSocketEvents = () => {
      socket.onopen = () => {
          dispatch(webSocketConnected());
          if (chatbotId) dispatch(fetchBotRequest(chatbotId));
      };
      socket.onerror = (event:any) =>  
        event.message && 
        console.error("WebSocket Error:", event.message);
      socket.onmessage = (event) => {
          const message = event.data;
          console.log("WebSocket Message",message)
      };
      socket.onclose = () => console.log("WebSocket closed");
      return () => {
        socket.close();
      };
    };
    handleSocketEvents();

    return () => socket.close();
  }, [dispatch, chatbotId,socket]); 

  useEffect(() => {
    if (botData) {
      initializeNodeData(botData, reactFlowInstance.current);
      setTitle(chatbotId ? botData?.data?.title : `${BOT_TITLE}` || '');
    }
  }, [botData, reactFlowInstance]);

  useEffect(() => {
    if (generatedId && generatedId !== chatbotId) {
      router.replace(`${currentPath}?botId=${generatedId}`, { scroll: false });
    }
  }, [generatedId, chatbotId, currentPath, router]); 

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    instance.setViewport({ x: 50, y: 100, zoom: 1 });
    if (titleRef.current) {
      titleRef.current.select();
    }
  }, [reactFlowInstance,titleRef]);

  const handleInputTitleChange = useCallback((e:any) => {
    const value = e.target.value;
    setTitle(e.target.value);
    setIsTitleEmpt(value === "")
  }, [title]);

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        isValidConnection={isValidConnection}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onDrop={onDropNode}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onInit={onInit}
        edgeTypes={edgeTypes} 
      >
        <Background 
          gap={2} 
          size={1} 
          className="bg-cover bg-center bg-no-repeat object-cover dark:bg-black" 
        />
      </ReactFlow>
      <div className="fixed top-2 bottom-2 right-2 overflow-auto w-full sm:w-48 bg-node-active p-3 rounded-lg shadow-lg overflow-y-auto z-50 dark:bg-black dark:border-[1px] dark:border-dark-border">
        <h4 className="text-drag-text mb-1 text-xxs font-bold dark:text-dark-text">{ICON_TITLE1}</h4>
        <hr className="mb-3 mt-2 border-b border-divider dark:border-dark-border"/>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1">
          {messageIcons.map(({ type, icon }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => {
                const inputData = { type, field: "messages" };
                e.dataTransfer.setData("application/reactflow-input", JSON.stringify(inputData));
              }}
              className="bg-node-active border-2 border-dotted border-drag-border p-[4px] rounded cursor-grab text-drag-text text-xxxs mb-1 dark:bg-black dark:border-1 dark:border-dark-border dark:text-dark-text"
            >
              {icon} {type}
            </div>
          ))}
        </div>
        <h4 className="text-drag-text mb-1 mt-3 text-xxs font-bold dark:text-dark-text">{ICON_TITLE2}</h4>
        <hr className="mb-3 dark:mt-2 border-b border-divider dark:border-dark-border"/>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1">
          {replayIcons.map(({ type, icon }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => {
                const inputData = { type, field: "replay" };
                e.dataTransfer.setData("application/reactflow-input", JSON.stringify(inputData));
              }}
              className="bg-node-active border-2 border-dotted border-drag-border p-[4px] rounded cursor-grab text-drag-text text-xxxs mb-1 dark:bg-black dark:border-1 dark:border-dark-border dark:text-dark-text"
            >
              {icon} {type}
            </div>
          ))}
        </div>
        <h4 className="text-drag-text mb-1 mt-3 text-xxs font-bold dark:text-dark-text">{ICON_TITLE3}</h4>
        <hr className="mb-3 dark:mt-2 border-b border-divider dark:border-dark-border"/>
        <div className="grid grid-cols-2 gap-y-2 gap-x-1">
          {Preference.map(({ type, icon }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => {
                const inputData = { type, field: "preference" };
                e.dataTransfer.setData("application/reactflow-input", JSON.stringify(inputData));
              }}
              className="bg-node-active border-2 border-dotted border-drag-border p-[4px] rounded cursor-grab text-drag-text text-xxxs mb-1 dark:bg-black dark:border-1 dark:border-dark-border dark:text-dark-text"
            >
              {icon} {type}
            </div>
          ))}
        </div>
        <h4 className="text-drag-text mb-1 mt-3 text-xxs font-bold dark:text-dark-text">{ICON_TITLE4}</h4>
        <hr className="mb-3  dark:mt-2 border-b border-divider dark:border-dark-border"/>
        <div>
          {groupIcons.map(({ type, icon }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/reactflow-node", 'customNode');
              }}
              className="bg-node-active border-2 border-dotted border-drag-border p-[4px] rounded cursor-grab text-drag-text text-xxxs mb-1 dark:border-1 dark:border-dark-border dark:text-dark-text dark:bg-black"
            >
              {icon} {type}
            </div>
          ))}
        </div>
      </div>
      <div className="fixed top-2 left-1 w-[90%] sm:w-[30%] h-auto bg-node-active p-1 rounded-lg shadow-lg z-50 flex flex-col sm:flex-row gap-2 dark:bg-black dark:border-[1px] dark:border-dark-border">
        <input
          type="text"
          ref={titleRef}
          value={title || ""}
          onChange={handleInputTitleChange}
          className={`text-xxs text-text-theme flex-1 h-4 p-[10px] rounded focus:outline-none hover:outline-none border-1 border-solid ${isTitleEmpt ? 'border-error' : 'border-drag-border dark:border-1 dark:border-dark-border dark:text-dark-text dark:bg-black'}`}
        />
        <button
          className="flex items-center -ml-1 justify-center h-4 p-[10px] bg-[rgb(240 241 246)] rounded shadow border-1 border-solid border-drag-border dark:border-1 dark:border-dark-border dark:text-dark-text dark:bg-black"
          onClick={()=> router.push('/chatbot')}
        >
          <ArrowBackIcon  
            sx={{
              fontSize:'14px', 
            }}
          />
        </button>
        <button
          className="flex text-xxs items-center -ml-1 justify-center h-4 p-[10px] bg-[rgb(240 241 246)] rounded shadow border-1 border-solid border-drag-border dark:border-1 dark:border-dark-border dark:text-dark-text dark:bg-black"
          onClick={saveData}
        >
          {SAVE}
        </button>
      </div>
    </div>
  );
};

export default function OrderWrapper() {
  return (
    <ReactFlowProvider>
      <ChatBotDetails />
    </ReactFlowProvider>
  );
}














