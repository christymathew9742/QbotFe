'use client';

/* eslint-disable react/display-name */
import React, { useState, useMemo } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    TextFieldProps,
    FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Field, FieldProps } from 'formik';
import { SxProps, Theme } from '@mui/system';

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


interface FieldPropsConfig {
    name: string;
    label?: string;
    type: FieldType;
    size?: number;
    className?: string;
    rows?: number;
    style?: SxProps<Theme>;
    socialLinks?:any;
    personalInfo?:any;
    address?:any;
    labelTop?:string;
    toolTip?: string;
    placeholder?: string;
    // onchainge?: (phone:number, value: string) => void;
}

interface FieldPropComponentProps {
    Config: FieldPropsConfig;
}

const gridItemProps = {
    xs: 12,
    sm: 6,
};

const FormInputProps: React.FC<FieldPropComponentProps> = ({ Config }) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(prev => !prev);
    const { name, label, type, size, className, rows=3, labelTop, toolTip, placeholder,  style } = Config;
    const renderField = useMemo(() => {
        return ({
            field,
            error,
            helperText,
        }: {
            field: FieldProps['field'];
            error: boolean;
            helperText: string | false | undefined;
        }) => {
            const commonProps: TextFieldProps = {
                ...field,
                label,
                className,
                error,
                fullWidth: true,
                variant: 'outlined',
                sx: style,
            };

            switch (type) {
                case 'text':
                case 'email':
                case 'number':
                return (
                    <div className="mb-4">
                        {labelTop && (
                        <label htmlFor={'id'} className="block mb-2 pt-0 text-sm font-medium text-gray-900 dark:text-white">
                            {labelTop}
                            {toolTip && (
                            <span
                                className="ml-2 inline-block bg-black text-white rounded-full w-3 h-3 text-xs text-center leading-3 cursor-pointer text-[10px] dark:border dark:border-gray-600"
                                title={toolTip}
                            >
                                i
                            </span>
                            )}
                        </label>
                        )}
                        <TextField {...commonProps} type={type} placeholder={placeholder}/>
                        <FormHelperText error={true}>{helperText}</FormHelperText>
                    </div>
                );
                case 'password':
                return (
                    <>
                        <TextField
                            {...commonProps}
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{
                                                background: '#fff',
                                                padding: 0,
                                                marginRight: '2px',
                                                '&:hover': {
                                                background: '#fff',
                                                padding: 0,
                                                },
                                            }}
                                            >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormHelperText error={true}>{helperText}</FormHelperText>
                    </>
                );
                case 'textarea':
                return (
                    <div>
                        {labelTop && (
                        <label htmlFor={'id'} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            {labelTop}
                            {toolTip && (
                            <span
                                className="ml-2 inline-block bg-black text-white rounded-full w-3 h-3 text-xs text-center leading-3 cursor-pointer text-[10px] dark:border dark:border-gray-600"
                                title={toolTip}
                            >
                                i
                            </span>
                            )}
                        </label>
                        )}
                        <TextField {...commonProps} multiline rows={rows} placeholder={placeholder}/>
                        <FormHelperText error={true}>{helperText}</FormHelperText>
                    </div>
                );
                default:
                return null;
            }
        };
    }, [showPassword, label, style, type]);

    if (!type) return null;

    return (
        <Grid {...gridItemProps} size={size}>
            <Field name={name}>
                {({ field, meta }: FieldProps) => {
                    const error = meta.touched && Boolean(meta.error);
                    const helperText = meta.touched ? meta.error : '';
                    return renderField({ field, error, helperText });
                }}
            </Field>
        </Grid>
    );
};

export default FormInputProps;

