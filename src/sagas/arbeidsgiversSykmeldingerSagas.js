import {
    call,
    put,
    fork,
    takeEvery,
} from 'redux-saga/effects';
import { get } from '../api';
import * as actions from '../actions/arbeidsgiverssykmeldinger_actions';

export function* hentArbeidsgiversSykmeldinger(action) {
    yield put(actions.henterArbeidsgiversSykmeldinger());

    try {
        const data = yield call(get, `${process.env.REACT_APP_REST_ROOT}/sykmeldinger?fnr=${action.fnr}&type=arbeidsgiver`);
        yield put({ type: 'ARBEIDSGIVERS_SYKMELDINGER_HENTET', data });
    } catch (e) {
        yield put(actions.hentArbeidsgiversSykmeldingerFeilet());
    }
}

function* watchHentArbeidsgiversSykmeldinger() {
    yield takeEvery('HENT_ARBEIDSGIVERS_SYKMELDINGER_FORESPURT', hentArbeidsgiversSykmeldinger);
}

export default function* ArbeidsgiversSykmeldingerSagas() {
    yield fork(watchHentArbeidsgiversSykmeldinger);
}
