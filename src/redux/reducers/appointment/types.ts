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
  
// Success and Failure Payload Types
export interface SuccessPayload {
    appointment: any[];
    id?: string;
}
  
export interface FailurePayload {
    error: any;
}
  
export interface appointmentState {
    pending: {
      fetch: boolean;
      post: boolean;
      update: boolean;
      delete: boolean;
    };
    appointment: any[];
    error: string | null;
}
  
// Fetch type
export interface FetchAppointmentRequest {
    type: typeof FETCH_APPOINTMENT_REQUEST;
}
  
export type FetchAppointmentSuccess = {
    type: typeof FETCH_APPOINTMENT_SUCCESS;
    payload: SuccessPayload;
};
  
export type FetchAppointmentFailure = {
    type: typeof FETCH_APPOINTMENT_FAILURE;
    payload: FailurePayload;
};
  
// Post type
export type PostAppointmentRequest = {
    type: typeof POST_APPOINTMENT_REQUEST;
};
  
export type PostAppointmentSuccess = {
    type: typeof POST_APPOINTMENT_SUCCESS;
    payload: SuccessPayload;
};
  
export type PostAppointmentFailure = {
    type: typeof POST_APPOINTMENT_FAILURE;
    payload: FailurePayload;
};
  
// Update type
export type UpdateAppointmentRequest = {
    type: typeof UPDATE_APPOINTMENT_REQUEST;
};
  
export type UpdateAppointmentSuccess = {
    type: typeof UPDATE_APPOINTMENT_SUCCESS;
    payload: SuccessPayload;
};
  
export type UpdateAppointmentFailure = {
    type: typeof UPDATE_APPOINTMENT_FAILURE;
    payload: FailurePayload;
};
  
// Delete type
export type DeleteAppointmentRequest = {
    type: typeof DELETE_APPOINTMENT_REQUEST;
};
  
export type DeleteAppointmentSuccess = {
    type: typeof DELETE_APPOINTMENT_SUCCESS;
    payload: SuccessPayload;
};
  
export type DeleteAppointmentFailure = {
    type: typeof DELETE_APPOINTMENT_FAILURE;
    payload: FailurePayload;
};
  
// Combined actions type
export type appointmentActions =
| FetchAppointmentRequest
| FetchAppointmentSuccess
| FetchAppointmentFailure
| PostAppointmentRequest
| PostAppointmentSuccess
| PostAppointmentFailure
| UpdateAppointmentRequest
| UpdateAppointmentSuccess
| UpdateAppointmentFailure
| DeleteAppointmentRequest
| DeleteAppointmentSuccess
| DeleteAppointmentFailure


  