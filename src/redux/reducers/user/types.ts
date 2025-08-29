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
  
  export interface SuccessPayload {
    user: any;
    error?: unknown;
  }
  export interface WhatsAppSuccessPayload {
    whatsAppUsers: any[];
  }

  export interface WhatsAppGlobalSuccessPayload {
    globalData: any
  }
  export interface FailurePayload {
    error: string;
    log?: unknown;
  }
  
  export interface userState {
    pending: {
       fetch: boolean;
        post: boolean;
        update: boolean;
        whatsAppUser: boolean;
        globalData: boolean;
    };
    user: any | null;
    error: string | null;
    whatsAppUsers: any[];
    globalData: any[],
    log?: unknown;
  }
  
  // Requests
  export interface FetchUsertRequest {
    type: typeof FETCH_USER_REQUEST;
    data: any;
  }
  export type FetchUserSuccess = {
    type: typeof FETCH_USER_SUCCESS;
    payload: SuccessPayload;
  };
  export type FetchUserFailure = {
    type: typeof FETCH_USER_FAILURE;
    payload: FailurePayload;
  };
  
  //whatsapp user request
  export interface FetchWhatsAppUsertRequest {
    type: typeof FETCH_WHATSAPP_USER_REQUEST;
    data: any;
  }
  export type FetchWhatsAppUserSuccess = {
    type: typeof FETCH_WHATSAPP_USER_SUCCESS;
    payload: WhatsAppSuccessPayload;
  };
  export type FetchWhatsAppUserFailure = {
    type: typeof FETCH_WHATSAPP_USER_FAILURE;
    payload: FailurePayload;
  };

  //whatsap global data
  export interface FetchWhatsApptRequest {
    type: typeof FETCH_WHATSAPP_REQUEST;
    data: any;
  }
  export type FetchWhatsAppSuccess = {
    type: typeof FETCH_WHATSAPP_SUCCESS;
    payload: WhatsAppGlobalSuccessPayload;
  };
  export type FetchWhatsAppFailure = {
    type: typeof FETCH_WHATSAPP_FAILURE;
    payload: FailurePayload;
  };
  
  // Post
  export type PostUserRequest = {
    type: typeof POST_USER_REQUEST;
  };
  export type PostUserSuccess = {
    type: typeof POST_USER_SUCCESS;
    payload: SuccessPayload;
  };
  export type PostUserFailure = {
    type: typeof POST_USER_FAILURE;
    payload: FailurePayload;
  };
  
  // Update
  export type UpdateUserRequest = {
    type: typeof UPDATE_USER_REQUEST;
  };
  export type UpdateUserSuccess = {
    type: typeof UPDATE_USER_SUCCESS;
    payload: SuccessPayload;
  };
  export type UpdateUserFailure = {
    type: typeof UPDATE_USER_FAILURE;
    payload: FailurePayload;
  };
  
  export type userActions =
    | FetchUsertRequest
    | FetchUserSuccess
    | FetchUserFailure
    | PostUserRequest
    | PostUserSuccess
    | PostUserFailure
    | UpdateUserFailure
    | UpdateUserRequest
    | UpdateUserSuccess
    | FetchWhatsAppUsertRequest
    | FetchWhatsAppUserFailure
    | FetchWhatsAppUserSuccess
    | FetchWhatsApptRequest
    | FetchWhatsAppSuccess
    | FetchWhatsAppFailure;
  