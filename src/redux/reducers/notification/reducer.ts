import {
    FETCH_NOTIFICATION_REQUEST,
    FETCH_NOTIFICATION_SUCCESS,
    FETCH_NOTIFICATION_FAILURE,
    UPDATE_NOTIFICATION_REQUEST,
    UPDATE_NOTIFICATION_SUCCESS,
    UPDATE_NOTIFICATION_FAILURE,
    FETCH_REAL_TIME_NOTIFICATION,
    WEBSOCKET_CONNECTED_NOTIFICATION,
    WEBSOCKET_DISCONNECTED_NOTIFICATION,
    WEBSOCKET_ERROR_NOTIFICATION,
} from './actionTypes';
  
import { notificationsActions, notificationsState } from './types';
  
const initialState: notificationsState = {
    pending: {
        fetch: false,
        post: false,
        update: false,
        delete: false,
    },
    notifications: [],
    error: null,
    webSocketStatus: 'disconnected',
};
  
export default (state = initialState, action: notificationsActions) => {
    switch (action.type) {
        
        // Fetch ChatBot
        case FETCH_NOTIFICATION_REQUEST:
            return {
                ...state,
                pending: { ...state.pending, fetch: true },
            };
        case FETCH_NOTIFICATION_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, fetch: false },
                notifications: action.payload.notifications,
                error: null,
            };
        case FETCH_NOTIFICATION_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, fetch: false },
                notifications: [],
                error: action.payload.error,
            };

        // Post fetch notificationss 
        case FETCH_REAL_TIME_NOTIFICATION:
            return {
                ...state,
                pending: { ...state.pending, fetch: true },  // Assuming fetch here
                botResponse: null,
            };

        // WebSocket Actions
        case WEBSOCKET_CONNECTED_NOTIFICATION:
            return {
                ...state,
                webSocketStatus: 'connected',
            };
    
        case WEBSOCKET_DISCONNECTED_NOTIFICATION:
            return {
                ...state,
                webSocketStatus: 'disconnected',
            };
    
        case WEBSOCKET_ERROR_NOTIFICATION:
            return {
                ...state,
                webSocketStatus: 'error',
                error: action.payload.error,
            };

    
        // Update Notifications
        case UPDATE_NOTIFICATION_REQUEST:
            return {
                ...state,
                pending: { ...state.pending, update: true },
                notificationsResponse: null,
            };
        case UPDATE_NOTIFICATION_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, update: false },
                notificationsResponse: action.payload,
                notifications: state.notifications.map((notificationsItem) =>
                    notificationsItem.id === action.payload.id ? { ...notificationsItem, ...action.payload } : notificationsItem
                ),
                error: null,
            };
        case UPDATE_NOTIFICATION_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, update: false },
                notificationsResponse: null,
                error: action.payload.error,
            };
    
        default:
            return state;
    }
};
  