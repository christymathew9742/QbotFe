// import {
//     FETCH_BOT_REQUEST,
//     FETCH_BOT_SUCCESS,
//     FETCH_BOT_FAILURE,
//     POST_BOT_REQUEST,
//     POST_BOT_SUCCESS,
//     POST_BOT_FAILURE,
//     UPDATE_BOT_REQUEST,
//     UPDATE_BOT_SUCCESS,
//     UPDATE_BOT_FAILURE,
//     DELETE_BOT_REQUEST,
//     DELETE_BOT_SUCCESS,
//     DELETE_BOT_FAILURE,
//     FETCH_REYAL_TIME_BOT,
//     WEBSOCKET_CONNECTED,
//     WEBSOCKET_DISCONNECTED,
//     WEBSOCKET_ERROR,
// } from './actionTypes';
  
// import { botActions, botState } from './types';
  
// const initialState: botState = {
//     pending: false,
//     bot: [],
//     error: null,
//     webSocketStatus: 'disconnected',
// };
  
// export default (state = initialState, action: botActions) => {
//     switch (action.type) {
//     // Fetch ChatBot
//     case FETCH_BOT_REQUEST:
//         return {
//             ...state,
//             pending: true,
//         };
//     case FETCH_BOT_SUCCESS:
//         return {
//             ...state,
//             pending: false,
//             bot: action.payload.bot,
//             error: null,
//         };
//     case FETCH_BOT_FAILURE:
//         return {
//             ...state,
//             pending: false,
//             bot: [],
//             error: action.payload.error,
//         };
  
//     // Post ChatBot
//     case POST_BOT_REQUEST:
//         return {
//             ...state,
//             pending: true,
//             botResponse: null,
//         };
//     case POST_BOT_SUCCESS:
//         return {
//             ...state,
//             pending: false,
//             botResponse: action.payload,
//             bot: null,
//             error: null,
//         };
//     case POST_BOT_FAILURE:
//         return {
//             ...state,
//             pending: false,
//             botResponse: null,
//             error: action.payload.error,
//         };
  
//     // Post fetch ChatBot
//     case FETCH_REYAL_TIME_BOT:
//         return {
//             ...state,
//             pending: true,
//             botResponse: null,
//         };
  
//     // Update ChatBot
//     case UPDATE_BOT_REQUEST:
//         return {
//             ...state,
//             pending: true,
//             botResponse: null,
//         };
//     case UPDATE_BOT_SUCCESS:
//         return {
//             ...state,
//             pending: false,
//             botResponse: action.payload,
//             bot: state.bot.map((botItem) =>
//                 botItem.id === action.payload.id
//                 ? { ...botItem, ...action.payload }
//                 : botItem
//             ),
//             error: null,
//         };
//     case UPDATE_BOT_FAILURE:
//         return {
//             ...state,
//             pending: false,
//             botResponse: null,
//             error: action.payload.error,
//         };
  
//     // Delete ChatBot
//     case DELETE_BOT_REQUEST:
//         return {
//             ...state,
//             pending: true,
//             botResponse: null,
//         };
//     case DELETE_BOT_SUCCESS:
//         return {
//             ...state,
//             pending: false,
//             botResponse: action.payload,
//             bot: state.bot.filter((botItem) => botItem.id && botItem.id !== action.payload),
//             error: null,
//         };
//     case DELETE_BOT_FAILURE:
//         return {
//             ...state,
//             pending: false,
//             botResponse: null,
//             error: action.payload.error,
//         };
  
//     // WebSocket Actions
//     case WEBSOCKET_CONNECTED:
//         return {
//             ...state,
//             webSocketStatus: 'connected',
//         };
  
//     case WEBSOCKET_DISCONNECTED:
//         return {
//             ...state,
//             webSocketStatus: 'disconnected',
//         };
  
//     case WEBSOCKET_ERROR:
//         return {
//             ...state,
//             webSocketStatus: 'error',
//             error: action.payload.error, 
//         };
  
//     default:
//         return state;
//     }
// };
  
import {
    FETCH_BOT_REQUEST,
    FETCH_BOT_SUCCESS,
    FETCH_BOT_FAILURE,
    POST_BOT_REQUEST,
    POST_BOT_SUCCESS,
    POST_BOT_FAILURE,
    UPDATE_BOT_REQUEST,
    UPDATE_BOT_SUCCESS,
    UPDATE_BOT_FAILURE,
    DELETE_BOT_REQUEST,
    DELETE_BOT_SUCCESS,
    DELETE_BOT_FAILURE,
    FETCH_REYAL_TIME_BOT,
    WEBSOCKET_CONNECTED,
    WEBSOCKET_DISCONNECTED,
    WEBSOCKET_ERROR,
} from './actionTypes';
  
import { botActions, botState } from './types';
  
const initialState: botState = {
    pending: {
    fetch: false,
    post: false,
    update: false,
    delete: false,
    },
    bot: [],
    error: null,
    webSocketStatus: 'disconnected',
};
  
export default (state = initialState, action: botActions) => {
    switch (action.type) {
        // Fetch ChatBot
        case FETCH_BOT_REQUEST:
            return {
            ...state,
            pending: { ...state.pending, fetch: true },
            };
        case FETCH_BOT_SUCCESS:
            return {
            ...state,
            pending: { ...state.pending, fetch: false },
            bot: action.payload.bot,
            error: null,
            };
        case FETCH_BOT_FAILURE:
            return {
            ...state,
            pending: { ...state.pending, fetch: false },
            bot: [],
            error: action.payload.error,
            };
  
        // Post ChatBot
        case POST_BOT_REQUEST:
            return {
            ...state,
            pending: { ...state.pending, post: true },
            botResponse: null,
            };
        case POST_BOT_SUCCESS:
            return {
            ...state,
            pending: { ...state.pending, post: false },
            botResponse: action.payload,
            bot: null,
            error: null,
            };
        case POST_BOT_FAILURE:
            return {
            ...state,
            pending: { ...state.pending, post: false },
            botResponse: null,
            error: action.payload.error,
            };
    
        // Post fetch ChatBot (not sure what this does, keeping as is)
        case FETCH_REYAL_TIME_BOT:
            return {
            ...state,
            pending: { ...state.pending, fetch: true },  // Assuming fetch here
            botResponse: null,
            };
    
        // Update ChatBot
        case UPDATE_BOT_REQUEST:
            return {
            ...state,
            pending: { ...state.pending, update: true },
            botResponse: null,
            };
        case UPDATE_BOT_SUCCESS:
            return {
            ...state,
            pending: { ...state.pending, update: false },
            botResponse: action.payload,
            bot: state.bot.map((botItem) =>
                botItem.id === action.payload.id ? { ...botItem, ...action.payload } : botItem
            ),
            error: null,
            };
        case UPDATE_BOT_FAILURE:
            return {
            ...state,
            pending: { ...state.pending, update: false },
            botResponse: null,
            error: action.payload.error,
            };
    
        // Delete ChatBot
        case DELETE_BOT_REQUEST:
            return {
            ...state,
            pending: { ...state.pending, delete: true },
            botResponse: null,
            };
        case DELETE_BOT_SUCCESS:
            return {
            ...state,
            pending: { ...state.pending, delete: false },
            botResponse: action.payload,
            bot: state.bot.filter((botItem) => botItem.id && botItem.id !== action.payload),
            error: null,
            };
        case DELETE_BOT_FAILURE:
            return {
            ...state,
            pending: { ...state.pending, delete: false },
            botResponse: null,
            error: action.payload.error,
            };
    
        // WebSocket Actions
        case WEBSOCKET_CONNECTED:
            return {
            ...state,
            webSocketStatus: 'connected',
            };
    
        case WEBSOCKET_DISCONNECTED:
            return {
            ...state,
            webSocketStatus: 'disconnected',
            };
    
        case WEBSOCKET_ERROR:
            return {
            ...state,
            webSocketStatus: 'error',
            error: action.payload.error,
            };
    
        default:
            return state;
    }
};
  