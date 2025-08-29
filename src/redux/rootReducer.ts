import { combineReducers } from 'redux';

import userReducer from './reducers/user/reducer'
import botReducer from './reducers/chatBot/reducer'
import appointmentReducer from './reducers/appointment/reducer'
import notificationsReducer from './reducers/notification/reducer';

const rootReducer = combineReducers({
    userReducer,
    botReducer,
    appointmentReducer,
    notificationsReducer,
});
  
export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;