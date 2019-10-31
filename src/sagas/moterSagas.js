import { call, put, fork, takeEvery, all } from 'redux-saga/effects';
import { log } from '@navikt/digisyfo-npm';
import { post, get } from '../api';
import history from '../history';
import * as actions from '../actions/moter_actions';
import * as historikkActions from '../actions/historikk_actions';
import * as veilederoppgaverActions from '../actions/veilederoppgaver_actions';

export function* opprettMote(action) {
    yield put(actions.oppretterMote());
    try {
        yield call(post, `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/moter`, action.data);
        yield put(actions.hentMoter(action.data.fnr));
        yield put(historikkActions.hentHistorikk(action.data.fnr, 'MOTER'));
    } catch (e) {
        log(e);
        yield put(actions.opprettMoteFeilet());
    }
}

export function* hentMoter(action) {
    yield put(actions.henterMoter());
    try {
        const data = yield call(get, `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/moter?fnr=${action.fnr}&henttpsdata=true&limit=1`);
        yield put(actions.moterHentet(data));
    } catch (e) {
        if (e.status === 403) {
            yield put(actions.hentMoterIkkeTilgang(e.tilgang));
            return;
        }
        log(e);
        yield put(actions.hentMoterFeilet());
    }
}

export function* avbrytMote(action) {
    yield put(actions.avbryterMote(action.uuid));
    try {
        yield call(post, `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/moter/${action.uuid}/avbryt?varsle=${action.varsle}`);
        yield put(actions.moteAvbrutt(action.uuid));
        yield put(historikkActions.hentHistorikk(action.fnr, 'MOTER'));
        yield put(veilederoppgaverActions.alleSvarMottattOppgaveBehandlet());
        history.replace(`/sykefravaer/${action.fnr}/mote`);
    } catch (e) {
        log(e);
        yield put(actions.avbrytMoteFeilet());
    }
}

export function* bekreftMote(action) {
    yield put(actions.bekrefterMote());
    try {
        yield call(post, `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/moter/${action.moteUuid}/bekreft?valgtAlternativId=${action.valgtAlternativId}`);
        yield put(actions.moteBekreftet(action.moteUuid, action.valgtAlternativId, new Date()));
        yield put(historikkActions.hentHistorikk(action.fnr, 'MOTER'));
        yield put(veilederoppgaverActions.alleSvarMottattOppgaveBehandlet());
        history.replace(`/sykefravaer/${action.fnr}/mote`);
    } catch (e) {
        log(e);
        yield put(actions.bekreftMoteFeilet());
    }
}

export function* opprettFlereAlternativ(action) {
    yield put(actions.oppretterFlereAlternativ());
    try {
        const url = `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/moter/${action.moteUuid}/nyealternativer`;
        yield call(post, url, action.data);
        yield put(historikkActions.hentHistorikk(action.fnr, 'MOTER'));
        yield put(actions.opprettFlereAlternativBekreftet(action.data, action.moteUuid));
        yield put(veilederoppgaverActions.alleSvarMottattOppgaveBehandlet());
    } catch (e) {
        log(e);
        yield put(actions.opprettFlereAlternativFeilet());
    }
}

export function* watchOpprettFlereAlternativ() {
    yield takeEvery('OPPRETT_FLERE_ALTERNATIV_FORESPURT', opprettFlereAlternativ);
}

function* watchOpprettMote() {
    yield takeEvery('OPPRETT_MOTE_FORESPURT', opprettMote);
}

function* watchAvbrytMote() {
    yield takeEvery('AVBRYT_MOTE_FORESPURT', avbrytMote);
}

function* watchBekreftMote() {
    yield takeEvery('BEKREFT_MOTE_FORESPURT', bekreftMote);
}

function* watchHentMoter() {
    yield takeEvery('HENT_MOTER_FORESPURT', hentMoter);
}

function* watchMoteOpprettet() {
    yield takeEvery('MOTE_OPPRETTET', hentMoter);
}

export default function* moterSagas() {
    yield all([
        fork(watchOpprettMote),
        fork(watchHentMoter),
        fork(watchAvbrytMote),
        fork(watchBekreftMote),
        fork(watchMoteOpprettet),
        fork(watchOpprettFlereAlternativ),
    ]);
}
