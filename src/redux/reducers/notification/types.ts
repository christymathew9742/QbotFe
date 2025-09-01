import {
    FETCH_NOTIFICATION_REQUEST,
    FETCH_NOTIFICATION_SUCCESS,
    FETCH_NOTIFICATION_FAILURE,
    UPDATE_NOTIFICATION_REQUEST,
    UPDATE_NOTIFICATION_SUCCESS,
    UPDATE_NOTIFICATION_FAILURE,
    WEBSOCKET_CONNECTED_NOTIFICATION,
    WEBSOCKET_DISCONNECTED_NOTIFICATION,
    WEBSOCKET_ERROR_NOTIFICATION,
    FETCH_REAL_TIME_NOTIFICATION,
} from './actionTypes';
  
// Success and Failure Payload Types
export interface SuccessPayload {
    notifications: any[];
    id?: string;
}

export interface WebSocketErrorPayload {
    error: string | any;
    details?: string | any;
    message?: string | any; 
}
  
export interface FailurePayload {
    error: any;
}
  
export interface notificationsState {
    pending: {
      fetch: boolean;
      post: boolean;
      update: boolean;
      delete: boolean;
    };
    notifications: any[];
    error: string | null;
    webSocketStatus: string | null;
}

export interface WebsoketStatus {
    type: string | any;
}

export type Notification = {
    _id?: string;
    profileName: string;
    flowTitle: string;
    lastUpdatedAt: string;
    whatsAppNumber: string;
    status: string;
};
  
export interface NotificationState {
    notifications: Notification[];
}
  
  
// Fetch type
export interface FetchNotificationsRequest {
    type: typeof FETCH_NOTIFICATION_REQUEST;
}
  
export type FetchNotificationsSuccess = {
    type: typeof FETCH_NOTIFICATION_SUCCESS;
    payload: SuccessPayload;
};
  
export type FetchNotificationsFailure = {
    type: typeof FETCH_NOTIFICATION_FAILURE;
    payload: FailurePayload;
};
  
// Update type
export type UpdateNotificationsRequest = {
    type: typeof UPDATE_NOTIFICATION_REQUEST;
};
  
export type UpdateNotificationsSuccess = {
    type: typeof UPDATE_NOTIFICATION_SUCCESS;
    payload: SuccessPayload;
};
  
export type UpdateNotificationsFailure = {
    type: typeof UPDATE_NOTIFICATION_FAILURE;
    payload: FailurePayload;
};

export type PostFetchAppoRequest = {
    type: typeof FETCH_REAL_TIME_NOTIFICATION;
};

// WebSocket Actions
export type WebSocketConnected = {
    type: typeof WEBSOCKET_CONNECTED_NOTIFICATION;
};
  
export type WebSocketDisconnected = {
    type: typeof WEBSOCKET_DISCONNECTED_NOTIFICATION;
};
  
export type WebSocketError = {
    type: typeof WEBSOCKET_ERROR_NOTIFICATION;
    payload: WebSocketErrorPayload;
};

export type WebSocketMessage = { 
    connected: boolean; 
    closed: any;
    error:any;
    data:any;
};

  
// Combined actions type
export type notificationsActions =
| FetchNotificationsRequest
| FetchNotificationsSuccess
| FetchNotificationsFailure
| UpdateNotificationsRequest
| UpdateNotificationsSuccess
| UpdateNotificationsFailure
| PostFetchAppoRequest
| WebSocketConnected
| WebSocketDisconnected
| WebSocketError





  