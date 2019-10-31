import { call, put, fork, all, takeEvery } from 'redux-saga/effects';
import { post, get } from '../api';
import * as actions from '../actions/veilederoppgaver_actions';
import * as historikkActions from '../actions/historikk_actions';
import * as actiontype from '../actions/actiontyper';

export function* veilederOppgaverSaga(action) {
    yield put(actions.henterVeilederOppgaver());
    try {
        const data = yield call(get, `${process.env.REACT_APP_VEILEDEROPPGAVERREST_ROOT}/veilederoppgaver/v1?fnr=${action.fnr}`);
        yield put(actions.veilederOppgaverHentet(data));
    } catch (e) {
        yield put(actions.hentVeilederOppgaverFeilet());
    }
}

function* watchHentVeilederOppgaver() {
    yield takeEvery(actiontype.HENT_VEILEDEROPPGAVER_FORESPURT, veilederOppgaverSaga);
}

export function* behandleVeilederOppgaverSaga(action) {
    yield put(actions.behandlerOppgave());
    try {
        const data = yield call(post, `${process.env.REACT_APP_VEILEDEROPPGAVERREST_ROOT}/veilederoppgaver/v1/actions/${action.id}`, action.oppgave);
        yield put(actions.oppgaveBehandlet(data, action.oppgave));
        yield put(historikkActions.hentHistorikk(action.fnr, 'OPPFOELGINGSDIALOG'));
    } catch (e) {
        yield put(actions.oppgaveBehandletFeilet());
    }
}

function* watchBehandleVeilederOppgaver() {
    yield takeEvery(actiontype.BEHANDLE_OPPGAVE_FORESPURT, behandleVeilederOppgaverSaga);
}

export default function* veilederoppgaverSagas() {
    yield all([
        fork(watchBehandleVeilederOppgaver),
        fork(watchHentVeilederOppgaver),
    ]);
}
