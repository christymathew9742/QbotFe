import { SxProps } from '@mui/system';
import { customInputStylesLoginBord, customInputStyles } from './fieldPropsStyles';

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
  | 'select';

interface FieldConfig {
    name: string;
    label?: string;
    type: FieldType;
    size?: number;
    className?: string;
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
    className: 'dark:!bg-[#101828] dark:!border-[#4b1dd8] !rounded-md',
};

export const FieldConfig: SectionConfig[] = [
    {
        section: 'signin',
        fields: [
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                style: customInputStylesLoginBord,
                ...defaultFieldConfig,
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                style: customInputStylesLoginBord,
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
                style: customInputStylesLoginBord,
                ...defaultFieldConfig,
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                style: customInputStylesLoginBord,
                ...defaultFieldConfig,
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                style: customInputStylesLoginBord,
                ...defaultFieldConfig,
            },
            {
                name: 'confirmPassword',
                label: 'Confirm password',
                type: 'password',
                style: customInputStylesLoginBord,
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
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "twitter",
                label: "X.com",
                type: "text",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "linkedin",
                label: "LinkedIn",
                type: "text",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "instagram",
                label: "Instagram",
                type: "text",
                style: customInputStyles,
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
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "username",
                label: "User Name",
                type: "text",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "email",
                label: "Email Address",
                type: "email",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "phone",
                label: "Phone",
                type: "text",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "bio",
                label: "Bio",
                type: "text",
                style: customInputStyles,
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
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "state",
                label: "City/State",
                type: "text",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "postalcode",
                label: "Postal Code",
                type: "text",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "taxId",
                label: "TAX ID",
                type: "text",
                style: customInputStyles,
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
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "sendmessage",
                type: "textarea",
                rows: 3,
                labelTop: "Message:",
                toolTip: "Enter your message here.",
                placeholder: "Enter your message",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
        ],
    },
    {
        section: "apiconfig",
        fields: [
            {
                name: "accesstoken",
                type: "text",
                labelTop: "Access Token:",
                toolTip: "Copy and paste your Access Token from your WhatsApp Business account here.",
                placeholder: "Enter your Access Token",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
            {
                name: "phonenumberid",
                type: "text",
                labelTop: "Phone number ID:",
                toolTip: "Copy and paste your Phone Number ID from your WhatsApp Business account here.",
                placeholder: "Enter your Phone number ID",
                style: customInputStyles,
                ...defaultFieldConfig,
            },
        ],
    },
];
  
  
  
  
  


