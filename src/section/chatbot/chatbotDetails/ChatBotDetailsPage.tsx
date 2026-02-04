"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import CustomNode from "./CustomNode";
import CustomEdge, { CustomConnectionLine } from "./CustomEdge";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Node,
  Edge,
  useReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
} from "reactflow";
import { getBotSelector } from "@/redux/reducers/chatBot/selectors";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AppDispatch } from "@/redux/store";
import {
  postBotRequest,
  fetchBotRequest,
  updateBotRequest,
  webSocketConnected,
  postBotFailure,
} from "@/redux/reducers/chatBot/actions";
import { POST_BOT_REQUEST, UPDATE_BOT_REQUEST } from "@/redux/reducers/chatBot/actionTypes";
import { useDispatch, useSelector } from 'react-redux';
import { messageIcons, replayIcons, Preference, isFileType } from "@/utils/utils";
import "reactflow/dist/style.css";
import { constantsText } from "../../../constant/constant"
import { toast } from "react-toastify";
import { baseURL } from "@/utils/url";
import { useSaveFlowData } from "@/hooks/useSaveFlowData";
import { SaveEventProvider, useSaveEvent } from "@/context/SaveDataContext";
import SaveLoader from "@/components/saveLoader/SaveLoader";
import { useStatus } from "@/context/StatusContext";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const {
  BOT: {
    STEP,
    SAVE,
    ICON_TITLE1,
    ICON_TITLE2,
    ICON_TITLE3,
    BOT_TITLE,
  },
} = constantsText;

// --- Types ---
type Input = {
  id: string;
  type: string;
  field: string;
  editor?: any;
  options?: any;
  icon?: any;
  slots?: any[];
  fileData?: any[];
}

type CustomNodeData = {
  inputs: Input[];
  label: string;
  nodeCount: number;
  setInputs: (callback: (inputs: Input[]) => Input[]) => void;
  deleteField: (id: string) => void;
};

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

const edgeTypes = {
  customEdge: CustomEdge,
};

const isValidConnection = (connection: any) => {
  const { sourceHandle, targetHandle } = connection;
  if (sourceHandle.startsWith('option') && targetHandle.startsWith('replay')) {
    return false;
  }
  return true;
};

// --- Reusable Draggable Item Component (Updated for Compact Size & Colors) ---
const DraggableItem = ({ 
  type, 
  icon, 
  field, 
  nodeType = "customNode",
  color 
}: { 
  type: string, 
  icon: any, 
  field: string, 
  nodeType?: string,
  color: string 
}) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    const inputData = { type, field, node: nodeType, icon };
    event.dataTransfer.setData("application/reactflow-node", JSON.stringify(inputData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, nodeType)}
      className="group flex flex-col items-center justify-center p-2 bg-[#1e293b]/50 backdrop-blur-sm rounded-xl border border-slate-700/50 cursor-grab transition-all duration-300 active:cursor-grabbing hover:bg-[#1e293b]"
      style={{ '--theme-color': color } as React.CSSProperties}
    >
      <div className="text-slate-400 transition-all duration-300 mb-1 group-hover:scale-110 group-hover:text-[var(--theme-color)]">
        {React.cloneElement(icon, { sx: { fontSize: 22 } })}
      </div>
      <span className="text-xxxs font-bold text-slate-400 uppercase tracking-wider transition-colors group-hover:text-slate-200">
        {type}
      </span>
      <style jsx>{`
        .group:hover {
          border-color: var(--theme-color);
          box-shadow: 0 0 15px color-mix(in srgb, var(--theme-color), transparent 85%);
        }
      `}</style>
    </div>
  );
};

const ChatBotDetails = () => {
  const botData = useSelector(getBotSelector);
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const [isTitleEmpt, setIsTitleEmpt] = useState(false);
  const [title, setTitle] = useState<string | any>('');
  const [load, setLoad] = useState<number | any>(0);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPath = usePathname()
  const chatbotId: string | any = searchParams.get('botId');
  const generatedId: string | any = botData?.data?._id || '';
  const { screenToFlowPosition } = useReactFlow();
  const createNodeId = Date.now();
  const newNodeId = `group-${createNodeId}`;
  const [startSave, setStartSave] = useState(false)
  const [isResult, setIsResult] = useState<boolean | any>(true);
  const { triggerSave } = useSaveEvent();
  const { status } = useStatus();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: { id: string }) => {
      event.stopPropagation();
      const target = event.target as HTMLElement;
      if (target.closest('div') && target.textContent === 'X') {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    []
  );

  const onConnect = useCallback(
    (params: any) => {
      if (!params.source || !params.target) return;

      setEdges((eds) => {
        const isSourceConnectedToAnotherTarget = eds.some(
          (edge) =>
            edge.source === params.source &&
            edge.sourceHandle === params.sourceHandle
        );

        if (params.source === params.target) return eds;

        if (isSourceConnectedToAnotherTarget) {
          console.warn("Source is already connected to another target.");
          return eds;
        }

        const newEdge: Edge = {
          ...params,
          id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`,
          source: params.source,
          target: params.target,
          type: 'customEdge',
          data: { label: 'X' },
        };

        return addEdge(newEdge, eds);
      });
    },
    []
  );

  const onDropNode = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const jsonData = event.dataTransfer.getData("application/reactflow-node");
      if (!jsonData) return;

      const inputData = JSON.parse(jsonData);
      if (inputData?.field === "replay") return;

      const newInput = {
        id: `${newNodeId}-input-${createNodeId}`,
        field: inputData?.field,
        type: inputData?.type,
        slots: [],
        options:
          inputData?.type === "List" || inputData?.type === "Button"
            ? [{ id: createNodeId, ...inputData, value: "" }]
            : [],
        fileData: [],
      };

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let labelIndex = nodes.length + 1;
      let generatedLabel = `${STEP}${labelIndex}`;
      const existingLabels = nodes.map((node) => node.data.label);

      while (existingLabels.includes(generatedLabel)) {
        labelIndex++;
        generatedLabel = `${STEP}${labelIndex}`;
      }

      const newNode: Node<CustomNodeData> = {
        id: newNodeId,
        type: inputData?.node,
        position,
        data: {
          inputs: [newInput],
          nodeCount: nodes.length + 1,
          label: generatedLabel,
          setInputs: (callback) =>
            typeof callback === "function" &&
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
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    },
    [nodes, screenToFlowPosition, createNodeId, newNodeId]
  );

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const { saveData } = useSaveFlowData({
    reactFlowInstance,
    dispatch,
    chatbotId,
    title,
    isTitleEmpt,
    toast,
    postBotRequest,
    updateBotRequest,
    postBotFailure,
    POST_BOT_REQUEST,
    UPDATE_BOT_REQUEST,
    isFileType,
  });

  const updateNodeData = (nodeId: string, updateCallback: (data: InitialNodeData) => InitialNodeData) => {
    setNodes((nds: any) =>
      nds.map((node: any) =>
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
      setInputs: (callback: ((inputs: typeof dataOverrides.inputs) => any) | any) =>
        updateNodeData(id, (data) => {
          let newInputs;
          if (typeof callback === "function") {
            try {
              newInputs = callback(data.inputs);
            } catch (err) {
              console.error("Error in setInputs callback:", err);
              newInputs = data.inputs;
            }
          } else {
            newInputs = callback;
          }
          return { ...data, inputs: Array.isArray(newInputs) ? newInputs : data.inputs };
        }),
      deleteField: (fieldId: any) =>
        updateNodeData(id, (data) => ({
          ...data,
          inputs: Array.isArray(data.inputs) ? data.inputs.filter((input) => input.id !== fieldId) : [],
        })),
    },
  });

  const initializeNodeData = (
    botData: InitialBotData | null,
    reactFlowInstance: ReactFlowInstance | FlowInstance | any
  ) => {
    const initialNode = createNode(newNodeId, "customNode", { x: 0, y: 0 }, {
      inputs: [],
      nodeCount: nodes.length + 1,
      label: `${STEP}1`,
    });

    if (botData?.data?.nodes && botData?.data?.edges && botData?.data?.viewport) {
      const sanitizedNodes = botData.data.nodes.map((node) =>
        createNode(node.id, node.type, node.position, {
          ...node.data,
          value: node.data.value,
        })
      );
      setNodes(sanitizedNodes);
      setEdges(botData?.data?.edges);
      if (reactFlowInstance?.current) {
        reactFlowInstance?.current?.setViewport(botData.data.viewport);
      }
    } else {
      !chatbotId && setNodes([initialNode]);
    }
  };

  useEffect(() => {
    const socketUrl = `${baseURL}`;
    const socket = new WebSocket(socketUrl);
    socket.onopen = () => {
      dispatch(webSocketConnected());
      if (chatbotId) dispatch(fetchBotRequest(chatbotId));
    };
    return () => socket.close();
  }, [dispatch, chatbotId]);

  useEffect(() => {
    if (botData) {
      initializeNodeData(botData, reactFlowInstance.current);
      setTitle(chatbotId ? botData?.data?.title : `${BOT_TITLE}` || '');
      setLoad(chatbotId ? botData?.data?.nodes?.length : 1);
    }
  }, [botData, reactFlowInstance]);

  useEffect(() => {
    if (generatedId && generatedId !== chatbotId) {
      router.replace(`${currentPath}?botId=${generatedId}`, { scroll: false });
    }
  }, [generatedId, chatbotId, currentPath, router]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    instance.setViewport({ x: 50, y: 100, zoom: 0.60 });
    if (titleRef.current) titleRef.current.select();
  }, []);

  const handleInputTitleChange = useCallback((e: any) => {
    setTitle(e.target.value);
    setIsTitleEmpt(e.target.value === "");
  }, []);

  if (!load) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0B1120]">
        <img src="/gif/botLoad1.gif" width={80} height={80} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#0B1120]">
      <SaveLoader pending={startSave} color={isResult ? '#0FAB49' : '#f43f5e'} />

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
        connectionLineComponent={CustomConnectionLine}
        onClick={() => setIsResult(true)}
        proOptions={{ hideAttribution: true }}
      >
      </ReactFlow>

      {/* --- Floating Top Bar (Island) --- */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-50 flex items-center gap-2 p-0.5 bg-[#1e293b]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
        <button
          className="p-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          onClick={() => router.push('/chatbot')}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16, marginBottom:0.5 }} />
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1"></div>

        <input
          type="text"
          maxLength={22}
          ref={titleRef}
          value={title || ""}
          placeholder="Untitled Bot"
          onChange={handleInputTitleChange}
          className={`bg-transparent text-xxs font-medium text-slate-200 placeholder-slate-500 outline-none w-32 md:w-64 px-2 py-1 ${isTitleEmpt ? 'placeholder-red-400' : ''}`}
        />

        <button
          className={`
            flex items-center gap-2 px-2 py-1 mr-1 rounded-xl text-xxs font-bold uppercase tracking-wider text-white shadow-lg transition-all
            ${status || startSave
              ? 'bg-slate-700 cursor-wait opacity-80'
              : 'bg-linear-to-r from-color-primary-light to-bot-theme hover:shadow-color-primary-light/30'
            }
          `}
          onClick={async () => {
            if (!status) {
              triggerSave();
              setStartSave(true)
              const result = await saveData();
              setStartSave(false)
              setIsResult(result);
            }
          }}
          disabled={status || startSave}
        >
          {status || startSave ? (
            <img src="/gif/pulsegif.gif" width={20} height={20} alt="Saving" className="opacity-80" />
          ) : (
            <>
              <SaveIcon sx={{ fontSize: 18 }} />
              <span className="hidden md:inline">{SAVE}</span>
            </>
          )}
        </button>
      </div>

      {/* --- Floating Sidebar Toggle (Mobile/Desktop) --- */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-4 right-4 z-40 p-3 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-bot-theme rounded-full shadow-lg hover:shadow-bot-theme/20 hover:scale-110 transition-all duration-300"
        >
          <WidgetsIcon />
        </button>
      )}

      {/* --- Floating Glass Sidebar --- */}
      <div
        className={`
          chatbot-window
          fixed top-0 right-0 z-50
          h-full w-auto 
          md:top-4 md:right-2 md:h-[calc(100vh-32px)] md:w-60 md:rounded-2xl
          bg-[#0f172a]/95 md:bg-[#0f172a]/80 backdrop-blur-xl border-l md:border border-slate-700/50 shadow-2xl
          transition-transform duration-500 ease-in-out cubic-bezier(0.25, 0.8, 0.25, 1)
          flex flex-col overflow-hidden
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[120%]'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700/50 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <WidgetsIcon className="text-bot-theme" />
            <span className="font-bold text-slate-200 tracking-wide">Components</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg p-1 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Sidebar Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="w-1 h-4 bg-[#0FAB49] rounded-full shadow-[0_0_8px_#0FAB49]"></span>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{ICON_TITLE1}</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xxm">
              {messageIcons.map((item) => (
                <DraggableItem 
                  key={item.type} 
                  {...item} 
                  nodeType="customNode" 
                  color="#0FAB49" 
                />
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="w-1 h-4 bg-[#e879f9] rounded-full shadow-[0_0_8px_#FF1493]"></span>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{ICON_TITLE2}</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xxm">
              {replayIcons.map((item) => (
                <DraggableItem 
                  key={item.type} 
                  {...item} 
                  nodeType="" 
                  color="#e879f9" 
                />
              ))}
            </div>
          </div>
          <div className="mb-20 md:mb-0">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="w-1 h-4 bg-[rgb(23,196,220)] rounded-full shadow-[0_0_8px_rgb(23,196,220)]"></span>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{ICON_TITLE3}</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xxm">
              {Preference.map((item) => (
                <DraggableItem 
                  key={item.type} 
                  {...item} 
                  nodeType="customNode" 
                  color="rgb(23, 196, 220)" 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChatBotWrapper() {
  return (
    <ReactFlowProvider>
      <SaveEventProvider>
        <ChatBotDetails />
      </SaveEventProvider>
    </ReactFlowProvider>
  );
}





























