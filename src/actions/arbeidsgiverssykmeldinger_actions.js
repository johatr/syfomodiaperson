export function hentArbeidsgiversSykmeldingerFeilet() {
    return {
        type: 'HENT_ARBEIDSGIVERS_SYKMELDINGER_FEILET',
    };
}

export function henterArbeidsgiversSykmeldinger() {
    return {
        type: 'HENTER_ARBEIDSGIVERS_SYKMELDINGER',
    };
}

export function hentArbeidsgiversSykmeldinger(fnr) {
    return {
        type: 'HENT_ARBEIDSGIVERS_SYKMELDINGER_FORESPURT',
        fnr,
    };
}
