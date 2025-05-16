"use client";

import React, { useState, useMemo } from "react";
import { TextField, InputAdornment, IconButton, Grid } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Field } from "formik";

import { SxProps } from '@mui/system';

type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea';
interface FieldPropsConfig {
    name: string;
    label: string;
    type: FieldType;
    size?: number;
    style?: SxProps | null;
}

interface FieldPropsComponent {
    Config: FieldPropsConfig;
}

const gridItemProps = {
    xs: 12,
    sm: 6,
};

const FieldProps = ({ Config }: FieldPropsComponent) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(prev => !prev);

    const { name, label, type, size, style } = Config;

    const renderField = useMemo(() => {
        const fieldProps = (field: any) => {
            switch (type) {
                case 'text':
                case 'email':
                case 'number':
                    return (
                        <TextField
                            {...field}
                            variant="outlined"
                            fullWidth
                            sx={style}
                        />
                    );
                case 'password':
                    return (
                        <TextField
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            sx={style}
                            InputProps={{
                                ...field.InputProps,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{
                                                background: '#ffffff',
                                                padding: '0px',
                                                marginRight: '2px',
                                                '&:hover': {
                                                    background: '#ffffff',
                                                    padding: '0px',
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
                    return (
                        <TextField
                            {...field}
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            sx={style}
                        />
                    );
                default:
                    return null;
            }
        };

        return fieldProps;
    }, [showPassword, style, type]); 

    return type ? (
        <Grid {...gridItemProps} size={size} >
            <Field name={name}>
                {({ field, meta }: any) => {
                    const error = meta.touched && Boolean(meta.error);
                    const helperText = meta.touched ? meta.error : '';
                    return (
                        <>
                            {renderField({
                                ...field,
                                error,
                                helperText,
                                label,
                                type,
                            })}
                        </>
                    );
                }}
            </Field>
        </Grid>
    ) : null;
};

export default FieldProps;
