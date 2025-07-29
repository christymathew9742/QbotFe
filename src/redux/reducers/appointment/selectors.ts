import { createSelector } from 'reselect';
import { RootState } from '@/redux/store';

const getAppointment = (state: RootState) => state?.appointmentReducer?.appointment;
const getError = (state: RootState) => state?.appointmentReducer?.error;
const getPending = (state: RootState) => state?.appointmentReducer?.pending;

export const getAppointmentSelector = createSelector(getAppointment, (appointment:any) => appointment);
export const getErrorSelector = createSelector(getError, (error:any) => error);
export const getAllPending = createSelector(getPending, (pending) => pending);

// New selectors for each pending flag
export const getFetchPendingSelector = createSelector(
  getPending,
  (pending) => pending.fetch
);
export const getPostPendingSelector = createSelector(
  getPending,
  (pending) => pending.post
);

export const getUpdatePendingSelector = createSelector(
  getPending,
  (pending) => pending.update
);

export const getDeletePendingSelector = createSelector(
  getPending,
  (pending) => pending.delete
);



