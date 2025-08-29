import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_WHATSAPP_USER_REQUEST,
  FETCH_WHATSAPP_USER_FAILURE,
  FETCH_WHATSAPP_USER_SUCCESS,
  POST_USER_REQUEST,
  POST_USER_SUCCESS,
  POST_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  FETCH_WHATSAPP_REQUEST,
  FETCH_WHATSAPP_SUCCESS,
  FETCH_WHATSAPP_FAILURE
} from './actionTypes';

import {
  FetchUsertRequest,
  FetchUserSuccess,
  SuccessPayload,
  FetchUserFailure,
  FailurePayload,
  FetchWhatsAppUserFailure,
  FetchWhatsAppUserSuccess,
  FetchWhatsAppUsertRequest,
  WhatsAppSuccessPayload,
  FetchWhatsApptRequest,
  FetchWhatsAppSuccess,
  FetchWhatsAppFailure,
  WhatsAppGlobalSuccessPayload,
} from './types';

//fetch User
export const fetchUserRequest = (data = ''): FetchUsertRequest => ({
  type: FETCH_USER_REQUEST,
  data,
});

export const fetchUserSuccess = (payload: SuccessPayload): FetchUserSuccess => ({
  type: FETCH_USER_SUCCESS,
  payload,
});

export const fetchUserFailure = (payload: FailurePayload): FetchUserFailure => ({
  type: FETCH_USER_FAILURE,
  payload,
});

//fetch WhatsApp User
export const fetchWhatsAppUserRequest = (data = ''): FetchWhatsAppUsertRequest => ({
  type: FETCH_WHATSAPP_USER_REQUEST,
  data,
});

export const fetchWhatsAppUserSuccess = (
  payload: WhatsAppSuccessPayload,
): FetchWhatsAppUserSuccess => ({
  type: FETCH_WHATSAPP_USER_SUCCESS,
  payload,
});

export const fetchWhatsAppUserFailure = (
  payload: FailurePayload
): FetchWhatsAppUserFailure => ({
  type: FETCH_WHATSAPP_USER_FAILURE,
  payload,
});

//fetch WhatsApp global data
export const fetchWhatsRequest = (data = ''): FetchWhatsApptRequest => ({
  type: FETCH_WHATSAPP_REQUEST,
  data,
});

export const fetchWhatsAppSuccess = (
  payload: WhatsAppGlobalSuccessPayload,
): FetchWhatsAppSuccess => ({
  type: FETCH_WHATSAPP_SUCCESS,
  payload,
});

export const fetchWhatsAppFailure = (
  payload: FailurePayload
): FetchWhatsAppFailure => ({
  type: FETCH_WHATSAPP_FAILURE,
  payload,
});

// Post ChatBot
export const postUserRequest = (payload: any = ''): any => ({
  type: POST_USER_REQUEST,
  payload,
});

export const postUserSuccess = (payload: SuccessPayload): any => ({
  type: POST_USER_SUCCESS,
  payload,
});

export const postUserFailure = (payload: FailurePayload): any => ({
  type: POST_USER_FAILURE,
  payload,
});

// Update ChatBot
export const updateUserRequest = (payload?: any): any => ({
  type: UPDATE_USER_REQUEST,
  payload,
});

export const updateUserSuccess = (payload: SuccessPayload): any => ({
  type: UPDATE_USER_SUCCESS,
  payload,
});

export const updateUserFailure = (payload: FailurePayload): any => ({
  type: UPDATE_USER_FAILURE,
  payload,
});

