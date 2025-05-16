'use client';

import React, { useState, useMemo } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    TextFieldProps,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Field, FieldProps } from 'formik';
import { SxProps, Theme } from '@mui/system';

type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea';

interface FieldPropsConfig {
    name: string;
    label: string;
    type: FieldType;
    size?: number;
    style?: SxProps<Theme>;
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

    const { name, label, type, size, style } = Config;

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
                error,
                helperText,
                fullWidth: true,
                variant: 'outlined',
                sx: style,
            };

            switch (type) {
                case 'text':
                case 'email':
                case 'number':
                return <TextField {...commonProps} type={type} />;
                case 'password':
                return (
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
                );
                case 'textarea':
                return <TextField {...commonProps} multiline rows={4} />;
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

