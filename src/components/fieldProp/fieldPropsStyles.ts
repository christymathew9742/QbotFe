import { SxProps } from '@mui/system';
import { GroupBase, StylesConfig } from 'react-select';
import { ITimezone } from 'react-timezone-select';
type TimezoneStyleConfig = StylesConfig<ITimezone, boolean, GroupBase<ITimezone>>;

export const customInputStylesLoginBord:SxProps = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgb(206 210 216)',
            fontSize:'12px',
            color:'77818f',
        },
        '&:hover fieldset': {
            borderColor: 'rgb(206 210 216)',
            boxShadow: '0 0 4px rgba(20, 161, 255, .8)',
            fontSize:'12px',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgb(206 210 216)',
            fontSize:'12px',
            boxShadow: 'none',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#77818f',
        fontSize:'12px',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#77818f', 
        fontSize:'12px',
    },
    '& .MuiOutlinedInput-input': {
        color: '#77818f', 
        fontSize:'12px',
    },
};


export const customTextFieldStyle: SxProps = {
    '& .MuiInputBase-input': { 
        color: '#493e81b8' 
    },
    '& .MuiInputLabel-root': { 
        color: '#493e81b8' 
    },
    '& .MuiInputLabel-root.Mui-focused': { 
        color: '#493e81' 
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: 'transparent',
        '& fieldset': {
            borderColor: '#493e81b8',
            transition: 'border-color 0.3s ease-in-out, border-width 0.2s ease-in-out',
        },
        '&:hover fieldset': {
            borderColor: '#493e81b8',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#493e81b8', 
            borderWidth: '2px',
        },
    },
};

export const customInputStyles: SxProps = {
    '& .MuiPickersInputBase-root': {
        borderRadius: '.4rem',
        backgroundColor: 'transparent',
        height: '45px',
        '&:hover fieldset': {
            borderWidth: '1px !important',
            borderColor: 'rgb(206 210 216)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4b1dd8!important',
            borderWidth: '1px !important',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            outline: 'none!important',
        },
    },
    '& .MuiPickersLayout-root': {
        marginTop: '20px',
    },
    '& .MuiOutlinedInput-root': {
        minHeight: '2.75rem',
        width: '100%',
        borderRadius: '0.5rem',
        backgroundColor: 'transparent',
        paddingLeft: '1rem',
        fontSize: '0.875rem',
        color: '#9ca3af',
        boxShadow: 'none',
        '& .MuiInputBase-input': {
            paddingRight: '16px!important',
        },
        '& fieldset': {
            borderWidth: '1px !important',
            borderColor: 'rgb(206 210 216)',
        },
        '&:hover fieldset': {
            borderWidth: '1px !important',
            borderColor: 'rgb(206 210 216)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4b1dd8!important',
            borderWidth: '1px !important',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            outline: 'none!important',
        },
    },
    '& .MuiOutlinedInput-input': {
        color: '#9ca3af',
        fontSize: '0.875rem',
        padding: '0.625rem 0',
        '::placeholder': {
            color: '#9ca3af',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#9ca3af',
        fontSize: '0.875rem',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#9ca3af',
        fontSize: '0.875rem',
    },
};

export const timezoneSelectStyle: TimezoneStyleConfig = {
    control: (base, state) => ({
        ...base,
        borderRadius: 8,
        backgroundColor: "transparent",
        borderColor: "#493e81b8",
        boxShadow: "none",
        minHeight: "56px",
        "&:hover": {
            borderColor: "#493e81b8",
        },
    }),

    input: (base) => ({
        ...base,
        color: "#493e81b8",
    }),

    singleValue: (base) => ({
        ...base,
        color: "#493e81b8",
    }),

    placeholder: (base) => ({
        ...base,
        color: "#493e81b8",
    }),

    menu: (base) => ({
        ...base,
        zIndex: 1300,
    }),
};







