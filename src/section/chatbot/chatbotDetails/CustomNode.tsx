"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Handle,
  Position,
  NodeProps,
  useReactFlow,
} from "reactflow";

import { Editor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { 
  faTrash, 
} from '@fortawesome/free-solid-svg-icons';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import Youtube from "@tiptap/extension-youtube";
import { Plugin } from 'prosemirror-state';
import { Mark } from '@tiptap/core';
import "reactflow/dist/style.css";
import {constantsText} from "../../../constant/constant"
import { IconButton } from "@mui/material";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import { toast } from "react-toastify";

const {
  BOT:{
    DEFAULT,
  },
} = constantsText;

type Input = {
  id: string | any;
  type?: string;
  field?: string;
  value: string | undefined; 
  editor?: any;
  options?: any;
}

type CustomNodeData = {
  inputs: Input[];
  label:string;
  nodeCount:number;
  setInputs: (callback: (inputs: Input[]) => Input[]) => void;
  deleteField: (id: string) => void;
};

const BackgroundColorMark = Mark.create({
  name: 'backgroundColor',
  addAttributes() {
    return {
      backgroundColor: {
        default: '#FF1493',
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
      },
      class: {
        default: 'bg-highlight-clr p-0.1 text-node-active w-max rounded',
        parseHTML: (element) => element.getAttribute('class') || '',
        renderHTML: (attributes) => {
          return { class: attributes.class };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style*="background-color"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
});

const HighlightMarker = Extension.create({
  name: 'highlightMarker',
  addExtensions() {
    return [BackgroundColorMark];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            input: (view) => {
              const content = view.state.doc.textContent;
              const transaction = view.state.tr;
              const regex = /\[([^\]]+)]\s/g;
              let match;

              while ((match = regex.exec(content)) !== null) {
                const start = match.index + 1;
                const end = start + match[0].length;
                const backgroundColorMark = view.state.schema.marks.backgroundColor.create({
                  class: 'bg-highlight-clr p-0.1 text-node-active w-max rounded',
                });

                transaction.addMark(start, end - 1, backgroundColorMark);
              }

              if (transaction.docChanged) {
                view.dispatch(transaction);
              }
              return false;
            },
          },
        },
      }),
    ];
  },
});

const buttonConfigs = [
  { icon: <FormatBoldIcon />, action: 'toggleBold', isActive: 'bold' },
  { icon: <FormatItalicIcon />, action: 'toggleItalic', isActive: 'italic' },
];

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, id }) => {
  const editorRefs = useRef<Map<string, Editor>>(new Map());
  const handilRef = useRef<number | null>(null);
  // const [highlightedEditors, setHighlightedEditors] = useState(new Set());
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const { deleteElements, getEdges } = useReactFlow();
  const [loadEditor, setLoadEditor] = useState(false);
  const createNewId = Date.now();

  const handleInputChange = useCallback(
    (inputId: string, value: string, opId: string | null = null) => {
      data.setInputs((prevInputs) =>
        prevInputs.map((input: any) => {
          if (input.id === inputId) {
            if (input.field === 'preference' && Array.isArray(input.options)) {
              const updatedOptions = input.options.map((option: any) => {
                if (option.id === opId) {
                  return { ...option, value };
                }
                return { ...option };
              });
              return { ...input, options: updatedOptions };
            }
            return { ...input, value };
          }
          return { ...input };
        })
      );
    },
    [data]
  );
  
  const handleDeleteNode = () => {
    const edgesToRemove = getEdges().filter(
      (edge) => edge.source === id || edge.target === id
    );
    deleteElements({ nodes: [{ id }], edges: edgesToRemove });
  };

  const handleDeleteDynamicFields = (fieldId: string) => {
    const edgeIndex = handilRef.current;
    if (data.deleteField) {
      data.deleteField(fieldId);
    }
    if (edgeIndex === 1) {
      const edgesToRemove = getEdges().filter(
        (edge) => fieldId.includes(edge.source) && edge.sourceHandle === 'replay-source-edge'
      );
      deleteElements({ edges: edgesToRemove });
    }
  };
  
  const createEditor = (inputId: string, initialContent: string = "") => {
    try {
      if (!editorRefs.current.has(inputId)) {
        const editor = new Editor({
          extensions: [
            StarterKit,
            Highlight,
            Typography,
            HighlightMarker,
            Image,
            Youtube.configure({ controls: false, nocookie: true }),
          ],
          content: initialContent,
          onFocus: () => setIsFocused(inputId),
          onBlur: () => setIsFocused(null),
        });
        editorRefs.current.set(inputId, editor);
      }
      return editorRefs.current.get(inputId);
    } catch (error) {
      console.error("Editor initialization failed:", error);
      toast.error("Editor initialization failed, please try again!");
    }
  };

  const onDropInput = (event: React.DragEvent) => {
    event.preventDefault();
    const inputDataStr = event.dataTransfer.getData("application/reactflow-input");
    if (!inputDataStr) return;
    try {
      const { type, field } = JSON.parse(inputDataStr);
      const newNodeId = `${id}-input-${createNewId}`;
      let options: Input | undefined;
      if (field === "preference") {
        options = {
          id: createNewId,
          type,
          field,
          value: "",
        };
      }
      const newInput: Input = {
        id: newNodeId,
        type,
        field: field || "messages",
        options: options ? [options] : [],
        value: field !== "preference" ? "" : undefined,
      };

      createEditor(newInput.id);
      data.setInputs((prevInputs) => [...prevInputs, newInput]);
    } catch (error) {
      console.error("Error parsing input data:", error);
      toast.error("Failed to drop input, please try again!");
    }
  };

  const handleAddEditor = (index: number, id: string) => {
    const preference: any = {
      id: createNewId,
      field: "preference",
      value: "",
    };
  
    data.setInputs((prevEditors) => {
      const updatedEditors = [...prevEditors];
      if (prevEditors[index]?.field === "preference" && prevEditors[index]?.id === id) {
        const existingOptions = updatedEditors[index].options || [];
        const optionsMap = new Map(existingOptions.map((opt: any) => [opt.id, opt]));
        optionsMap.set(preference.id, preference);
        updatedEditors[index].options = Array.from(optionsMap.values());
      }
      return updatedEditors;
    });
  };

  const handleDeleteOptions = (
    ids: string = "",
    index: number,
    groupId: string,
  ) => {
    data.setInputs((prevEditors) => {
      const updatedEditors = [...prevEditors];
      updatedEditors[index] = {
        ...updatedEditors[index],
        options: updatedEditors[index].options.filter((opt: any) => opt.id !== ids)
      };
      return updatedEditors;
    });
    const edgesToRemove = getEdges().filter((edge) => edge.sourceHandle === `option-${ids}-${groupId}`);
    deleteElements({ edges: edgesToRemove });
  };
  
  const onDragOver = (event: React.DragEvent) => event.preventDefault();
  data.inputs.forEach((input) => {
    let editor = editorRefs.current.get(input.id);
    if (!editor) {
      editor = createEditor(input.id, input.value);
    }
    if (editor) {
      editor.off("update");
      editor.on("update", () => {
        const updatedContent = editor.getHTML();
        if (updatedContent !== input.value) {
          handleInputChange(input.id, updatedContent);
        }

        // if (!input.value) {
        //   handleInputChange(input.id, updatedContent);
        //   setHighlightedEditors((prev) => {
        //     const updatedSet = new Set(prev);
        //     updatedSet.delete(input.id);
        //     return updatedSet;
        //   });
        // } else {
        //   setHighlightedEditors((prev) => new Set(prev).add(input.id));
        // }
      });
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoadEditor(true);
    }, 0);
    return () => {
      editorRefs.current.forEach((editor) => editor.destroy());
      editorRefs.current.clear();
    };
  }, []);

  const FieldIndex = data.inputs.reduce((lastIndex, input, currentIndex) => {
    if (input.field === 'replay') {
      return currentIndex;
    }
    return lastIndex;
  }, -1);

  const RenderDynamicField = () => {
    const renderFieldPreference  = (
      id:string, 
      options:any, 
      index:number
    ) => {
      return options.map((option:any, opIndex:number) => (
        <div key={`option-${id}-${option.id}`} className="relative flex mb-2">
          {opIndex > 0 && (
            <Handle
              type="source"
              id={`option-${option.id}-${id}`}
              position={Position.Right}
              className="absolute !right-[-12px] top-1/2 text-[10px] !w-[8px] !h-[8px] !bg-node-active !border-2 !border-solid !border-op-handil"
            />
          )}
          <input
            type="text"
            className={`px-2 py-[2px] bg-white rounded-l-md w-full text-xxxs focus:outline-none hover:outline-none border border-solid ${opIndex > 0 ? "dark:border-red-500" : "dark:border-blue-500"} dark:text-dark-text dark:bg-black dark:borde-[1px]`}
            placeholder={`${opIndex > 0 ? `option-${opIndex}` : "Title"}`}
            value={option?.value}
            onChange={(e) => handleInputChange(id, e.target.value, option?.id)}
          />
          {opIndex < 1 ? (
            <button
              className="bg-blue-500 text-white px-2 py-[1px] rounded-r-md"
              onClick={() => handleAddEditor(index, id)}
            >
              <AddBoxIcon className="!text-xxxs dark:text-dark-text" />
            </button>
          ) : (
            <button
              className="bg-red-500 text-white px-2 py-[1px] rounded-r-md"
              onClick={() => handleDeleteOptions(option?.id, index, id)}
            >
              <DeleteIcon className="!text-xxxs dark:text-dark-text" />
            </button>
          )}
        </div>
      ));
    };
  
    const renderFieldMessages = (
      id:string, 
      editor:any, 
      field:string, 
      isReplay:boolean = false,
    ) => {
      return (
        <div
          id={`editor-${id}`}
          className="relative tiptap-editor-container nodrag cursor-text text-left dark:text-dark-text"
        >
          {isReplay && (
            <Handle
              type="source"
              id={`replay-source-edge`}
              position={Position.Right}
              className="absolute !right-[-13px] top-1/2 text-[10px] !w-[8px] !h-[8px] !bg-node-active !border-2 !border-solid !border-[#f069b1]"
            />
          )}
          {isFocused === id && (
            <div className="grid grid-cols-8 gap-x-1">
              {buttonConfigs.map(({ icon, action, isActive }, tbIndex) => (
                <div
                  key={`messages-toolbar-${id}-${tbIndex}`}
                  className="ml-2 flex items-center justify-center space-x-1"
                >
                  <IconButton
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor?.chain().focus()[action]().run();
                    }}
                    className={`${ editor.isActive(isActive) ? `active-editor-bi-${field}` : `disable-editor-bi-${field}`}`}
                    sx={{
                      padding: '5px',
                      fontWeight: editor.isActive(isActive) ? 'bold' : 'normal'
                    }}
                  >
                    {React.cloneElement(icon, {
                      sx: { fontSize: "16px", color: editor.isActive(isActive) ? "#272323" : "inherit" },
                    })}
                  </IconButton>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-drag-text absolute -right-1 -top-1 text-xxxs hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out p-1 cursor-pointer"
                    onMouseDown={() => handleDeleteDynamicFields(id)}
                  />
                </div>
              ))}
            </div>
          )}
          <EditorContent editor={editor}  className="qbot-editor" />
        </div>
      );
    };
  
    const renderField = (
      id:string, 
      field:string | any, 
      options:void, 
      editor:any, 
      index:number, 
      isReplay:boolean
    ) => {
      switch (field) {
        case 'preference':
          return renderFieldPreference(id, options, index);
        case 'messages':
          return renderFieldMessages(id, editor, field);
        case 'replay':
          return renderFieldMessages(id, editor, field, isReplay,);
        default:
          return <div>Unsupported field type</div>;
      }
    };
  
    return (
      <div className="flex flex-col gap-2">
        {data.inputs.filter(({ id }) => editorRefs.current.has(id))
        .map(({ 
          id, 
          field, 
          options
        }, index) => {
          const editor = editorRefs.current.get(id);
          if (!editor) return null;
          const isReplay = FieldIndex === index && field === "replay";
          if (isReplay) handilRef.current = index;
  
          return (
            <div
              key={`${field}-editor-${id}`}
              className={`flex flex-col rounded-md p-${field === 'preference' ? '4' : '1'} ${
                isFocused === id ? `border-${field}-node` : `${field}-node-normal`
              }`}
            >
              {loadEditor && renderField(id, field, options, editor, index, isReplay)}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="group rounded w-44" onDrop={onDropInput} onDragOver={onDragOver}>
      <h2 className={`${!data.inputs.length ? "text-center" : "text-left"} font-semibold text-sm font-sans mb-2 text-text-theme dark:text-dark-text`}>
        {!data.inputs.length ? DEFAULT : data.label}
      </h2>
      <Handle id={`target-${data.inputs.length}`} type="target" position={Position.Left} className="absolute -!right-3 !top-4 !h-7 opacity-0" />
      {data.nodeCount > 1 && (
        <FontAwesomeIcon
          icon={faTrash}
          className="text-drag-text absolute right-1 top-1 text-xxxs hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out p-1 cursor-pointer opacity-0 group-hover:opacity-100"
          onClick={handleDeleteNode}
        />
      )}
        {RenderDynamicField()}
    </div>
  );
};

export default CustomNode;

