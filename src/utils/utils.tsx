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
import AddBoxIcon from '@mui/icons-material/AddBox';
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

export const messageIcons = [
  { type: 'Text', icon: <WysiwygIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'Image', icon: <ImageIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'Video', icon: <VideoLibraryIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'Audio', icon: <AudioFileIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'Location', icon: <LocationOnIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'Doc', icon: <InsertDriveFileIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
];

export const replayIcons = [
  { type: 'Text', icon: <TextFieldsIcon sx={{ fontSize: '14px', marginRight: '4px', color: REPLAY }} /> },
  { type: 'Email', icon: <ContactMailIcon sx={{ fontSize: '14px', marginRight: '4px', color: REPLAY }} /> },
  { type: 'Phone', icon: <ContactPhoneIcon sx={{ fontSize: '14px', marginRight: '4px', color: REPLAY }} /> },
  { type: 'Number', icon: <Filter1Icon sx={{ fontSize: '14px', marginRight: '4px', color: REPLAY }} /> },
  { type: 'Location', icon: <LocationOnIcon sx={{ fontSize: '14px', marginRight: '4px', color: REPLAY }} /> },
  { type: 'File', icon: <FileUploadIcon sx={{ fontSize: '14px', marginRight: '4px', color: REPLAY }} /> },
  { type: 'Date', icon: <CalendarMonthIcon sx={{ fontSize: '14px', marginRight: '4px', color: REPLAY }} /> },
  { type: 'Time', icon: <AccessTimeFilledIcon sx={{ fontSize: '14px', marginRight: '4px', color: REPLAY }} /> },
];

export const Preference = [
  { type: 'List', icon: <ViewListIcon sx={{ fontSize: '14px', marginRight: '4px', color: PREFERENCE }} /> },
  { type: 'Button', icon: <SmartButtonIcon sx={{ fontSize: '14px', marginRight: '4px', color: PREFERENCE }} /> },
];

export const groupIcons = [
  { type: 'Drag New', icon: <AddBoxIcon sx={{ fontSize: '16px', marginRight: '6px', color: GROUP }} /> },
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

export const formatStringDate = (iso: any) => {
  const date = new Date(iso);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = today.getTime() - inputDate.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (diffTime === 0) {
    return `Today at ${timeStr}`;
  } else if (diffTime === oneDay) {
    return `Yesterday at ${timeStr}`;
  } else {
    const dateStr = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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









