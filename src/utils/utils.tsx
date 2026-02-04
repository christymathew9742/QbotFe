
"use client";

import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { constantsText } from '@/constant/constant';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import Filter1Icon from '@mui/icons-material/Filter1';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import BookIcon from '@mui/icons-material/Book';
import ViewListIcon from '@mui/icons-material/ViewList';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { parse, isValid } from "date-fns";
import { fromZonedTime, toZonedTime, format as formatTz } from "date-fns-tz";



import {
  isToday,
  isYesterday,
  differenceInCalendarDays,
  differenceInMonths,
  differenceInYears,
  format,
} from 'date-fns';
import api from './axios';

interface DateTimeResult {
  month?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
}

const {
  BOT:{
    ICON:{
      MESSAGE,
      REPLAY,
      PREFERENCE,
    }
  }
} = constantsText;
const BASE_MEDIA_URL = "https://storage.googleapis.com/qbot-assets/whatsappuser/";

const iconProps = { sx: { fontSize: '20px', marginRight: '4px',  } };

const DATE_TIME_RANGE_REGEX = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s?\d{1,2}:\d{2}\s?[-–—]\s?\d{1,2}:\d{2}(?:\s?(?:AM|PM))?\b/i;

function isValidDateRange(text: string): boolean {
  return DATE_TIME_RANGE_REGEX.test(text);
}

// export function convertToLocalTime(
//   input?: string,
//   timeZone?: any,
//   year = new Date().getFullYear()
// ) {
  
//   if (!input || typeof input !== "string") return null;
//   if (!isValidDateRange(input)) return null;

//   const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   const extracted = input.match(DATE_TIME_RANGE_REGEX)?.[0];
//   if (!extracted) return null;

//   const [datePart, timePart] = extracted.split(",");
//   if (!datePart || !timePart) return null;

//   const [startTime, endTime] = timePart.trim().split("-");
//   if (!startTime || !endTime) return null;

//   const is12Hour = /am|pm/i.test(extracted);
//   const parseFormat = is12Hour
//     ? "MMM dd yyyy hh:mm a"
//     : "MMM dd yyyy HH:mm";

//   const parseDate = (time: string) =>
//     parse(
//       `${datePart.trim()} ${year} ${time.trim()}`,
//       parseFormat,
//       new Date()
//     );

//   const startParsed = parseDate(startTime);
//   const endParsed = parseDate(endTime);

//   if (!isValid(startParsed) || !isValid(endParsed)) return null;

//   const startUTC = fromZonedTime(startParsed, timeZone);
//   const endUTC = fromZonedTime(endParsed, timeZone);

//   const startLocal = toZonedTime(startUTC, userTZ);
//   const endLocal = toZonedTime(endUTC, userTZ);

//   // 🛑 FINAL SAFETY
//   if (isNaN(startLocal.getTime()) || isNaN(endLocal.getTime())) {
//     return null;
//   }

//   return `${formatTz(startLocal, "dd MMM, hh:mm a", {
//     timeZone: userTZ,
//   })} - ${formatTz(endLocal, "hh:mm a", {
//     timeZone: userTZ,
//   })}`;
// }

/**
 * @param input - The time string (e.g., "Feb 13, 09:40-10:00")
 * @param originalTimeZone - The timezone used when the slot was CREATED (e.g., 'America/Anchorage')
 * @param selectedTimeZone - The timezone you are currently SWITCHING to (e.g., 'Europe/Dublin')
 * @param year - The year of the appointment
 */
export function convertToLocalTime(
  input?: string,
  originalTimeZone: string = "UTC", 
  selectedTimeZone: string = "UTC",
  year = new Date().getFullYear()
) {
  if (!input || typeof input !== "string") return null;

  // 1. Clean and Parse Input
  const cleanInput = input.replace(/,/g, ", ").replace(/\s+/g, " ").trim();
  const parts = cleanInput.split(",");
  if (parts.length < 2) return null;

  const datePart = parts[0].trim();
  const timeRange = parts[1].trim();
  const times = timeRange.split("-").map(t => t.trim());
  if (times.length < 2) return null;

  const [startTimeStr, endTimeStr] = times;
  const is12Hour = /am|pm/i.test(timeRange);
  const parseFormat = is12Hour ? "MMM d yyyy h:mm a" : "MMM d yyyy HH:mm";

  // The final destination is always the user's actual browser/system timezone
  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const processTime = (timeStr: string) => {
    const fullStr = `${datePart} ${year} ${timeStr}`;
    const parsedDate = parse(fullStr, parseFormat, new Date());

    if (!isValid(parsedDate)) return null;

    /**
     * LOGIC:
     * 1. We treat the text as belonging to the ORIGINAL timezone.
     * 2. We convert it to a universal UTC moment.
     * 3. We can then project that moment into the "Selected" or "User" zone.
     */
    const utcDate = fromZonedTime(parsedDate, originalTimeZone);
    
    // If you specifically want to see it in the "Selected" timezone (e.g. Dublin)
    // change 'userTZ' to 'selectedTimeZone' below.
    return toZonedTime(utcDate, userTZ);
  };

  const startLocal = processTime(startTimeStr);
  const endLocal = processTime(endTimeStr);

  if (!startLocal || !endLocal) return null;

  // 2. Format Output
  // We include the Date and the name of the Timezone for clarity
  return `${formatTz(startLocal, "MMM d, hh:mm a", { timeZone: userTZ })} - ${formatTz(endLocal, "hh:mm a", { timeZone: userTZ })} (${userTZ})`;
}

export const messageIcons = [
  { type: 'Text', field: 'messages', icon: <WysiwygIcon sx={{ ...iconProps.sx, color: MESSAGE }}  /> },
  { type: 'Image', field: 'messages', icon: <ImageIcon sx={{ ...iconProps.sx, color: MESSAGE }}  /> },
  { type: 'Video', field: 'messages', icon: <VideoLibraryIcon sx={{ ...iconProps.sx, color: MESSAGE }}  /> },
  { type: 'Audio', field: 'messages', icon: <AudioFileIcon sx={{ ...iconProps.sx, color: MESSAGE }}  /> },
  { type: 'Location', field: 'messages', icon: <LocationOnIcon sx={{ ...iconProps.sx, color: MESSAGE }}  /> },
  { type: 'Doc', field: 'messages', icon: <InsertDriveFileIcon sx={{ ...iconProps.sx, color: MESSAGE }}  /> },
];

export const replayIcons = [
  { type: 'Text', field: 'replay', icon: <TextFieldsIcon sx={{ ...iconProps.sx, color: REPLAY }}  /> },
  { type: 'Email', field: 'replay', icon: <ContactMailIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'Phone', field: 'replay', icon: <ContactPhoneIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'Number', field: 'replay', icon: <Filter1Icon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'Locations', field: 'replay', icon: <LocationOnIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'File', field: 'replay', icon: <FileUploadIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'Date', field: 'replay', icon: <CalendarMonthIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'Time', field: 'replay', icon: <AccessTimeFilledIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
];

export const Preference = [
  { type: 'List', field: 'preference', icon: <ViewListIcon sx={{ ...iconProps.sx, color: PREFERENCE }} /> },
  { type: 'Button', field: 'preference', icon: <SmartButtonIcon sx={{ ...iconProps.sx, color: PREFERENCE }} /> },
  { type: 'Slot', field: 'preference', icon: <BookIcon sx={{ ...iconProps.sx, color: PREFERENCE }} /> },
];

export const mediaTypes = [
  'Image',
  'Video',
  'Audio',
  'Location',
  'Doc'
];

export  const decodeHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.innerHTML;
};

export function isQueryParamString(str:any) {
  return /^(\w+=[^&]*&)*(\w+=[^&]*)$/.test(str);
}

export const formatTime = (iso:any) => {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
  });
};

export const formatStringDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const oneDay = 24 * 60 * 60 * 1000;

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / oneDay);

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (diffDays === 0) {
    return `Today at ${timeStr}`;
  } else if (diffDays === 1) {
    return `Yest at ${timeStr}`;
  } else {
    const dateStr = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `${dateStr} at ${timeStr}`;
  }
};

export const formatString = (string: any): string => {
  if (typeof string === 'string' && string?.trim()) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  }
  return '';
};

export const formatUpdatedDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();

  if (isToday(date)) {
    return `Today, ${format(date, 'HH:mm')}`;
  }

  if (isYesterday(date)) {
    return `Yest, ${format(date, 'HH:mm')}`;
  }

  const daysDiff = differenceInCalendarDays(now, date);
  if (daysDiff <= 30) {
    return `${daysDiff}d ago`;
  }

  const monthsDiff = differenceInMonths(now, date);
  if (monthsDiff < 12) {
    return `${monthsDiff}mo ago`;
  }

  const yearsDiff = differenceInYears(now, date);
  return `${yearsDiff}y ago`;
};

export function isFileType(type: string): boolean {
  const fileTypes = ["Image", "Video", "Doc", "Location", "Audio"];
  return fileTypes.includes(type);
}

export const updateTempFilesToPermanent = async (inputs: any[], setInputs: any, chatbotId: string) => {
  if (!inputs?.length) return;

  const hasTempFiles = inputs.some(input =>
    input.fileData?.some((file:any) => file?.key?.includes("temp/"))
  );
  if (!hasTempFiles) return;

  try {
    const updatedInputs = await Promise.all(
      inputs.map(async (input: any) => {
        if (!input.fileData) return input;

        const updatedFileData = await Promise.all(
          input.fileData.map(async (file: any) => {
            if (file?.key?.includes("temp/") && file.type !== "Test" && file.type !== "Location") {
              try {
                const { data: res } = await api.get(
                  `/createbots/${chatbotId}/permanent-url`,
                  { params: { tempKey: file.key, filename: file.name } }
                );
                if (!res.permanentKey || !res.permanentUrl) return { ...file, saveToDb: false };
                return { ...file, key: res.permanentKey, url: res.permanentUrl, preview: res.permanentUrl, saveToDb: true };
              } catch {
                return { ...file, saveToDb: false };
              }
            }
            return file;
          })
        );

        return { ...input, fileData: updatedFileData };
      })
    );

    setInputs(updatedInputs);
    console.log("✅ Temp files updated before save");
  } catch (err: any) {
    console.error("handleFileUpdates failed:", err.message);
  }
};

export const extractFileKeys = (inputs: any[] | undefined, fieldId:string = ""): string[] => {
  const fileKeys: string[] = [];

  if (!Array.isArray(inputs)) return fileKeys;

  inputs.forEach((input) => {
    input = Array.isArray(input) ? input[0] : input;

    if (
      input?.field === "messages" &&
      (!fieldId || input?.id === fieldId) && 
      !["Location", "Text"].includes(input?.type) &&
      Array.isArray(input?.fileData)
    ) {
      input.fileData.forEach((file: any) => {
        if (file?.key) fileKeys.push(file.key);
      });
    }
  });

  return fileKeys;
};

export const allowedExtensions = {
  image: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "3gp"],
  audio: ["mp3", "aac", "m4a", "amr", "ogg", "opus"],
  doc: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "rtf", "zip", "rar"],
};

// const DATE_REGEX = /([A-Za-z]{3,})\s+(\d{1,2})(?:,)?/; 
// const TIME_REGEX = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;

const DATE_REGEX = /\b(?:([A-Za-z]{3,})\s+(\d{1,2})|(\d{1,2})\s+([A-Za-z]{3,}))\b/;
const TIME_REGEX = /\b(\d{1,2}:\d{2}(?:\s?(?:AM|PM))?)\s*[-–—]\s*(\d{1,2}:\d{2}(?:\s?(?:AM|PM))?)\b/i;



export const extractDateTime = (value: string): DateTimeResult => {
  if (!value || typeof value !== "string") return {};

  const cleanStr = value.trim();
  const result: DateTimeResult = {};
  const dateMatch = cleanStr.match(DATE_REGEX);
  if (dateMatch) {
    result.month = dateMatch[1];
    result.date = dateMatch[2];
  }
  const timeMatch = cleanStr.match(TIME_REGEX);
  if (timeMatch) {
    result.startTime = timeMatch[1];
    result.endTime = timeMatch[2];
  }

  result.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return result;
};

export const getValidUrlOrValue = (
  value: string | any,
  timeZone?: string,
  onStart?: () => void,
  onEnd?: () => void
) => {

  const VALID_MEDIA_EXT = [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".3gp", ".mp3", ".aac", ".m4a", ".amr", ".ogg", ".opus", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv", ".rtf", ".zip", ".rar"];
  const isMediaFile = (name: string) =>
    VALID_MEDIA_EXT.some((ext) => name.toLowerCase().trim().endsWith(ext));
  const makeFullUrl = (filename: string) => `${BASE_MEDIA_URL}${filename.trim()}`;

  const handleDownloadSingle = async (url: string) => {
    try {
      onStart?.();
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch file");
      const blob = await res.blob();
      const filename = url.split("/").pop()?.split("?")[0] || "file";
      saveAs(blob, filename);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    } finally {
      onEnd?.();
    }
  };

  const handleDownloadZip = async (urls: string[]) => {
    try {
      onStart?.();
      const zip = new JSZip();

      await Promise.all(
        urls.map(async (url, idx) => {
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch");
            const blob = await res.blob();
            const filename = url.split("/").pop()?.split("?")[0] || `Qbot_${idx}`;
            zip.file(filename, blob);
          } catch (err) {
            console.error("Failed to add to zip:", err);
          }
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `Qbot_${Date.now()}.zip`);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      alert("Failed to download zip. Try again.");
    } finally {
      onEnd?.();
    }
  };

  try {
    if (!value) return null;

    if (typeof value !== "string") {
      return String(value);
    }
    
    if (isValidDateRange(value)) {
      const converted = convertToLocalTime(value, timeZone);
      if (converted) {
        return converted;
      }
    }

    const filenames = value
      .split(",")
      .map((f: string) => f?.trim())
      .filter(Boolean);

    const validFiles = filenames?.filter(isMediaFile);

    if (validFiles.length === 0) return String(value);

    const urls = validFiles.map(makeFullUrl);

    return (
      <button
        onClick={() =>
          urls.length === 1
            ? handleDownloadSingle(urls[0])
            : handleDownloadZip(urls)
        }
        title={
          urls.length === 1 ? "Download File" : `Download ${urls.length} Files`
        }
        className="flex items-center gap-2 text-xs font-light text-blue-700 transition-transform duration-300 hover:scale-110"
      >
        <CloudDownloadOutlinedIcon fontSize="small" />
      </button>
    );
  } catch (err) {
    console.error("Error processing media URLs:", err);
    return String(value);
  }
};

export const getFormattedMessage = (message: any) => {
  const msg = Array.isArray(message) ? message[0]?.value : message;
  if (!msg) return "";

  let str = String(msg);

  if (/\b[\w-]{6,}\.[a-zA-Z0-9]{1,4}\b/.test(str)) {
    str = str.replace(/\b[\w-]{6,}\.[a-zA-Z0-9]{1,4}\b/g, "📄");
  } else if (/\b(MFI-|FI-)[\w-]+\b/.test(str)) {
    str = str.replace(/\b(MFI-|FI-)[\w-]+\b/g, "📄");
  }
  return str;
};

























