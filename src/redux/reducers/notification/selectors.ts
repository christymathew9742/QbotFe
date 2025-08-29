import { createSelector } from 'reselect';
import { RootState } from '@/redux/store';

const getWebSocketStatus = (state: RootState) => state?.notificationsReducer?.webSocketStatus;
const getNotifications = (state: RootState) => state?.notificationsReducer?.notifications;
const getError = (state: RootState) => state?.notificationsReducer?.error;
const getPending = (state: RootState) => state?.notificationsReducer?.pending;

export const getNotificationsSelector = createSelector(getNotifications, (notifications:any) => notifications);
export const getErrorSelector = createSelector(getError, (error:any) => error);
export const getAllPending = createSelector(getPending, (pending) => pending);

// New selectors for each pending flag
export const getFetchPendingSelector = createSelector (
  getPending,
  (pending) => pending.fetch
);

export const getUpdatePendingSelector = createSelector (
  getPending,
  (pending) => pending.update
);

// WebSocket Status Selector
export const getWebSocketStatusSelector = createSelector (
  getWebSocketStatus,
  (webSocketStatus: string | null) => webSocketStatus
);




