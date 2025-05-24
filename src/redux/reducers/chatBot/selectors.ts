import { createSelector } from 'reselect';
import { RootState } from '@/redux/store';

const getWebSocketStatus = (state: RootState) => state?.botReducer?.webSocketStatus;
const getBot = (state: RootState) => state?.botReducer?.bot;
const getError = (state: RootState) => state?.botReducer?.error;
const getPending = (state: RootState) => state?.botReducer?.pending;

export const getBotSelector = createSelector(getBot, (bot:any) => bot);
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

// WebSocket Status Selector
export const getWebSocketStatusSelector = createSelector(
  getWebSocketStatus,
  (webSocketStatus: string | null) => webSocketStatus
);

