import { useState } from 'react';
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

import {
  isToday,
  isYesterday,
  differenceInCalendarDays,
  differenceInMonths,
  differenceInYears,
  format,
} from 'date-fns';

const {
  BOT:{
    ICON:{
      MESSAGE,
      REPLAY,
      PREFERENCE,
      GROUP,
    }
  }
} = constantsText;

type Status = {
  booked?: number;
  completed?: number;
  rescheduled?: number;
};

const iconProps = { sx: { fontSize: '14px', marginRight: '4px',  } };

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
  { type: 'Location', field: 'replay', icon: <LocationOnIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'File', field: 'replay', icon: <FileUploadIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'Date', field: 'replay', icon: <CalendarMonthIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
  { type: 'Time', field: 'replay', icon: <AccessTimeFilledIcon sx={{ ...iconProps.sx, color: REPLAY }} /> },
];

export const Preference = [
  { type: 'List', field: 'preference', icon: <ViewListIcon sx={{ ...iconProps.sx, color: PREFERENCE }} /> },
  { type: 'Button', field: 'preference', icon: <SmartButtonIcon sx={{ ...iconProps.sx, color: PREFERENCE }} /> },
  { type: 'Slot', field: 'preference', icon: <BookIcon sx={{ ...iconProps.sx, color: PREFERENCE }} /> },
];

export const useEmojiPicker = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiList = [
    '😊', '😂', '😢', '😍', '😎', '🥺', '😇', '🤔', '😜', '😏', '😋', '😱',
    '🤩', '😜', '😤', '🥳', '😆', '🥺', '😝', '👻', '💩', '🎉', '🔥', '🌹',
  ];

  // Toggle the visibility of the emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // Insert emoji into the specified editor
  const insertEmoji = (emoji: string, editor: any) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
    }
    setShowEmojiPicker(false); // Close the emoji picker after inserting an emoji
  };

  return {
    showEmojiPicker,
    emojiList,
    toggleEmojiPicker,
    insertEmoji,
  };
};


export  const decodeHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.innerHTML;
};

export function isQueryParamString(str:any) {
  // Check if the string matches the general query parameter format
  return /^(\w+=[^&]*&)*(\w+=[^&]*)$/.test(str);
}

export const formatTime = (iso:any) => {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // for AM/PM
  });
};

export const formatStringDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
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









