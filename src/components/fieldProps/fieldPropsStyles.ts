import { SxProps } from '@mui/system';

export const customInputStyles:SxProps = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#d1d5db',
        },
        '&:hover fieldset': {
            borderColor: '#d1d5db',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#d1d5db',
            boxShadow: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#51A1FF',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#51A1FF', 
    },
    '& .MuiOutlinedInput-input': {
        color: '#51A1FF', 
    },
};
