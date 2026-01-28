import { SxProps } from '@mui/system';
import { customTextFieldStyle } from './fieldPropsStyles';

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'time'
  | 'week'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'range'
  | 'color'
  | 'hidden'
  | 'textarea'
  | 'select'
  | 'timezone';

interface FieldConfig {
    name: string;
    label?: string;
    type: FieldType;
    size?: number;
    className?: string;
    endAdornment?: string;
    rows?: number;
    style?: SxProps | null;
    labelTop?: string;
    toolTip?: string;
    placeholder?: string;
}

export interface SectionConfig {
    section: string;
    fields: FieldConfig[];
}

const defaultFieldConfig: Pick<FieldConfig, 'size' | 'style' | 'className'> = {
    size: 12,
};

export const FieldConfig: SectionConfig[] = [
    {
        section: 'signin',
        fields: [
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
        ],
    },
    {
        section: 'signup',
        fields: [
            {
                name: 'username',
                label: 'User name',
                type: 'text',
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: 'confirmPassword',
                label: 'Confirm password',
                type: 'password',
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
        ],
    },
    {
        section: "socialLinks",
        fields: [
            {
                name: "facebook",
                label: "Facebook",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "twitter",
                label: "X.com",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "linkedin",
                label: "LinkedIn",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "instagram",
                label: "Instagram",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
        ],
    },
    {
      section: "personalInfo",
        fields: [
            {
                name: "displayname",
                label: "Display Name",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "username",
                label: "User Name",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "email",
                label: "Email Address",
                type: "email",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "phone",
                label: "Phone",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "bio",
                label: "Bio",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
        ],
    },
    {
        section: "address",
        fields: [
            {
                name: "country",
                label: "Country",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "state",
                label: "City/State",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "postalcode",
                label: "Postal Code",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "taxId",
                label: "House No",
                type: "text",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
        ],
    },
    {
        section: "testMessage",
        fields: [
            {
                name: "sendnumber",
                type: "text",
                labelTop: "To a Recipient:",
                toolTip: "Enter your recipient number here.",
                placeholder: "Enter your number",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "sendmessage",
                type: "textarea",
                rows: 3,
                labelTop: "Message:",
                toolTip: "Enter your message here.",
                placeholder: "Enter your message",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
        ],
    },
    {
        section: "apiconfig",
        fields: [
            {
                name: "accesstoken",
                type: "password",
                labelTop: "Access Token:",
                toolTip: "Copy and paste your Access Token from your WhatsApp Business account here.",
                placeholder: "Enter your Access Token",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
            {
                name: "phonenumberid",
                type: "password",
                labelTop: "Phone number ID:",
                toolTip: "Copy and paste your Phone Number ID from your WhatsApp Business account here.",
                placeholder: "Enter your Phone number ID",
                style: customTextFieldStyle,
                ...defaultFieldConfig,
            },
        ],
    },
    {
        section: "chatbotFields",
        fields: [
            {
                name: "botName",
                type: "text",
                label: "Assistant Name",
                placeholder: "e.g., NimbleMeet",
                style: customTextFieldStyle,
            },
            {
                name: "generalWelcomeMessage",
                type: "textarea",
                rows: 6,
                label: "Welcome Greeting",
                placeholder: "Enter greeting...",
                className:"mb-4! mt-4!",
                style: customTextFieldStyle,
            },
        ],
    },
    {
        section: "receiptSettings",
        fields: [
            {
                name: "autoSendBookingPdf",
                type: "checkbox",
                label: "Auto-Send Receipt (PDF)",
                placeholder: "Enter greeting...",
            },
        ],
    },
    {
        section: "systemFields",
        fields: [
            {
                name: "timezone",
                type: "timezone",
                placeholder: "System Timezone",
                style: customTextFieldStyle,
            },
            {
                name: "monthlyTarget",
                type: "number",
                label: "Monthly Target",
                style: customTextFieldStyle,
                endAdornment: "Volume", 
            },
        ],
    },
    {
        section: "inactivityTimeoutMinutes",
        fields: [
            {
                name: "inactivityTimeoutMinutes",
                type: "number",
                label: "Session Timeout",
                placeholder: "Enter greeting...",
                style: customTextFieldStyle,
                endAdornment: "Minutes", 
            },
        ],
    },

];


  
  
  
  
  


