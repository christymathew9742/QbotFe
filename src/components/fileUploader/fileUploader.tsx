"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineUpload, AiOutlineCloudUpload } from "react-icons/ai";
import Dialog from "@mui/material/Dialog";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { allowedExtensions, messageIcons } from "@/utils/utils";
import { useStatus } from "@/context/StatusContext";
import { toast } from "react-toastify";

const LocationPickerInner = dynamic(() => import("@/components/location/Location"), { ssr: false });

// --- Types ---
export interface UploadedFile {
    file: File;
    preview: string;
    uploaded: boolean;
    serverId?: string;
    name?: string;
    type?: any;
    url?: string;
    key?: string;
    progress?: number;
    isUploading?: boolean;
}

type HandleFileChangeProps = {
    e: React.ChangeEvent<HTMLInputElement>;
    accept?: string;
};

interface Location {
    lat?: number;
    lng?: number;
    name?: string;
    type?: string;
}

interface HandleDropProps {
    e: React.DragEvent<HTMLDivElement>;
    accept?: string;
}

interface FileUploadPanelProps {
    accept?: string;
    maxFiles?: number;
    onFileDelete?: (file: UploadedFile | any) => void;
    value?: UploadedFile[] | any;
    type?: string;
    onChange?: (files: UploadedFile[] | Location[]) => void;
}

interface ReusableFileUploaderProps extends FileUploadPanelProps { }

const FileUploadPanel: React.FC<FileUploadPanelProps> = ({
    accept = "*",
    maxFiles,
    onFileDelete,
    value = [],
    type,
    onChange,
}) => {
    const [files, setFiles] = useState<UploadedFile[]>(value);
    const [open, setOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const { status } = useStatus();

    useEffect(() => {
        setFiles(value);
    }, [value]);

    // --- Logic Handlers ---
    const handleFileSelect = (selectedFiles: File[]) => {
        if (maxFiles && files.length + selectedFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files`);
            return;
        }

        const limits: Record<string, number> = {
            image: 25, video: 100, audio: 50, application: 100,
        };

        const validFiles: File[] = [];
        selectedFiles.forEach((file) => {
            const sizeMB = file.size / 1_048_576;
            const typeKey = Object.keys(limits).find((t) => file.type.startsWith(t)) || "other";
            const maxSize = limits[typeKey] || 10;
            if (sizeMB <= maxSize) validFiles.push(file);
            else toast.error(`File "${file.name}" exceeds ${maxSize}MB limit.`);
        });

        const newFiles: UploadedFile[] = validFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            uploaded: false,
            name: file.name,
            type: file.type,
            key: `${file.name}-${Date.now()}`,
            isUploading: false,
            progress: 0,
        }));

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onChange?.(updatedFiles);
    };

    const validateFiles = (files: File[], accept?: string): File[] => {
        const globalAllowed = Object.values(allowedExtensions).flat();
        const allowedTypes = accept ? accept.split(",").map((t) => t.trim().toLowerCase()) : [];

        return files.filter((file) => {
            const ext = file.name.split(".").pop()?.toLowerCase() || "";
            if (!globalAllowed.includes(ext)) return false;
            if (allowedTypes.length === 0) return true;
            return allowedTypes.some((t) => {
                if (t.endsWith("/*")) return file.type.toLowerCase().startsWith(t.replace("/*", ""));
                return file.type.toLowerCase() === t;
            });
        });
    };

    const handleUploadChange = ({ e, accept }: HandleFileChangeProps) => {
        const selectedFiles = Array.from(e.target.files ?? []);
        if (!selectedFiles.length) return;
        const validFiles = validateFiles(selectedFiles, accept);
        if (!validFiles.length) {
            toast.error("Unsupported file type.");
            e.target.value = "";
            return;
        }
        handleFileSelect(validFiles);
    };

    const handleFileChange = ({ e, accept }: HandleFileChangeProps) => handleUploadChange({ e, accept });
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = ({ e, accept }: HandleDropProps) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files ?? []);
        if (!droppedFiles.length) return;
        const validFiles = validateFiles(droppedFiles, accept);
        if (!validFiles.length) {
            toast.error("Unsupported file type.");
            return;
        }
        handleFileSelect(validFiles);
    };

    const handleDelete = useCallback(async (fileObj: UploadedFile, idx: number) => {
        if (!fileObj) return;
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.filter((_, i) => i !== idx);
            if (status) return updatedFiles;
            onChange?.(updatedFiles);
            onFileDelete?.(fileObj);
            if (fileObj.preview) URL.revokeObjectURL(fileObj.preview);
            return updatedFiles;
        });
    }, [onChange, onFileDelete, status]);

    const renderFilePreview = (f: UploadedFile) => {
        if (!f) return null;
        const fileType = f?.type || "";
        const baseClass = `w-full h-full object-cover transition-opacity duration-300 ${f?.isUploading ? "opacity-30 blur-sm" : ""}`;

        if (fileType.startsWith("image/")) return <img src={f.preview} alt={f.name} className={baseClass} />;
        if (fileType.startsWith("video/")) return <video src={f.preview} className={baseClass} />;
        
        const Icon = fileType === "application/pdf" ? DescriptionIcon : InsertDriveFileIcon;
        return (
            <div className="flex flex-col items-center justify-center w-full h-full bg-slate-800 text-slate-400">
                <Icon sx={{ fontSize: 32, color: fileType === "application/pdf" ? "#ef4444" : "#3b82f6", mb: 1 }} />
                <span className="text-[10px] w-5/6 truncate text-center opacity-70">{f?.name}</span>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto pb-0 w-full">
            <div 
                onClick={() => setOpen(true)}
                className={`
                    group/flow relative w-full h-14 flex items-center rounded-xl cursor-pointer transition-all duration-300
                    ${files.length > 0 
                        ? "justify-start pl-3" 
                        : "justify-center border-2 border-dashed border-bot-theme/40 hover:border-bot-theme/60"
                    }
                `}
            >
                {files.length > 0 ? (
                    <div className="flex items-center w-full">
                        <div className="flex -space-x-3 overflow-hidden py-1">
                            {files.slice(0, 4).map((f, i) => (
                                <div 
                                    key={i} 
                                    className="relative w-10 h-10 rounded-full border-2 border-[#0B1120] bg-slate-800 overflow-hidden shadow-md transform transition-transform"
                                    style={{ zIndex: files.length - i }}
                                >
                            {f.type.startsWith('image/') ? (
                                <img src={f.preview} alt="preview" className="w-full h-full object-cover" />
                                ) : f.type.startsWith('video/') ? (
                                    <video 
                                        src={f.preview} 
                                        className="w-full h-full object-cover" 
                                        muted 
                                        playsInline
                                        onMouseOver={(e) => e.currentTarget.play()} 
                                        onMouseOut={(e) => e.currentTarget.pause()} 
                                    />
                                ) : f.type.startsWith('audio/') ? (
                                    <div className="w-full h-full flex items-center justify-center bg-purple-900/50 text-purple-300">
                                        <AudiotrackIcon sx={{ fontSize: 20 }} />
                                    </div>
                                ) : f.type === 'Location' ? (
                                    <div className="w-full h-full flex items-center justify-center border border-white bg-blue-900/50 text-blue-300 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-300">
                                        {f.type.includes('pdf') ? (
                                            <DescriptionIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                                        ) : f.type.includes('word') || f.type.includes('document') ? (
                                            <DescriptionIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                                        ) : (
                                            <InsertDriveFileIcon sx={{ fontSize: 16 }} />
                                        )}
                                    </div>
                                )}
                                </div>
                            ))}
                            {files.length > 4 && (
                                <div 
                                    className="relative w-10 h-10 rounded-full border-2 border-[#0B1120] bg-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-md z-0"
                                >
                                    +{files.length - 4}
                                </div>
                            )}
                        </div>
                        
                        <div className="ml-auto mr-3 text-bot-theme group-hover/flow:text-shadow-bot-theme/60 transition-colors">
                            <AiOutlineCloudUpload size={20} />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-bot-theme/40 group-hover:text-bot-theme/60 transition-colors">
                        <div className="transform group-hover:scale-110 transition-transform duration-300 mb-1">
                            {(messageIcons.find((item: any) => item.type === type) || {}).icon || <AiOutlineCloudUpload size={22} />}
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                            Upload {type}
                        </span>
                    </div>
                )}
            </div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        width: "100%",
                        minWidth: "400px",
                        borderRadius: "16px",
                        backgroundColor: "#0f172a", 
                        border: "1px solid #1e293b",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                    },
                    "& .MuiBackdrop-root": { backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }
                }}
            >
                <div className="flex py-3 px-4 items-center justify-between w-full bg-slate-900/50">
                    <div className="text-lg font-semibold text-slate-200">
                        Upload {type}
                    </div>
                    <CloseFullscreenIcon
                        className="cursor-pointer text-slate-400 hover:text-white hover:scale-110 transition-all duration-200"
                        onClick={() => setOpen(false)}
                        sx={{ fontSize: 20 }}
                    />
                </div>
                <div className="border-t border-b border-slate-800 mb-2 h-full mt-2 bg-[#0f172a]">
                    {type === "Location" ? (
                        <div className="h-[400px] overflow-y-hidden">
                            <LocationPickerInner
                                onSelect={(location: any) => onChange?.([{ ...location, type }])}
                                value={value as Location}
                            />
                        </div>
                    ) : (
                        <div className="p-4 h-[400px] overflow-y-hidden flex flex-col">
                            <label
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e: any) => handleDrop({ e, accept })}
                                className={`
                                    flex flex-col items-center justify-center p-6 border-2 
                                    rounded-xl cursor-pointer w-full transition-all duration-300
                                    ${isDragging
                                        ? "border-cyan-500 bg-cyan-950/20 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]"
                                        : "border-dashed border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800"
                                    }
                                    ${status && '!cursor-not-allowed opacity-50'}
                                `}
                            >
                                <div className={`p-3 rounded-full bg-slate-800 mb-2 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                                    <AiOutlineUpload size={32} className={isDragging ? "text-cyan-400" : "text-slate-400"} />
                                </div>
                                <span className="text-slate-400 font-light text-sm">
                                    Click to select or drag files here
                                </span>
                                <input type="file" multiple accept={accept} className="hidden" onChange={(e) => handleFileChange({ e, accept })} disabled={status} />
                            </label>
                            {files.length > 0 ? (
                                <div className="flex flex-col p-1 flex-1">
                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar h-[210px] content-start">
                                        {files.map((f, idx) => (
                                            <div
                                                key={idx}
                                                className="relative border border-slate-700 bg-slate-800 rounded-lg p-1 flex flex-col items-center h-32 w-32 group shadow-sm hover:border-cyan-500/50 transition-colors"
                                            >
                                                <div className="relative w-full h-full rounded overflow-hidden">
                                                    {renderFilePreview(f)}
                                                </div>
                                                {f?.isUploading && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded backdrop-blur-sm">
                                                        <CircularProgress variant="determinate" value={f?.progress ?? 0} size={24} thickness={4} sx={{ color: '#06b6d4' }} />
                                                        <span className="text-[10px] font-bold text-cyan-400 mt-1">{Math.round(f?.progress ?? 0)}%</span>
                                                    </div>
                                                )}
                                                {!f?.isUploading && !status && (
                                                    <span
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                                        onClick={() => handleDelete(f, idx)}
                                                    >
                                                        <div className="py-1! px-2! rounded-full! bg-red-500 text-white shadow-lg! hover:bg-red-600 hover:scale-110 transition-transform cursor-pointer">
                                                            <DeleteOutlineIcon sx={{ fontSize: 16, marginBottom: 0.5 }} />
                                                        </div>
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[200px] opacity-30 mt-4">
                                    <p className="text-xl font-light text-slate-500">No files selected</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export const ReusableFileUploader: React.FC<ReusableFileUploaderProps> = (props) => {
    return <FileUploadPanel {...props} />;
};







