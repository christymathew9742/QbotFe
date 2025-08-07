import { SxProps } from '@mui/system';

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


export const customInputStyles: SxProps = {
    '& .MuiPickersInputBase-root' :{
        borderRadius: '.5rem',
        backgroundColor: 'transparent',
        height: '45px',
        '& .MuiPickersSectionList-root': {
            backgroundColor: 'transparent',
            color:'white',
        },
        '& .MuiIconButton-root' : {
            color:'white',
        },
        '&:hover fieldset': {
            borderWidth: '1px !important',
            borderColor: 'rgb(206 210 216)',
        },
        '&.Mui-focused fieldset': {
            borderColor:'#4b1dd8!important',
            borderWidth: '1px !important',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            outline:'none!important',
        },
    },
    '& .MuiPickerPopper-paper' : {
        backgroundColor:'black',
        color:'white',
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
            borderColor:'#4b1dd8!important',
            borderWidth: '1px !important',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            outline:'none!important',
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
    '.dark & fieldset': {
        borderColor:'#344054',
    },
    '.dark &:hover fieldset': {
        borderColor:'#344054'
    },
};






