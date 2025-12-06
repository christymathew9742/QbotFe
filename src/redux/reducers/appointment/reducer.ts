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
  
import { appointmentActions, appointmentState } from './types';
  
const initialState: appointmentState = {
    pending: {
        fetch: false,
        post: false,
        update: false,
        delete: false,
    },
    appointment: [],
    error: null,
};
  
export default (state = initialState, action: appointmentActions) => {
    switch (action.type) {
        // Fetch ChatBot
        case FETCH_APPOINTMENT_REQUEST:
            return {
                ...state,
                pending: { ...state.pending, fetch: true },
            };
        case FETCH_APPOINTMENT_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, fetch: false },
                appointment: action.payload.appointment,
                error: null,
            };
        case FETCH_APPOINTMENT_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, fetch: false },
                appointment: [],
                error: action.payload.error,
            };
  
        // Post ChatBot
        case POST_APPOINTMENT_REQUEST:
            return {
                ...state,
                pending: { ...state.pending, post: true },
                appointmentResponse: null,
            };
        case POST_APPOINTMENT_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, post: false },
                appointmentResponse: action.payload,
                appointment: null,
                error: null,
            };
        case POST_APPOINTMENT_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, post: false },
                appointmentResponse: null,
                error: action.payload.error,
            };
    
        // Update ChatBot
        case UPDATE_APPOINTMENT_REQUEST:
            return {
                ...state,
                pending: { ...state.pending, update: true },
                bappointmentResponse: null,
            };
        case UPDATE_APPOINTMENT_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, update: false },
                appointmentResponse: action.payload,
                error: null,
            };
        case UPDATE_APPOINTMENT_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, update: false },
                appointmentResponse: null,
                error: action.payload.error,
            };
    
        // Delete ChatBot
        case DELETE_APPOINTMENT_REQUEST:
            return {
                ...state,
                pending: { ...state.pending, delete: true },
                appointmentResponse: null,
            };
        case DELETE_APPOINTMENT_SUCCESS:
            return {
                ...state,
                pending: { ...state.pending, delete: false },
                appointmentResponse: action.payload,
                appointment: state.appointment.filter((appointmentItem) => appointmentItem.id && appointmentItem.id !== action.payload),
                error: null,
            };
        case DELETE_APPOINTMENT_FAILURE:
            return {
                ...state,
                pending: { ...state.pending, delete: false },
                appointmentResponse: null,
                error: action.payload.error,
            };
    
        default:
            return state;
    }
};
  