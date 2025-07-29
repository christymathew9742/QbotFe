import { all, fork } from 'redux-saga/effects';
import UserSagaa from './reducers/user/sagas';
import BotSaga from './reducers/chatBot/sagas';
import AppointmentSaga from './reducers/appointment/sagas';

export function* rootSaga() {
    yield all([fork(UserSagaa)]);
    yield all([fork(BotSaga)]);
    yield all([fork(AppointmentSaga)]);
}