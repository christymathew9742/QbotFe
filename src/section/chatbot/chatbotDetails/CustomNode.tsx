"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Handle,
  Position,
  NodeProps,
  useReactFlow,
} from "reactflow";

import { Editor, EditorContent } from '@tiptap/react';
import { createPortal } from "react-dom";
import { Extension } from '@tiptap/core';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import { useSearchParams} from 'next/navigation';
import emojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Plugin } from 'prosemirror-state';
import { Mark } from '@tiptap/core';
import "reactflow/dist/style.css";
import {constantsText} from "../../../constant/constant"
import { Button, IconButton } from "@mui/material";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dialog from '@mui/material/Dialog';
import { messageIcons, replayIcons, Preference, isFileType, updateTempFilesToPermanent, extractFileKeys, mediaTypes } from "@/utils/utils";
import BookIcon from '@mui/icons-material/Book';
import { ReusableFileUploader } from "@/components/fileUploader/fileUploader";
import { CloseFullscreen } from "@mui/icons-material";
import "leaflet/dist/leaflet.css";
import api from "@/utils/axios";
import { AxiosError } from "axios";
import { useSaveEvent } from "@/context/SaveDataContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useStatus } from "@/context/StatusContext";

const {
  BOT:{
    DEFAULT,
    SOURCE_EDGE,
  }
} = constantsText;

interface TimeSlot {
  id?: number;
  start: Date;
  end: Date;
  interval: String;
  date?: String
  buffer: String;
  slots?: any;
}

interface DateSlot {
  date: string;
  slots: TimeSlot[];
}

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

type Input = {
  id: string | any;
  type?: string;
  field?: string;
  value: string | undefined; 
  editor?: any;
  options?: any;
  slots?: any;
  fileData?: any;
}

type CustomNodeData = {
  inputs: Input[];
  label:string;
  nodeCount:number;
  setInputs: (callback: (inputs: Input[]) => Input[]) => void;
  deleteField: (id: string) => void;
};

interface UploadBase {
  name: string;
  type?: string;
  size?: number;
  preview?: string;
  url?: string;
  uploadedAt?: string;
  uploadError?: boolean;
  lat?: number;
  lng?: number;
  key?: string;
  saveToDb?: boolean;
  fileId?: string;
  mId?: string;
}

interface UploadResult extends UploadBase {
  isUploading?: boolean;
  progress?: number;
  location?: any;
}

interface UploadedFile extends UploadBase {
  file?: File;
  uploaded?: boolean;
  serverId?: string;
}

interface Location {
  lat?: number;
  lng?: number;
  name?: string;
  type?: string;
  location?: any;
}

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
                  class: 'bg-highlight-clr py-0.5 px-1 text-node-active w-max rounded',
                });

                transaction.addMark(start, end - 1, backgroundColorMark);
                const nextChar = content[end] || '';
                if (nextChar !== '.' && nextChar !== ' ') {
                  transaction.insertText(".", end);
                }
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
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const { deleteElements, getEdges, setEdges } = useReactFlow();
  const [loadEditor, setLoadEditor] = useState(false);
  const createNewId = Date.now();
  const searchParams = useSearchParams();
  const chatbotId:string | any = searchParams.get('botId'); 
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedBuffer, setSelectedBuffer] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [focusedEditorId, setFocusedEditorId] = useState<string | null>(null);
  const [fileKeys, setFileKeys] = useLocalStorage<string[]>( `${chatbotId}-${id}-deletedFileKeys`,[]);
  const { registerOnSave } = useSaveEvent();
  const { setStatus } = useStatus();
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  const uploadWithRetry = async (
    uploadUrl: string,
    file: File,
    contentType: string,
    onProgress?: (percent: number) => void
  ) => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", contentType);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
              const percent = Math.round((event.loaded / event.total) * 100);
              onProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed with status ${xhr.status}`));
          };

          xhr.onerror = () => reject(new Error("Upload failed due to network error"));
          xhr.send(file);
        });
        return;
      } catch (err) {
        if (attempt < MAX_RETRIES) await new Promise(res => setTimeout(res, RETRY_DELAY));
        else throw err;
      }
    }
  };

  const handleSave = useCallback(async () => {
    if (!chatbotId || !fileKeys?.length) return;
    try {
      await api.delete(`/createbots/${chatbotId}/files`, {
        data: { fileKey: fileKeys, chatbotId },
      });
      setFileKeys([]);
    } catch (err) {
      console.error("Error deleting files:", err);
    }
  }, [chatbotId, fileKeys]);

  useEffect(() => {
    registerOnSave(handleSave);
  }, [registerOnSave, handleSave]);

  const serializeFiles = (
    files: (UploadedFile | Location)[],
    chatbotId: string,
    onProgress?: (updated: UploadResult[]) => void,
    mediaFile?:UploadedFile,
  ): { fileData: UploadResult[]; uploadPromises: Promise<void>[] } => {
    const fileData: UploadResult[] = [];
    const uploadPromises: Promise<void>[] = [];
    const sF = (n: string) => n.replace(/\s+/g,"_").replace(/[^a-zA-Z0-9._-]/g,"").toLowerCase();
    const gUF = (n: string) => sF(`qbot-${Date.now()}-${Math.random().toString(36)?.slice(2,8)}.${n?.split(".").pop()||""}`);

    files.forEach(f => {
      if (f.type === "Location") {
        fileData.push({
          name: f.name ?? '', 
          type: f.type,  
          lat: f.lat,
          lng: f.lng,
          location: `${f.lat}-${f.lng}`,
          fileId: `FI-${Date.now()}`,
        });
        return;
      }

      const fileObj = f as UploadedFile;

      if (!fileObj.file && fileObj.url) {
        fileData.push({
          name: gUF(fileObj.file!?.name) || "Unknown File",
          type: fileObj.type || "File",
          size: fileObj.size || 0,
          preview: fileObj.url,
          key: fileObj.key,
          mId: fileObj.mId,
          fileId: fileObj.fileId,
          url: fileObj.url,
          uploadedAt: fileObj.uploadedAt || new Date().toISOString(),
          isUploading: false,
          saveToDb: fileObj.saveToDb,
        });
        return;
      }

      const fileInfo: UploadResult = {
        name: gUF(fileObj.file!?.name)|| "Unknown File",
        type: fileObj.file?.type || "File",
        size: fileObj.file?.size || 0,
        key: fileObj.key,
        mId: fileObj.mId,
        fileId: fileObj.fileId,
        preview: fileObj.preview || URL.createObjectURL(fileObj.file!),
        isUploading: true,
        saveToDb: false,
        progress: 0, 
      };

      fileData.push(fileInfo);
      onProgress?.([...fileData]);

      const promise = api
        .get(`/createbots/${chatbotId}/upload-url`, {
          params: { filename: gUF(fileObj.file!?.name), contentType: fileObj.file!?.type },
        })
        .then(async ({ data: signedData }) => {
          const { uploadUrl, publicUrl, key } = signedData;
          await uploadWithRetry(uploadUrl, fileObj.file!, fileObj.file!.type, (percent) => {
            fileInfo.progress = percent;
            onProgress?.([...fileData]);
            setStatus(true)
          });

          fileInfo.url = publicUrl;
          fileInfo.preview = publicUrl;
          fileInfo.key = key;
          fileInfo.mId = '';
          fileInfo.fileId = `FI-${Date.now()}`;
          fileInfo.uploadedAt = new Date().toISOString();
          fileInfo.isUploading = false;
          fileInfo.progress = 100;
          onProgress?.([...fileData]);
        })
        .catch(err => {
          console.warn("Upload failed for:", gUF(fileObj.file!?.name), err);
          toast.error(`Upload failed for,${gUF(fileObj.file!?.name)}`);
          fileInfo.uploadError = true;
          fileInfo.isUploading = false;
          onProgress?.([...fileData]);
        });
      uploadPromises.push(promise);
    });

    return { fileData, uploadPromises };
  };

  const handleUploadFile = useCallback(
    async (files: (UploadedFile | Location)[] | any, id: string, mediaFile:UploadResult | any) => {
      const { fileData, uploadPromises } = serializeFiles(files, chatbotId, updated => {

        if (typeof data?.setInputs === "function") {
          data.setInputs((prev: any) =>
            prev.map((input: any) =>
              input.id === id 
                ? { ...input, fileData: updated }
                : input
            )
          );
        } else {
          console.warn("setInputs is not available — skipping update");
        }
      }, mediaFile);

      await Promise.all(uploadPromises);
      setStatus(false)

      if (typeof data?.setInputs === "function") {
        data.setInputs((prev: any) =>
          prev.map((input: any) =>
            input.id === id 
              ? { ...input, fileData }
              : input
          )
        );
      } else {
        console.warn("setInputs is not available — skipping update");
      }
    },
    [chatbotId, data]
  );

  const handleIntervalChange = (event:any) => {
    setSelectedValue(event.target.value);
  };

  const handleBufferChange = (event:any) => {
    setSelectedBuffer(event.target.value);
  };

  const [userTimeZone] = useState<string>(() => 
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedDate(null);
    setStartTime(null);
    setEndTime(null);
    setOpen(false);
  };

  const addTimeSlot = useCallback(() => {
    if (!selectedDate || !startTime || !endTime || !selectedValue) return;

    const now = new Date();
    const dId = Date.now();

    const startDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
      0,
      0
    );

    const endDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
      0,
      0
    );

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (startDateTime <= now || endDateTime <= now || endDateTime <= startDateTime) return;

    const intervalMs = Number(selectedValue) * 60 * 1000;
    const bufferMs = Number(selectedBuffer || 0) * 60 * 1000;
    const totalDuration = endDateTime.getTime() - startDateTime.getTime();
    const totalChildSlots = Math.floor(totalDuration / (intervalMs + bufferMs));

    if (totalChildSlots > 10) {
      const maxSlots = 10;
      const suggestedEndTimeMs = startDateTime.getTime() + maxSlots * (intervalMs + bufferMs);
      const suggestedEndDate = new Date(suggestedEndTimeMs);

      alert(
        `⚠️ Too many child slots!\n\n` +
        `Between ${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })} and ${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}, you would generate approximately ${totalChildSlots} child slots.\n\n` +
        `📌 Suggested common slot:\nStart: ${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}\nEnd: ${suggestedEndDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}\nInterval: ${selectedValue} min\nBuffer: ${selectedBuffer || 0} min\n\n` +
        `Please use this range to keep the number of child slots ≤ 10.`
      );
      return;
    }

    const dateStr = formatDate(selectedDate);
    const newSlot: TimeSlot = {
      id: dId,
      start: startDateTime,
      end: endDateTime,
      interval: selectedValue,
      buffer: selectedBuffer,
    };

    let totalSlotsWithNew = 0;
    data.setInputs((prevInputs: any[]) => {
      return prevInputs.map((input: any) => {
        const existingSlots = input.slots || [];
        const totalExistingSlots = existingSlots.reduce((acc: number, dateEntry: any) => {
          return acc + (dateEntry.slots?.length || 0);
        }, 0);
        totalSlotsWithNew = totalExistingSlots + 1;

        if (totalSlotsWithNew > 10) {
          return input;
        }

        const dateEntry = existingSlots.find((d: any) => d.date === dateStr);
        let updatedSlots;
        if (dateEntry) {
          updatedSlots = existingSlots.map((d: any) =>
            d.date === dateStr
              ? { ...d, slots: [...d.slots, newSlot].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) }
              : d
          );
        } else {
          updatedSlots = [
            ...existingSlots,
            {
              id: dId,
              date: dateStr,
              slots: [newSlot],
            },
          ];
        }

        const serializedDateSlots = updatedSlots
          .map((ds: any) => ({
            date: ds.date,
            slots: ds.slots.map((slot: any) => ({
              id: slot.id,
              start: slot.start instanceof Date ? slot.start.toISOString() : slot.start,
              end: slot.end instanceof Date ? slot.end.toISOString() : slot.end,
              interval: slot?.interval || 0,
              buffer: slot?.buffer || 0,
            })),
          }))
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { ...input, slots: serializedDateSlots };
      });
    });

    if (totalSlotsWithNew > 10) {
      alert(`⚠️ Maximum total slots reached!, Cannot add more than 10 slots.`);
    }

    setStartTime(null);
    setEndTime(null);
    setSelectedValue("");
    setSelectedBuffer("");
  }, [selectedDate, startTime, endTime, selectedValue, selectedBuffer, data]);

  const handleRemoveSlot = (date: string, start: unknown, end: unknown) => {
    data.setInputs((prev) =>
      prev.map((input) => ({
        ...input,
        slots: input.slots
          .map((dateSlot:DateSlot) =>
            dateSlot.date === date
              ? {
                  ...dateSlot,
                  slots: dateSlot.slots.filter(
                    (slot:any) => slot.start !== start || slot.end !== end
                  ),
                }
              : dateSlot
          )
          .filter((dateSlot:DateSlot) => dateSlot.slots.length > 0),
      }))
    );
  };

  const getMinStartTime = () => {
    const now = new Date();
    if (selectedDate && selectedDate.toDateString() === now.toDateString()) {
      return now;
    }
    return new Date(0, 0, 0, 0, 0);
  };

  const getMinEndTime = () => {
    return startTime
      ? new Date(startTime.getTime() + 15 * 60 * 1000)
      : new Date(0, 0, 0, 0, 15);
  };
  
  const handleInputChange = useCallback (
    (inputId: string, value: string, opId: string | null = null) => {
      data.setInputs((prevInputs) =>
        prevInputs.map((input: any) => {
          if (input.id === inputId) {
            if (input.field === 'preference' && 
              Array.isArray(input.options) && 
                (input.type === 'List' || input.type === 'Button')) {
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

  const handleDeleteNode = async (data: CustomNodeData) => {
    try {
      if (!id) throw new Error("Node ID is undefined");
      const edgesToRemove = getEdges().filter(
        (edge) => edge.source === id || edge.target === id
      );
      deleteElements({ nodes: [{ id }], edges: edgesToRemove });

      const fileKey = extractFileKeys(data?.inputs);
      if (!fileKey || fileKey.length < 1) return;

      setFileKeys(fileKey)

    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  const handleDeleteDynamicFields = (fieldId: string, nodeId: string) => {
    try {
      if (data.deleteField) data.deleteField(fieldId);
      const edges = getEdges();
      const nodeEdges = edges.filter(edge => edge.source === nodeId);
      const replayOrMessageInputs =
        data.inputs?.filter(
          (inp: any) =>
            inp.field === "replay" ||
            (inp.field === "messages" && inp.type !== "Text")
        ) || [];

      const lastInput = replayOrMessageInputs[replayOrMessageInputs.length - 1];
      const lastFieldEdge = nodeEdges.find(
        edge =>
          edge.source === nodeId &&
          edge.sourceHandle === `${lastInput?.field}-${SOURCE_EDGE}`
      );

      if (lastInput && lastInput.id === fieldId && lastFieldEdge) {
        deleteElements({ edges: [lastFieldEdge] });
      }

      const fileKey = extractFileKeys(data?.inputs, fieldId);
      if (fileKey?.length) setFileKeys(fileKey);
    } catch (error) {
      console.error("Error in handleDeleteDynamicFields:", error);
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
            Link.configure({
              HTMLAttributes: {
                class: 'text-blue-600 underline max-w-xs',
              },
            }),
          ],
          content: initialContent.length > 4000
            ? initialContent.slice(0, 4000)
            : initialContent,

          onFocus: () => {
            setIsFocused(inputId)
            setFocusedEditorId(inputId);
          },
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

  const addEmoji = (emoji: any) => {
    if (!focusedEditorId) return;
    const editor = editorRefs.current.get(focusedEditorId);
    if (!editor) return;
    editor.chain().focus().insertContent(emoji.native).run();
  };

  const onDropInput = (event: React.DragEvent, nodeIndex:number) => {
    event.preventDefault();
    event.stopPropagation();
  
    const inputDataStr = event.dataTransfer.getData("application/reactflow-node");
    if (!inputDataStr) return;

    try {
      const { type, field } = JSON.parse(inputDataStr);

      const mediaInputs = (data?.inputs || []).filter((input: any) => {
        return mediaTypes?.includes(input?.type);
      });
      
      if ( field === "messages" &&  mediaTypes?.includes(type) && nodeIndex === 0 && data?.inputs?.length === 0 ) {
        toast.error("Media/Location not allowed as first block!");
        return;
      }

      if (mediaInputs?.length >= 5 && mediaTypes.includes(type) ) {
        toast.error("Maximum 5 Media/Location blocks are allowed!");
        return;
      }

      const newNodeId = `${id}-input-${createNewId}`;
      const hasPreferenceAlready = data.inputs.some(
        (input) => input.field === "preference"
      );
  
      if (hasPreferenceAlready) return;

      if (field === "preference" && data.inputs.length > 0) return;

      const newInput: Input = {
        id: newNodeId,
        type,
        field: field || "messages",
        options: [],
        value: field !== "preference" ? "" : undefined,
      };
  
      createEditor(newInput.id, field === "replay" ? "Collect:" : "");
      data.setInputs((prevInputs) => [...prevInputs, newInput]);
      
      if (!id && field === "preference") return;
      setEdges(prevEdges =>
        prevEdges.map(edge => {
          if (edge.source !== id) return edge;
          const newId = edge.id.replace(/\b(replay|messages)\b/g, field);
          return {
            ...edge,
            id: newId,
            sourceHandle: `${field}-${SOURCE_EDGE}`,
          };
        })
      );
    } catch (error) {
      console.error("Error parsing input data:", error);
      toast.error("Failed to drop input, please try again!");
    }
  };
  
  const handleAddOptions = (index: number, id: string) => {
    const preference: any = {
      id: createNewId,
      field: "preference",
      value: "",
    };
  
    data.setInputs((prevEditors) => {
      return prevEditors.map((editor, i) => {
        if (
          i === index &&
          editor.field === "preference" &&
          (editor.type === "List" || editor.type === "Button") &&
          editor.id === id
        ) {
          const existingOptions = editor.options || [];
          const newOptions = [...existingOptions, preference]; 
          return {
            ...editor,
            options: newOptions,
          };
        }
        return editor;
      });
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

  const FieldIndex = data.inputs.findLastIndex(
    input => input.field === 'replay' || (input.field === 'messages' && input.type !== 'Text')
  );

  const renderPreferenceOptions = useCallback(
    (options: any[], id: string, type: string, index: number) => {
      const maxOptions = type === "List" ? 10 : type === "Button" ? 3 : Infinity;
      const optionsCount = options.length - 1; 
  
      return options.map((option: any, opIndex: number) => (
        <div key={`option-${id}-${option.id}`} className="relative flex mb-2">
          {opIndex > 0 && (
            <Handle
              type="source"
              id={`option-${option.id}-${id}`}
              position={Position.Right}
              className="absolute !right-[-25px] top-1/2 text-[10px] !w-[8px] !h-[8px] !bg-node-active !border-2 !border-solid !border-op-handil"
            />
          )}
          <input
            type="text"
            className={`px-2 py-[2px] bg-white rounded-l-md w-full text-xxxs focus:outline-none hover:outline-none border border-solid ${
              opIndex > 0 ? " border-red-200 dark:border-[#fb2c3657]" : "border-blue-200 dark:border-blue-500"
            } dark:text-dark-text dark:bg-black dark:borde-[1px]`}
            placeholder = {
              opIndex > 0
                ? `${type.charAt(0)}${type.slice(1).toLowerCase()} option-${opIndex}`
                : "Title"
            }
            value={option?.value}
            maxLength={opIndex > 0 ? 20 : 1024}
            onChange={(e) => handleInputChange(id, e.target.value, option?.id)}
          />
          {opIndex < 1 ? (
            <button
              className={`px-2 py-[1px] rounded-r-md bg-blue-500 text-white ${optionsCount >= maxOptions && "!bg-blue-300"}`}
              onClick={() => handleAddOptions(index, id)}
              disabled={optionsCount >= maxOptions}
            >
              <AddBoxIcon className="!text-xxxs dark:text-dark-text mb-1" />
            </button>
          ) : (
            <button
              className="bg-[#fb2c36] text-white px-2 py-[1px] rounded-r-md"
              onClick={() => handleDeleteOptions(option?.id, index, id)}
            >
              <DeleteIcon className="!text-xxxs dark:text-dark-text mb-1" />
            </button>
          )}
        </div>
      ));
    },
    [handleInputChange, handleAddOptions, handleDeleteOptions]
  );

  const renderSlotOptions = useCallback(
    (id: string, savedSlots: any) => {
      return (
        <div className="p-2">
          <Handle
            type="source"
            id={`slot-${savedSlots?.id}-${id}`}
            position={Position.Right}
            className="absolute !right-[-10px] top-1/2 text-[10px] !w-[8px] !h-[8px] !bg-node-active !border-2 !border-solid !border-op-handil"
          />
          <span className="flex items-center justify-center p-1 border-1 border-[rgb(134,219,231)] rounded-lg transition m-auto w-[50%] !opacity-[50]">
            <BookIcon
              onClick={handleOpen}
              className="!text-[30px] !transition-transform !duration-200 !ease-in-out hover:scale-110 hover:text-[#8adfea] text-[rgb(134,219,231)] cursor-pointer"
            />
          </span>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            sx={{
              "& .MuiDialog-paper": {
                width: "100%",
                height: "1000px",
                borderRadius: "10px",
              },
            }}
          >
            <div className="flex py-1 px-4 items-center justify-between w-full">
              <div className="text-lg font-medium text-color-primary-light dark:text-dark-text dark:font-normal">
                Set your Availability
              </div>
              <CloseFullscreen
                className="cursor-pointer mt-2 !text-lg text-color-primary-light dark:dark:text-dark-text hover:scale-110 transition-transform duration-200 font-light"
                onClick={handleClose}
              />
            </div>
            <hr className="mb-3 mt-2 border-0.5 border-divider dark:border-custom-border" />
            <div className="flex items-center gap-2  p-4">
              <div className="text-xs font-medium text-gray-800 dark:text-dark-text dark:font-normal">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Pick a Date"
                  minDate={new Date()}
                  className="w-[100%] focus:outline-none focus:border-none focus:shadow-none"
                  popperPlacement="bottom-end"
                />
              </div>
              <div className="text-xs font-medium text-gray-800 dark:text-dark-text dark:font-normal">
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={5}
                  dateFormat="h:mm aa"
                  placeholderText="Start Time"
                  minTime={getMinStartTime()}
                  maxTime={new Date(0, 0, 0, 23, 59)}
                  className="w-[100%] focus:outline-none focus:border-none focus:shadow-none"
                />
              </div>
              <div className="text-xs font-medium text-gray-800 dark:text-dark-text dark:font-normal">
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={5}
                  dateFormat="h:mm aa"
                  placeholderText="End Time"
                  minTime={getMinEndTime()}
                  maxTime={new Date(0, 0, 0, 23, 59)}
                  className="w-[100%] focus:outline-none focus:border-none focus:shadow-none"
                />
              </div>
              <div>
                <input
                  value={selectedValue}
                  placeholder="Interval"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleIntervalChange(e);
                    }
                  }}
                  className="w-[100%] focus:outline-none focus:border-none focus:shadow-none border-none text-xs font-medium text-gray-800 dark:text-dark-text dark:font-normal"
                />
              </div>
              <div>
                <input
                  value={selectedBuffer}
                  placeholder="Buffer"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleBufferChange(e);
                    }
                  }}
                  className="w-[100%] focus:outline-none focus:border-none focus:shadow-none border-none text-xs font-medium text-gray-800 dark:text-dark-text dark:font-normal"
                />
              </div>
              <div className="dark:border-1 dark:border-custom-border rounded-[4px]">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={addTimeSlot}
                  disabled={
                    !selectedDate || !startTime || !endTime || !selectedValue
                  }
                  className="w-[100%] !p-0 !font-normal !text-lg dark:!text-node-pop"
                >
                  +
                </Button>
              </div>
            </div>
            <hr className="mb-3 mt-2 border-0.5 dark:border-custom-border border-divider justify-center m-auto w-[95%]" />
            <div className="overflow-y-auto custom-scrollbar h-[350px]">
              {savedSlots?.length > 0 ? (
                <div className="space-y-2 mt-0 px-10">
                  <p className="text-lg font-medium text-center text-color-primary-light dark:text-dark-text dark:font-normal">
                    Common availability
                  </p>
                  {savedSlots?.map((ds: DateSlot, dateIdx: number) => {
                    const totalIndividualSlots = ds?.slots?.reduce((acc, slot) => {
                      const start:any = new Date(slot.start);
                      const end:any = new Date(slot.end);
                      const diffMinutes = (end - start) / (1000 * 60);
                      const interval = Number(slot?.interval) || 0;
                      const buffer = Number(slot?.buffer) || 0;
                      const totalSingle =
                        interval > 0 ? Math.floor(diffMinutes / (interval + buffer)) : 0;
                        return acc + totalSingle;
                    }, 0);
                    return (
                      <div key={dateIdx} className="p-2 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="w-[40%] font-medium text-base text-color-primary-light dark:text-dark-text dark:font-normal">
                            {new Date(ds.date).toLocaleDateString([], {
                              day: "2-digit",
                              month: "short",
                            })} :
                          </h3>
                          <p className="w-[60%] text-xxs mt-6 font-medium text-gray-600 dark:text-dark-text dark:font-normal">
                            Total Slots: {totalIndividualSlots}
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {ds?.slots?.map((slot, slotIdx) => (
                            <li
                              key={slotIdx}
                              className="flex justify-between items-center gap-1 w-full"
                            >
                              <span className="flex justify-between items-center w-[80%] px-18 py-[1px] rounded-[4px] bg-gray-50 border border-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-node-pop">
                                <span className="font-medium text-color-primary-light dark:text-dark-text text-sm dark:font-normal">
                                  {new Date(slot.start).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: userTimeZone,
                                  })}
                                </span>{" "}
                                -{" "}
                                <span className="font-medium text-color-primary-light dark:text-dark-text text-sm dark:font-normal">
                                  {new Date(slot.end).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: userTimeZone,
                                  })}
                                </span>
                              </span>
                              <span className="flex justify-center text-sm text-color-primary-light items-center w-[10%] px-8 py-[3px] rounded-[4px] dark:text-dark-text bg-gray-50 border border-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03] dark:font-normal">
                                {slot?.interval}
                              </span>
                              <span className="flex justify-center text-sm text-color-primary-light items-center w-[10%] px-8 py-[3px] rounded-[4px] dark:text-dark-text bg-gray-50 border border-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03] dark:font-normal">
                                {slot?.buffer}
                              </span>
                              <button
                                className="text-white font-medium text-base rounded-[4px] bg-red-500 border border-red-500 shadow-sm p-[1px] w-[10%] dark:border-red-900 dark:bg-red-900 dark:font-normal"
                                onClick={() =>
                                  handleRemoveSlot(ds.date, slot.start, slot.end)
                                }
                              >
                                <span className="inline-block transition-transform duration-200 ease-in-out hover:scale-110">
                                  X
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-2xl font-extralight text-center text-color-primary-light dark:text-dark-text">
                    Slot not found!
                  </p>
                </div>
              )}
            </div>
            <hr className="mb-3 mt-2 border-0.5 dark:border-custom-border border-divider" />
          </Dialog>
        </div>
      );
    },
    [open, selectedDate, handleOpen, handleRemoveSlot, userTimeZone]
  );
  
  const RenderDynamicField = (nodeId:string) => {
    const renderFieldPreference  = (
      id:string, 
      options:any, 
      index:number,
      type:any,
      slots: any,
    ) => {
      switch (type) {
        case 'List':
          return renderPreferenceOptions(options, id, type, index)
        case 'Slot':
          return renderSlotOptions(id, slots)
        case 'Button':
          return  renderPreferenceOptions(options, id, type, index)
        default:
          return <div>Unsupported field type!</div>;
      }
    };

    function renderToolbarSections(editor:any, field:string) {
      return buttonConfigs.map(({ icon, action, isActive }, tbIndex) => (
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
            className={`${
              editor.isActive(isActive)
                ? `active-editor-bi-${field}`
                : `disable-editor-bi-${field}`
            }`}
            sx={{
              padding: '5px',
              fontWeight: editor.isActive(isActive) ? 'bold' : 'normal',
            }}
          >
            {React.cloneElement(icon, {
              sx: {
                fontSize: '16px',
                color: editor.isActive(isActive) ? '#272323' : 'inherit',
              },
            })}
          </IconButton>
        </div>
      ));
    }

    const handleFileDelete = useCallback (
      async (file: UploadResult) => {
        const fileKey = file?.key;
        
        if (!fileKey) {
          console.warn("No file key found — cannot delete file.");
          return;
        }

        try {
          await api.delete(`/createbots/${chatbotId}/files`, {
            data: { fileKey, chatbotId },
          });
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;
          if (err.response) {
            console.error("File delete failed:", err.response.data?.message);
          } else if (err.request) {
            console.error("Network error: No response from server.", err.request);
          } else {
            console.error("Error setting up delete request:", err.message);
          }
        }
      },
      [chatbotId]
    );

    function renderUploadSctions(fileData: UploadResult[], type: string, accept?: string, id?:string | any, maxFiles?:number) {
      return (
        <ReusableFileUploader
          accept={accept}
          maxFiles={maxFiles}
          value={fileData || []}
          type={type}
          onFileDelete={handleFileDelete}
          onChange={(files) => handleUploadFile(files, id, fileData)}
        />
      );
    }

    const renderFieldInputs = (
      id:string, 
      editor:any, 
      field:string, 
      type: string,
      fileData:any, 
      isEdge:boolean = false, 
      nodeId:string,
    ) => {
      const edge =  `${field}-${SOURCE_EDGE}`;
      const allIcons = [...messageIcons, ...replayIcons];
      const getIconByType = () => {
        const found = allIcons.find((item) => item.type === type && item.field === field);
        return found && !isFileType(type)  ? found.icon : null;
      };
      return (
        <div
          id={`editor-${id}`}
          className="relative inputs tiptap-editor-container nodrag cursor-text text-left dark:text-dark-text"
        >
          {isEdge && (
            <Handle
              type="source"
              id={edge}
              position={Position.Right}
              className={`absolute !right-[-13px] top-1/2 text-[10px] !w-[8px] !h-[8px] !bg-node-active !border-2 !border-solid ${field === 'replay' ? '!border-[#f069b1]' : '!border-[#0FAB49]'}`}
            />
          )}
          {isFocused === id ? (
            <div className="grid grid-cols-8 gap-x-1 border-b border-divider dark:border-dark-border-tiptap pb-0">
              {renderToolbarSections(editor, field)}
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowEmojiPicker((prev) => !prev);
                }}
                className="ml-2 text-xxs mb-0.5"
              >
                😊
              </button>
              {showEmojiPicker &&
                createPortal(
                  <div 
                    className="fixed inset-0 bg-opacity-10 bg-[#00000061] z-[9998]"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] shadow-lg mb-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Picker data={emojiData} onEmojiSelect={addEmoji} />
                    </div>,
                  </div>,
                  document.body
                )
              }              
            </div>
          ) : (
            <>
              <p className="text-drag-text absolute left-0.5 -top-1 !opacity-50">
                {getIconByType()}
              </p>
              <p
                className="text-drag-text absolute -right-1 -top-1 text-[8px] hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out p-1 cursor-pointer opacity-0"
                onClick={() =>  handleDeleteDynamicFields(id, nodeId)}
              >
                ❌
              </p>
            </>
          )}
          <div className="mt-2">
            {(() => {
              switch (type) {
                case 'Image':
                  return renderUploadSctions(fileData, type, 'image/*', id, 5);
                case 'Video':
                  return renderUploadSctions(fileData, type, 'video/*', id, 2);
                case 'Audio':
                  return renderUploadSctions(fileData, type, 'audio/*', id, 2);
                case 'Doc':
                  return renderUploadSctions(
                    fileData,
                    type,
                    'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    id,
                    5
                  );
                case 'Location':
                  return renderUploadSctions(fileData, type,'', id);
                default:
                  return <EditorContent editor={editor} className="qbot-editor" />;
              }
            })()}
          </div>
        </div>
      );
    };

    const renderField = (
      id:string, 
      field:string | any, 
      options:void, 
      editor:any, 
      index:number, 
      isEdge:boolean,
      type:any,
      slots: any,
      fileData: any,
      nodeId:string,
    ) => {
      switch (field) {
        case 'preference':
          return renderFieldPreference(id, options, index, type, slots);
        case 'messages':
          return renderFieldInputs(id, editor, field, type, fileData, isEdge, nodeId);
        case 'replay':
          return renderFieldInputs(id, editor, field, type, fileData, isEdge, nodeId);
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
          options,
          type,
          slots,
          fileData,
        }, index) => {
          const editor = editorRefs.current.get(id);
          if (!editor) return null;
          const isEdge = FieldIndex === index && (field === "replay" || (field === "messages" && type !== "Text"));

          const getIconByType = () => {
            const found = Preference.find((item) => item.type === type && item?.field === 'preference');
            return found ? found.icon : null;
          };
  
          return (
            <div
              key={`${field}-editor-${id}`}
              className={`flex flex-col rounded-md ${field === 'preference' && type !== 'Slot' ? 'py-6 px-4' : 'p-1'} ${
                isFocused === id ? `border-${field}-node` : `${field}-node-normal relative`
              }`}
            > 
              {field === 'preference' && type !== "Slot" && (
                <p
                  className="text-drag-text absolute left-1 -top-0.5 !opacity-50"
                >
                  {getIconByType()}
                </p>
              )}
              {loadEditor && renderField(id, field, options, editor, index, isEdge, type, slots, fileData, nodeId)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="rounded w-40" onDrop={(event) => onDropInput(event, data?.nodeCount)} onDragOver={onDragOver}>
        <div className="nodes">
          <h2 className={`${!data.inputs.length ? "text-center" : "text-left"} font-semibold text-sm font-sans mb-2 text-color-primary dark:text-dark-text`}>
            {!data.inputs.length ? DEFAULT : data.label}
          </h2>
          <Handle id={`target-${data.inputs.length}`} type="target" position={Position.Left} className="absolute -!right-3 !top-4 !h-7 opacity-0" />
          {data.nodeCount > 1 && (
            <span 
              className="node-x absolute right-1 top-1 text-xxss hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out p-1 cursor-pointer opacity-0" 
              onClick={() => handleDeleteNode(data)}
            >
              ❌ 
            </span>
          )}
        </div>
        {RenderDynamicField(id)}
      </div>
    </>
  );
};

export default CustomNode;



