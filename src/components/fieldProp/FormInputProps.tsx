'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    TextFieldProps,
    FormHelperText,
    Switch,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Field, FieldProps } from 'formik';
import { SxProps, Theme } from '@mui/system';
import TimezoneSelect from "react-timezone-select";
import { timezoneSelectStyle } from './fieldPropsStyles';

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

interface FieldPropsConfig {
    name: string;
    label?: string;
    type: FieldType;
    size?: number;
    className?: string;
    rows?: number;
    style?: SxProps<Theme>;
    labelTop?: string;
    toolTip?: string;
    placeholder?: string;
    helperText?: string;
    endAdornment?: string;
    styles?: any;
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
    
    // 1. FIX: Define mounted state to handle Hydration for TimezoneSelect
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    
    const { 
        name, label, type, size, className, rows = 3, labelTop, toolTip, placeholder, style, endAdornment 
    } = Config;

    const renderField = useMemo(() => {
        return ({ field, error, helperText: validationError }: { field: FieldProps['field']; error: boolean; helperText: string | false | undefined; }) => {
            
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
                                <label htmlFor={name} className="block mb-2 pt-0 text-sm font-medium color-primary dark:text-white">
                                    {labelTop}
                                    {toolTip && (
                                        <span className="ml-2 inline-block bg-black text-white rounded-full w-3 h-3 text-xs text-center leading-3 cursor-pointer text-[10px] dark:border dark:border-gray-600" title={toolTip}>i</span>
                                    )}
                                </label>
                            )}
                            <TextField 
                                {...commonProps} 
                                type={type} 
                                placeholder={placeholder}
                                InputProps={{
                                    endAdornment: endAdornment ? <InputAdornment className='text-color-primary-light!' position="end">{endAdornment}</InputAdornment> : null,
                                }}
                            />
                            <FormHelperText error={true}>{validationError}</FormHelperText>
                        </div>
                    );

                case 'password':
                    return (
                        <div className="mb-4">
                            {labelTop && (
                                <label htmlFor={name} className="block mb-2 pt-0 text-sm font-medium color-primary dark:text-white">
                                    {labelTop}
                                    {toolTip && (
                                        <span className="ml-2 inline-block bg-black text-white rounded-full w-3 h-3 text-xs text-center leading-3 cursor-pointer text-[10px] dark:border dark:border-gray-600" title={toolTip}>i</span>
                                    )}
                                </label>
                            )}
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
                                                    '&:hover': { background: '#fff', padding: 0 },
                                                }}
                                            >
                                                {showPassword ? <VisibilityOff className="text-sm!" /> : <Visibility className="text-sm!" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormHelperText error={true}>{validationError}</FormHelperText>
                        </div>
                    );

                case 'textarea':
                    return (
                        <div className="mb-4">
                            {labelTop && (
                                <label htmlFor={name} className="block mb-2 text-sm font-medium color-primary dark:text-white">
                                    {labelTop}
                                    {toolTip && (
                                        <span className="ml-2 inline-block bg-black text-white rounded-full w-3 h-3 text-xs text-center leading-3 cursor-pointer text-[10px] dark:border dark:border-gray-600" title={toolTip}>i</span>
                                    )}
                                </label>
                            )}
                            <TextField
                                {...commonProps}
                                multiline
                                rows={rows}
                                placeholder={placeholder}
                            />
                            <FormHelperText error={true}>{validationError}</FormHelperText>
                        </div>
                    );

                case 'checkbox':
                    return (
                        <div className="mb-4">
                            <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 dark:bg-white/[0.05] dark:border-white/[0.1] hover:border-blue-100 transition-colors ${className || ''}`}>
                                <div className="flex flex-col pr-4">
                                    <span className="text-sm font-semibold text-color-primary dark:text-gray-200">
                                        {label}
                                    </span>
                                    {Config.helperText && (
                                        <span className="text-xs text-gray-500 mt-1">{Config.helperText}</span>
                                    )}
                                </div>
                                <Switch
                                    {...field}
                                    id={name}
                                    checked={Boolean(field.value)}
                                    onChange={(e) => {
                                        field.onChange({
                                            target: {
                                                name,
                                                value: e.target.checked
                                            }
                                        });
                                    }}
                                    className='text-color-primary!'
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#493e81',},
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'rgb(73 62 129 / 43%)',},
                                    }}
                                />
                            </div>
                        </div>
                    );

                case 'timezone':
                    return (
                        <div>     
                            <label htmlFor={name} className="block mb-2 text-sm font-medium text-color-primary dark:text-white">
                                {label}
                                {toolTip && (
                                    <span className="ml-2 inline-block bg-black text-white rounded-full w-3 h-3 text-xs text-center leading-3 cursor-pointer text-[10px] dark:border dark:border-gray-600" title={toolTip}>i</span>
                                )}
                            </label>
                            {mounted ? (
                                <TimezoneSelect
                                    value={field.value || ''}
                                    onChange={(tz) => {
                                        field.onChange({
                                            target: {
                                                name,
                                                value: tz.value,
                                            },
                                        });
                                    }}
                                    placeholder={placeholder}
                                    className={`w-full  -mt-[9px]! ${className || ''}`}
                                    styles={timezoneSelectStyle} 
                                />
                            ) : (
                                <TextField {...commonProps} placeholder={placeholder} />
                            )}
                        </div>
                    );
                
                default:
                    return null;
            }
        };
    }, [showPassword, label, style, type, Config.helperText, labelTop, placeholder, className, rows, toolTip, name, mounted, endAdornment]);

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

