// import { customInputStyles } from "./fieldPropsStyles"

// export const FieldConfig:any = {
//     username: { name: "username", label: "User name", type: "text", size: 12 , style: customInputStyles},
//     email: { name: "email", label: "Email", type: "email", size: 12, style: customInputStyles },
//     password: { name: "password", label: "Password", type: "password", size: 12 , style: customInputStyles},
//     confirmPassword: { name: "confirmPassword", label: "Confirm password", type: "password", size: 12 , style: customInputStyles},
// }

import { SxProps } from '@mui/system';
import { customInputStyles } from './fieldPropsStyles';

type FieldType = 'text' | 'email' | 'password';

interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    size?: number;
    style?: SxProps | null;
}

const defaultFieldConfig: Pick<FieldConfig, 'size' | 'style'> = {
    size: 12,
    style: customInputStyles,
};

export const FieldConfig: Record<string, FieldConfig> = {
  username: {
    name: 'username',
    label: 'User name',
    type: 'text',
    ...defaultFieldConfig,
  },
  email: {
    name: 'email',  
    label: 'Email',
    type: 'email',
    ...defaultFieldConfig,
  },
  password: {
    name: 'password',
    label: 'Password',
    type: 'password',
    ...defaultFieldConfig,
  },
  confirmPassword: {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    ...defaultFieldConfig,
  },
};


