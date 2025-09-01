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
    FETCH_REAL_TIME_BOT,
    WEBSOCKET_CONNECTED,
    WEBSOCKET_DISCONNECTED,
    WEBSOCKET_ERROR,
} from './actionTypes';
  
// Success and Failure Payload Types
export interface SuccessPayload {
    bot: any[];
    id?: string;
}

export interface WebsoketStatus {
    type: string | any;
}
  
export interface FailurePayload {
    error: any;
}
  
// WebSocket Error Payload
export interface WebSocketErrorPayload {
    error: string | any;
    details?: string | any;
    message?: string | any; 
}
  
export interface botState {
    pending: {
      fetch: boolean;
      post: boolean;
      update: boolean;
      delete: boolean;
    };
    bot: any[];
    error: string | null;
    webSocketStatus: string | null;
}
  
// Fetch type
export interface FetchBotRequest {
    type: typeof FETCH_BOT_REQUEST;
}
  
export type FetchBotSuccess = {
    type: typeof FETCH_BOT_SUCCESS;
    payload: SuccessPayload;
};
  
export type FetchBotFailure = {
    type: typeof FETCH_BOT_FAILURE;
    payload: FailurePayload;
};
  
// Post type
export type PostBotRequest = {
    type: typeof POST_BOT_REQUEST;
};
  
export type PostFetchBotRequest = {
    type: typeof FETCH_REAL_TIME_BOT;
};
  
export type PostBotSuccess = {
    type: typeof POST_BOT_SUCCESS;
    payload: SuccessPayload;
};
  
export type PostBotFailure = {
    type: typeof POST_BOT_FAILURE;
    payload: FailurePayload;
};
  
// Update type
export type UpdateBotRequest = {
    type: typeof UPDATE_BOT_REQUEST;
};
  
export type UpdateBotSuccess = {
    type: typeof UPDATE_BOT_SUCCESS;
    payload: SuccessPayload;
};
  
export type UpdateBotFailure = {
    type: typeof UPDATE_BOT_FAILURE;
    payload: FailurePayload;
};
  
// Delete type
export type DeleteBotRequest = {
    type: typeof DELETE_BOT_REQUEST;
};
  
export type DeleteBotSuccess = {
    type: typeof DELETE_BOT_SUCCESS;
    payload: SuccessPayload;
};
  
export type DeleteBotFailure = {
    type: typeof DELETE_BOT_FAILURE;
    payload: FailurePayload;
};
  
// WebSocket Actions
export type WebSocketConnected = {
    type: typeof WEBSOCKET_CONNECTED;
};
  
export type WebSocketDisconnected = {
    type: typeof WEBSOCKET_DISCONNECTED;
};
  
export type WebSocketError = {
    type: typeof WEBSOCKET_ERROR;
    payload: WebSocketErrorPayload;
};

export type WebSocketMessage = { 
    connected: boolean; 
    closed: any;
    error:any;
    data:any;
};
  
// Combined actions type
export type botActions =
| FetchBotRequest
| FetchBotSuccess
| FetchBotFailure
| PostBotRequest
| PostBotSuccess
| PostBotFailure
| DeleteBotRequest
| DeleteBotSuccess
| DeleteBotFailure
| UpdateBotRequest
| UpdateBotSuccess
| UpdateBotFailure
| PostFetchBotRequest
| WebSocketConnected
| WebSocketDisconnected
| WebSocketError;

  