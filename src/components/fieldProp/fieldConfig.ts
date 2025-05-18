import { SxProps } from '@mui/system';
import { customInputStyles } from './fieldPropsStyles';

type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea';

interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    size?: number;
    className: string;
    style?: SxProps | null;
}

const defaultFieldConfig: Pick<FieldConfig, 'size' | 'style' | 'className'> = {
    size: 12,
    className: 'dark:bg-white/[0.03]',
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


