import { useState } from 'react';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import YouTubeIcon from '@mui/icons-material/YouTube';
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

export const messageIcons = [
  { type: 'Text', icon: <WysiwygIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'Image', icon: <ImageIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'Video', icon: <VideoLibraryIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'YouTube', icon: <YouTubeIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'Location', icon: <LocationOnIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
  { type: 'File', icon: <InsertDriveFileIcon sx={{ fontSize: '14px', marginRight: '4px', color: MESSAGE }} /> },
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





