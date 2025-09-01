import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    FETCH_WHATSAPP_USER_REQUEST,
    FETCH_WHATSAPP_USER_FAILURE,
    FETCH_WHATSAPP_USER_SUCCESS,
    FETCH_WHATSAPP_REQUEST,
    FETCH_WHATSAPP_FAILURE,
    FETCH_WHATSAPP_SUCCESS,
    POST_USER_REQUEST,
    POST_USER_SUCCESS,
    POST_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
} from './actionTypes';
  
import { userActions, userState } from './types';
  
const initialState: userState = {
    pending: {
        fetch: false,
        post: false,
        update: false,
        whatsAppUser: false,
        globalData: false
    },
    user: null,
    error: null,
    whatsAppUsers: [],
    globalData: [],
    log: null,
};
  
export default (state = initialState, action: userActions): userState => {
    switch (action.type) {
        //fetch user
        case FETCH_USER_REQUEST:
            return { ...state, pending: { ...state.pending, fetch: true } };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, fetch: false },
                user: {
                    ...state.user,
                    ...action.payload.user,
                },
                error: null,
            };
            
        case FETCH_USER_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, fetch: false },
                user: null,
                error: action.payload.error,
            };
  
        //fetch whatsApp user
        case FETCH_WHATSAPP_USER_REQUEST:
            return { 
                ...state, 
                pending: { ...state.pending, whatsAppUser: true } 
            };
        case FETCH_WHATSAPP_USER_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, whatsAppUser: false },
                whatsAppUsers: action.payload.whatsAppUsers,
                error: null,
            };
        case FETCH_WHATSAPP_USER_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, whatsAppUser: false },
                whatsAppUsers: [],
                error: action.payload.error,
            };

        //fetch whatsApp global data
        case FETCH_WHATSAPP_REQUEST:
            return { 
                ...state, 
                pending: { ...state.pending, globalData: true } 
            };
        case FETCH_WHATSAPP_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, whatsAppUser: false },
                globalData: action.payload.globalData,
                error: null,
            };
        case FETCH_WHATSAPP_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, globalData: false },
                globalData: [],
                error: action.payload.error,
            };
  
        // Post user
        case POST_USER_REQUEST:
            return {
                ...state,
                pending: { ...state.pending, post: true },
                error: null,
                log: null,
            };
        case POST_USER_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, post: false },
                user: action.payload.user,
                error: null,
                log: null,
            };
        case POST_USER_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, post: false },
                error: action.payload.error,
                log: action.payload.log,
            };
  
        // Update user
        case UPDATE_USER_REQUEST:
            return { ...state, pending: { ...state.pending, update: true } };
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, update: false },
                user: action.payload.user,
                error: null,
            };
        case UPDATE_USER_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, update: false },
                error: action.payload.error,
            };
  
        default:
            return state;
    }
};
