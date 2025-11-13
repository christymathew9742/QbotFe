"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import Dialog from "@mui/material/Dialog";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { allowedExtensions, messageIcons } from "@/utils/utils";
import { useStatus } from "@/context/StatusContext";
import { toast } from "react-toastify";

const LocationPickerInner = dynamic(() => import("@/components/location/Location"), { ssr: false });

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

interface ReusableFileUploaderProps extends FileUploadPanelProps {}

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

    const handleFileSelect = (selectedFiles: File[]) => {
        if (maxFiles && files.length + selectedFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files`);
            return;
        }

        const limits: Record<string, number> = {
            image: 25,
            video: 100,
            audio: 50,
            application: 100,
        };

        const invalidFiles: string[] = [];
        const validFiles = selectedFiles.filter((file) => {
            const sizeMB = file.size / 1_048_576;
            const typeKey =
            Object.keys(limits).find((t) => file.type.startsWith(t)) || "other";
            const maxSize = limits[typeKey] || 10;

            if (sizeMB > maxSize) {
                const shortName =
                    file.name.length > 25 ? file.name.slice(0, 22) + "..." : file.name;
                invalidFiles.push(`"${shortName}" (${sizeMB.toFixed(1)} MB > ${maxSize} MB)`);
                return false;
            }

            return true;
        });

        if (invalidFiles.length > 0) {
            toast.error(
             `Some files exceed their size limits:\n${invalidFiles.join("\n")}`
            );
            return;
        }

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
        const allowedTypes = accept
            ? accept.split(",").map((type) => type.trim().toLowerCase())
            : [];

        const validFiles = files.filter((file) => {
            const fileType = file.type.toLowerCase();
            const ext = file.name.split(".").pop()?.toLowerCase() || "";

            if (!globalAllowed.includes(ext)) return false;
            if (allowedTypes.length === 0) return true;

            return allowedTypes.some((type) => {
                if (type.endsWith("/*")) {
                    const baseType = type.replace("/*", "");
                    return fileType.startsWith(baseType);
                }
                return fileType === type;
            });
        });
        return validFiles;
    };

    const handleUploadChange = ({ e, accept }: HandleFileChangeProps) => {
        const selectedFiles = Array.from(e.target.files ?? []);
        if (!selectedFiles.length) return;

        const validFiles = validateFiles(selectedFiles, accept);

        if (!validFiles.length) {
            toast.error("Unsupported file type. Please upload valid files only.");
            e.target.value = "";
            return;
        }

        handleFileSelect(validFiles);
    }

    const handleFileChange = ({e,  accept}:HandleFileChangeProps) => {
        handleUploadChange({e, accept} )
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = ({ e, accept }: HandleDropProps) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files ?? []);
        if (!droppedFiles.length) return;

        const validFiles = validateFiles(droppedFiles, accept);

        if (!validFiles.length) {
            toast.error("Unsupported file type. Please upload valid files only.");
            return;
        }

        handleFileSelect(validFiles);
    };

    const handleDelete = useCallback(async (fileObj: UploadedFile, idx: number) => {
        try {
            if (!fileObj) return;

            setFiles(prevFiles => {
                const updatedFiles = prevFiles.filter((_, i) => i !== idx);

                if(status) return updatedFiles;
                
                onChange?.(updatedFiles);

                onFileDelete?.({
                    file: fileObj.file || new File([], fileObj.name || "Unknown File"),
                    preview: fileObj.preview || "",
                    isUploading: fileObj.isUploading || false,
                    serverId: fileObj.serverId || "",
                    name: fileObj.name || fileObj.file?.name || "Unknown File",
                    type: fileObj.type || fileObj.file?.type || "File",
                    url: fileObj.url || "",
                    key: fileObj.key || "",
                });

                if (fileObj.preview) URL.revokeObjectURL(fileObj.preview);
                return updatedFiles;
            });
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }, [onChange, onFileDelete]);

    const renderFilePreview = (f: UploadedFile) => {
        if (!f) return null;

        const fileType = f?.type || "";
        const fileName = f?.name?.toLowerCase() || "";
        const filePreview = f?.preview || "";

        const baseClass = `w-full h-full object-center group-hover:opacity-20 transition-opacity ${
        f?.isUploading ? "opacity-40" : ""
        }`;

        if (fileType.startsWith("image/")) return <img src={filePreview} alt={fileName} className={baseClass} />;
        if (fileType.startsWith("video/")) return <video src={filePreview} controls className={baseClass} />;
        if (fileType === "application/pdf" || fileName.endsWith(".pdf"))
        return <embed src={filePreview} type="application/pdf" className="w-full h-full" />;
        if (
            fileType === "application/msword" ||
            fileType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileName.endsWith(".doc") ||
            fileName.endsWith(".docx")
        )
        return (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-700 text-xs font-medium">
                <DescriptionIcon sx={{ color: "#1565c0", fontSize: 28, mb: 0.5 }} />
                <span className="truncate w-5/6 text-center">{f?.name || "Document"}</span>
            </div>
        );

        return (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-700 text-xs font-medium">
                <InsertDriveFileIcon sx={{ color: "#757575", fontSize: 26, mb: 0.5 }} />
                <span className="truncate w-5/6 text-center">{f?.name || "Unknown File"}</span>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto pb-2">
            <div className="flex items-center justify-center p-1 border-1 border-[rgba(15,171,73,0.42)] rounded-lg transition m-auto w-[50%] !opacity-[50]">
                <div
                    onClick={() => setOpen(true)}
                    className="uplodFields !transition-transform !duration-200 !ease-in-out hover:scale-110 cursor-pointer"
                >
                    {(messageIcons.find((item: any) => item.type === type) || {}).icon || null}
                </div>
            </div>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                sx={{ "& .MuiDialog-paper": { width: "100%", height: "1000px", borderRadius: "10px" } }}
            >
                <div className="flex py-1 px-4 items-center justify-between w-full">
                    <div className="text-lg font-medium text-gray-800 dark:text-dark-text">Upload {type}</div>
                    <CloseFullscreenIcon
                        className="cursor-pointer mt-2 !text-lg text-gray-400 dark:text-dark-text hover:scale-110 transition-transform duration-200 font-light"
                        onClick={() => setOpen(false)}
                    />
                </div>
                <hr className="mb-0 mt-2 border-0.5 border-divider dark:border-custom-border" />
                {type === "Location" ? (
                <LocationPickerInner
                    onSelect={(location: any) => onChange?.([{ ...location, type }])}
                    value={value as Location}
                />
                ) : (
                    <div className="p-4 h-[400px] dark:h-[440px] overflow-y-hidden">
                        <label
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e:any) => handleDrop({ e, accept })}
                            className={`flex items-center justify-center p-6 border-2 ${
                                isDragging ? "border-blue-400 bg-blue-50" : "border-dashed"
                            } dark:border-0.5 dark:border-[#7fffd408] dark:border-solid rounded-lg cursor-pointer w-full ${status && '!cursor-no-drop'}`}
                        >
                            <AiOutlineUpload size={40} className="text-blue-500 mr-4" />
                            <span className="text-gray-600 dark:text-dark-text font-extralight">
                                Click to select files or drag and drop here
                            </span>
                            <input type="file" multiple accept={accept} className="hidden"  onChange={(e) => handleFileChange({ e, accept })} disabled={status}/>
                        </label>

                        {files.length > 0 ? (
                            <div className="flex flex-col p-1">
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 overflow-y-auto custom-scrollbar h-[250px]">
                                    {files.map((f, idx) => (
                                        <div
                                            key={idx}
                                            className="relative border rounded p-1 dark:border-[#7fffd426] flex flex-col items-center h-32 w-32 group overflow-hidden"
                                        >
                                            <div className="relative w-full h-full">{renderFilePreview(f)}</div>
                                            {f?.isUploading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-[#f0f0f0] rounded-full m-auto w-full max-w-[30%] h-[32%]">
                                                    <CircularProgress
                                                        variant="determinate"
                                                        value={f?.progress ?? 0}
                                                        size={30}
                                                        thickness={3}
                                                        className="!text-[#988888]"
                                                    />
                                                    <span className="absolute text-xxss font-medium text-gray-600">
                                                        {Math.round(f?.progress ?? 0)}%
                                                    </span>
                                                </div>
                                            )}

                                            {!f?.isUploading  && !status && (
                                                <span
                                                    className="opacity-0 group-hover:opacity-100 absolute top-12 text-red-500 cursor-pointer"
                                                    onClick={() => handleDelete(f, idx)}
                                                >
                                                    <DeleteOutlineIcon className="!text-[16px] hover:scale-150 active:scale-100 transition-all duration-400 ease-in-out" />
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px]">
                                <p className="text-2xl font-extralight text-center text-gray-500 dark:text-dark-text">{type} not found!</p>
                            </div>
                        )}
                    </div>
                )}

                <hr className="mb-3 mt-0 border-0.5 dark:border-custom-border border-divider" />
            </Dialog>
        </div>
    );
};

export const ReusableFileUploader: React.FC<ReusableFileUploaderProps> = (props) => {
    return <FileUploadPanel {...props} />;
};








