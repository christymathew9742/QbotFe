import { SxProps } from '@mui/system';

export const customInputStyles:SxProps = {
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


