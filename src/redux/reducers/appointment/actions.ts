import {
  FETCH_APPOINTMENT_REQUEST,
  FETCH_APPOINTMENT_SUCCESS,
  FETCH_APPOINTMENT_FAILURE,
  POST_APPOINTMENT_REQUEST,
  POST_APPOINTMENT_SUCCESS,
  POST_APPOINTMENT_FAILURE,
  UPDATE_APPOINTMENT_REQUEST,
  UPDATE_APPOINTMENT_SUCCESS,
  UPDATE_APPOINTMENT_FAILURE,
  DELETE_APPOINTMENT_REQUEST,
  DELETE_APPOINTMENT_SUCCESS,
  DELETE_APPOINTMENT_FAILURE,
} from './actionTypes';

import {
  FetchAppointmentSuccess,
  SuccessPayload,
  FetchAppointmentFailure,
  FailurePayload,
} from './types';

// Fetch Appointment
export const fetchAppointmentRequest = (
  payload: any
): any => ({
  type: FETCH_APPOINTMENT_REQUEST,
  payload
});

export const fetchAppointmentSuccess = (payload: SuccessPayload): FetchAppointmentSuccess => ({
  type: FETCH_APPOINTMENT_SUCCESS,
  payload,
});

export const fetchAppointmentFailure = (payload: FailurePayload): FetchAppointmentFailure => ({
  type: FETCH_APPOINTMENT_FAILURE,
  payload,
});

// Post Appointment
export const postAppointmentRequest = (payload: any = ''): any => ({
  type: POST_APPOINTMENT_REQUEST,
  payload,
});

export const postAppointmentSuccess = (payload: SuccessPayload): any => ({
  type: POST_APPOINTMENT_SUCCESS,
  payload,
});

export const postAppointmentFailure = (payload: FailurePayload): any => ({
  type: POST_APPOINTMENT_FAILURE,
  payload,
});


// Update Appointment
export const updateAppointmentRequest = (payload?: any): any => ({
  type: UPDATE_APPOINTMENT_REQUEST,
  payload,
});

export const updateAppointmentSuccess = (payload: SuccessPayload): any => ({
  type: UPDATE_APPOINTMENT_SUCCESS,
  payload,
});

export const updateAppointmentFailure = (payload: FailurePayload): any => ({
  type: UPDATE_APPOINTMENT_FAILURE,
  payload,
});

// Delete Appointment
export const deleteAppointmentRequest = (payload: any = ''): any => ({
  type: DELETE_APPOINTMENT_REQUEST,
  payload,
});

export const deleteAppointmentSuccess = (payload: any) => ({
  type: DELETE_APPOINTMENT_SUCCESS,
  payload,
});

export const deleteAppointmentFailure = (payload: FailurePayload) => ({
  type: DELETE_APPOINTMENT_FAILURE,
  payload,
});





