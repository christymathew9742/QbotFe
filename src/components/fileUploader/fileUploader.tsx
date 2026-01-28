// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { AiOutlineUpload } from "react-icons/ai";
// import Dialog from "@mui/material/Dialog";
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
// import CircularProgress from "@mui/material/CircularProgress";
// import dynamic from "next/dynamic";
// import "leaflet/dist/leaflet.css";

// import DescriptionIcon from "@mui/icons-material/Description";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import { allowedExtensions, messageIcons } from "@/utils/utils";
// import { useStatus } from "@/context/StatusContext";
// import { toast } from "react-toastify";

// const LocationPickerInner = dynamic(() => import("@/components/location/Location"), { ssr: false });

// export interface UploadedFile {
//     file: File;
//     preview: string;
//     uploaded: boolean;
//     serverId?: string;
//     name?: string;
//     type?: any;
//     url?: string;
//     key?: string;
//     progress?: number;
//     isUploading?: boolean;
// }

// type HandleFileChangeProps = {
//     e: React.ChangeEvent<HTMLInputElement>;
//     accept?: string;
// };

// interface Location {
//     lat?: number;
//     lng?: number;
//     name?: string;
//     type?: string;
// }

// interface HandleDropProps {
//     e: React.DragEvent<HTMLDivElement>;
//     accept?: string;
// }

// interface FileUploadPanelProps {
//     accept?: string;
//     maxFiles?: number;
//     onFileDelete?: (file: UploadedFile | any) => void;
//     value?: UploadedFile[] | any;
//     type?: string;
//     onChange?: (files: UploadedFile[] | Location[]) => void;
// }

// interface ReusableFileUploaderProps extends FileUploadPanelProps {}

// const FileUploadPanel: React.FC<FileUploadPanelProps> = ({
//     accept = "*",
//     maxFiles,
//     onFileDelete,
//     value = [],
//     type,
//     onChange,
// }) => {
//     const [files, setFiles] = useState<UploadedFile[]>(value);
//     const [open, setOpen] = useState(false);
//     const [isDragging, setIsDragging] = useState(false);
//     const { status } = useStatus();

//     useEffect(() => {
//         setFiles(value);
//     }, [value]);

//     const handleFileSelect = (selectedFiles: File[]) => {
//         if (maxFiles && files.length + selectedFiles.length > maxFiles) {
//             toast.error(`You can only upload up to ${maxFiles} files`);
//             return;
//         }

//         const limits: Record<string, number> = {
//             image: 25,
//             video: 100,
//             audio: 50,
//             application: 100,
//         };

//         const invalidFiles: string[] = [];
//         const validFiles = selectedFiles.filter((file) => {
//             const sizeMB = file.size / 1_048_576;
//             const typeKey =
//             Object.keys(limits).find((t) => file.type.startsWith(t)) || "other";
//             const maxSize = limits[typeKey] || 10;

//             if (sizeMB > maxSize) {
//                 const shortName =
//                     file.name.length > 25 ? file.name.slice(0, 22) + "..." : file.name;
//                 invalidFiles.push(`"${shortName}" (${sizeMB.toFixed(1)} MB > ${maxSize} MB)`);
//                 return false;
//             }

//             return true;
//         });

//         if (invalidFiles.length > 0) {
//             toast.error(
//              `Some files exceed their size limits:\n${invalidFiles.join("\n")}`
//             );
//             return;
//         }

//         const newFiles: UploadedFile[] = validFiles.map((file) => ({
//             file,
//             preview: URL.createObjectURL(file),
//             uploaded: false,
//             name: file.name,
//             type: file.type,
//             key: `${file.name}-${Date.now()}`,
//             isUploading: false,
//             progress: 0,
//         }));

//         const updatedFiles = [...files, ...newFiles];
//         setFiles(updatedFiles);
//         onChange?.(updatedFiles);
//     };

//     const validateFiles = (files: File[], accept?: string): File[] => {
//         const globalAllowed = Object.values(allowedExtensions).flat();
//         const allowedTypes = accept
//             ? accept.split(",").map((type) => type.trim().toLowerCase())
//             : [];

//         const validFiles = files.filter((file) => {
//             const fileType = file.type.toLowerCase();
//             const ext = file.name.split(".").pop()?.toLowerCase() || "";

//             if (!globalAllowed.includes(ext)) return false;
//             if (allowedTypes.length === 0) return true;

//             return allowedTypes.some((type) => {
//                 if (type.endsWith("/*")) {
//                     const baseType = type.replace("/*", "");
//                     return fileType.startsWith(baseType);
//                 }
//                 return fileType === type;
//             });
//         });
//         return validFiles;
//     };

//     const handleUploadChange = ({ e, accept }: HandleFileChangeProps) => {
//         const selectedFiles = Array.from(e.target.files ?? []);
//         if (!selectedFiles.length) return;

//         const validFiles = validateFiles(selectedFiles, accept);

//         if (!validFiles.length) {
//             toast.error("Unsupported file type. Please upload valid files only.");
//             e.target.value = "";
//             return;
//         }

//         handleFileSelect(validFiles);
//     }

//     const handleFileChange = ({e,  accept}:HandleFileChangeProps) => {
//         handleUploadChange({e, accept} )
//     };

//     const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
//         e.preventDefault();
//         setIsDragging(false);
//     };

//     const handleDrop = ({ e, accept }: HandleDropProps) => {
//         e.preventDefault();
//         setIsDragging(false);

//         const droppedFiles = Array.from(e.dataTransfer.files ?? []);
//         if (!droppedFiles.length) return;

//         const validFiles = validateFiles(droppedFiles, accept);

//         if (!validFiles.length) {
//             toast.error("Unsupported file type. Please upload valid files only.");
//             return;
//         }

//         handleFileSelect(validFiles);
//     };

//     const handleDelete = useCallback(async (fileObj: UploadedFile, idx: number) => {
//         try {
//             if (!fileObj) return;

//             setFiles(prevFiles => {
//                 const updatedFiles = prevFiles.filter((_, i) => i !== idx);

//                 if(status) return updatedFiles;
                
//                 onChange?.(updatedFiles);

//                 onFileDelete?.({
//                     file: fileObj.file || new File([], fileObj.name || "Unknown File"),
//                     preview: fileObj.preview || "",
//                     isUploading: fileObj.isUploading || false,
//                     serverId: fileObj.serverId || "",
//                     name: fileObj.name || fileObj.file?.name || "Unknown File",
//                     type: fileObj.type || fileObj.file?.type || "File",
//                     url: fileObj.url || "",
//                     key: fileObj.key || "",
//                 });

//                 if (fileObj.preview) URL.revokeObjectURL(fileObj.preview);
//                 return updatedFiles;
//             });
//         } catch (error) {
//             console.error("Error deleting file:", error);
//         }
//     }, [onChange, onFileDelete]);

//     const renderFilePreview = (f: UploadedFile) => {
//         if (!f) return null;

//         const fileType = f?.type || "";
//         const fileName = f?.name?.toLowerCase() || "";
//         const filePreview = f?.preview || "";

//         const baseClass = `w-full h-full object-center group-hover:opacity-20 transition-opacity ${
//         f?.isUploading ? "opacity-40" : ""
//         }`;

//         if (fileType.startsWith("image/")) return <img src={filePreview} alt={fileName} className={baseClass} />;
//         if (fileType.startsWith("video/")) return <video src={filePreview} controls className={baseClass} />;
//         if (fileType === "application/pdf" || fileName.endsWith(".pdf"))
//         return <embed src={filePreview} type="application/pdf" className="w-full h-full" />;
//         if (
//             fileType === "application/msword" ||
//             fileType ===
//                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//             fileName.endsWith(".doc") ||
//             fileName.endsWith(".docx")
//         )
//         return (
//             <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-700 text-xs font-medium">
//                 <DescriptionIcon sx={{ color: "#1565c0", fontSize: 28, mb: 0.5 }} />
//                 <span className="truncate w-5/6 text-center">{f?.name || "Document"}</span>
//             </div>
//         );

//         return (
//             <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-700 text-xs font-medium">
//                 <InsertDriveFileIcon sx={{ color: "#757575", fontSize: 26, mb: 0.5 }} />
//                 <span className="truncate w-5/6 text-center">{f?.name || "Unknown File"}</span>
//             </div>
//         );
//     };

//     return (
//         <div className="max-w-3xl mx-auto pb-2">
//             <div className="flex items-center justify-center p-1 border-1 border-[rgba(15,171,73,0.42)] rounded-lg transition m-auto w-[50%] !opacity-[50]">
//                 <div
//                     onClick={() => setOpen(true)}
//                     className="uplodFields !transition-transform !duration-200 !ease-in-out hover:scale-110 cursor-pointer"
//                 >
//                     {(messageIcons.find((item: any) => item.type === type) || {}).icon || null}
//                 </div>
//             </div>

//             <Dialog
//                 open={open}
//                 onClose={() => setOpen(false)}
//                 fullWidth
//                 sx={{ "& .MuiDialog-paper": { width: "100%", height: "1000px", borderRadius: "10px" } }}
//             >
//                 <div className="flex py-1 px-4 items-center justify-between w-full">
//                     <div className="text-lg font-medium text-color-primary dark:text-dark-text">Upload {type}</div>
//                     <CloseFullscreenIcon
//                         className="cursor-pointer mt-2 !text-lg text-color-primary-light dark:text-dark-text hover:scale-110 transition-transform duration-200 font-light"
//                         onClick={() => setOpen(false)}
//                     />
//                 </div>
//                 <div className="border-t border-b mb-2 h-full mt-2">
//                     {type === "Location" ? (
//                     <LocationPickerInner
//                         onSelect={(location: any) => onChange?.([{ ...location, type }])}
//                         value={value as Location}
//                     />
//                     ) : (
//                         <div className="p-4 h-[400px] dark:h-[440px] overflow-y-hidden">
//                             <label
//                                 onDragOver={handleDragOver}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={(e:any) => handleDrop({ e, accept })}
//                                 className={`flex items-center justify-center p-6 border-2 ${
//                                     isDragging ? "border-blue-400 bg-blue-50" : "border-dashed"
//                                 } dark:border-0.5 dark:border-[#7fffd408] dark:border-solid rounded-lg cursor-pointer w-full ${status && '!cursor-no-drop'}`}
//                             >
//                                 <AiOutlineUpload size={40} className="text-blue-500 mr-4" />
//                                 <span className="text-gray-600 dark:text-dark-text font-extralight">
//                                     Click to select files or drag and drop here
//                                 </span>
//                                 <input type="file" multiple accept={accept} className="hidden"  onChange={(e) => handleFileChange({ e, accept })} disabled={status}/>
//                             </label>
//                             {files.length > 0 ? (
//                                 <div className="flex flex-col p-1">
//                                     <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 overflow-y-auto custom-scrollbar h-[250px]">
//                                         {files.map((f, idx) => (
//                                             <div
//                                                 key={idx}
//                                                 className="relative border rounded p-1 dark:border-[#7fffd426] flex flex-col items-center h-32 w-32 group overflow-hidden"
//                                             >
//                                                 <div className="relative w-full h-full">{renderFilePreview(f)}</div>
//                                                 {f?.isUploading && (
//                                                     <div className="absolute inset-0 flex items-center justify-center bg-[#f0f0f0] rounded-full m-auto w-full max-w-[30%] h-[32%]">
//                                                         <CircularProgress
//                                                             variant="determinate"
//                                                             value={f?.progress ?? 0}
//                                                             size={30}
//                                                             thickness={3}
//                                                             className="!text-[#988888]"
//                                                         />
//                                                         <span className="absolute text-xxss font-medium text-gray-600">
//                                                             {Math.round(f?.progress ?? 0)}%
//                                                         </span>
//                                                     </div>
//                                                 )}

//                                                 {!f?.isUploading  && !status && (
//                                                     <span
//                                                         className="opacity-0 group-hover:opacity-100 absolute top-12 text-red-500 cursor-pointer"
//                                                         onClick={() => handleDelete(f, idx)}
//                                                     >
//                                                         <DeleteOutlineIcon className="!text-[16px] hover:scale-150 active:scale-100 transition-all duration-400 ease-in-out" />
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center justify-center h-[300px]">
//                                     <p className="text-2xl font-extralight text-center text-color-primary-light dark:text-dark-text">{type} not found!</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </Dialog>
//         </div>
//     );
// };

// export const ReusableFileUploader: React.FC<ReusableFileUploaderProps> = (props) => {
//     return <FileUploadPanel {...props} />;
// };


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
            {/* --- Trigger Area (Node Display) --- */}
            <div 
                onClick={() => setOpen(true)}
                className={`
                    group/flow relative w-full h-14 flex items-center rounded-xl cursor-pointer transition-all duration-300
                    ${files.length > 0 
                        ? "bg-slate-900/50 justify-start pl-3" 
                        : "justify-center border-2 border-dashed border-slate-600 bg-slate-800/20 hover:border-cyan-500 hover:bg-slate-800/40"
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
                            {/* Overflow Counter Bubble */}
                            {files.length > 4 && (
                                <div 
                                    className="relative w-10 h-10 rounded-full border-2 border-[#0B1120] bg-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-md z-0"
                                >
                                    +{files.length - 4}
                                </div>
                            )}
                        </div>
                        
                        <div className="ml-auto mr-3 text-slate-500 group-hover/flow:text-cyan-400 transition-colors">
                            <AiOutlineCloudUpload size={20} />
                        </div>
                    </div>
                ) : (
                    // Empty State: Dashed Ghost Button
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-cyan-400 transition-colors">
                        <div className="transform group-hover:scale-110 transition-transform duration-300 mb-1">
                            {(messageIcons.find((item: any) => item.type === type) || {}).icon || <AiOutlineCloudUpload size={22} />}
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                            Upload {type}
                        </span>
                    </div>
                )}
            </div>

            {/* --- Dialog (Popup) - Layout Preserved --- */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        width: "100%",
                        height: "1000px", 
                        borderRadius: "16px",
                        backgroundColor: "#0f172a", // Dark Slate
                        border: "1px solid #1e293b",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
                    },
                    "& .MuiBackdrop-root": { backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }
                }}
            >
                {/* Header */}
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

                {/* Body Wrapper */}
                <div className="border-t border-b border-slate-800 mb-2 h-full mt-2 bg-[#0f172a]">
                    {type === "Location" ? (
                        <div className="h-full">
                            <LocationPickerInner
                                onSelect={(location: any) => onChange?.([{ ...location, type }])}
                                value={value as Location}
                            />
                        </div>
                    ) : (
                        <div className="p-4 h-[400px] overflow-y-hidden flex flex-col">
                            {/* Drop Zone */}
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

                            {/* File List Grid */}
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

                                                {/* Uploading State */}
                                                {f?.isUploading && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded backdrop-blur-sm">
                                                        <CircularProgress variant="determinate" value={f?.progress ?? 0} size={24} thickness={4} sx={{ color: '#06b6d4' }} />
                                                        <span className="text-[10px] font-bold text-cyan-400 mt-1">{Math.round(f?.progress ?? 0)}%</span>
                                                    </div>
                                                )}

                                                {/* Delete Button (Hover) */}
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







