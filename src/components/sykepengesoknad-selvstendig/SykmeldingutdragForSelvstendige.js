import React from 'react';
import PropTypes from 'prop-types';
import {
    Bjorn,
    getLedetekst,
    sykmelding as sykmeldingPt,
    SykmeldingNokkelOpplysning,
    SykmeldingPerioder,
    tilLesbarDatoMedArstall,
    Utvidbar,
} from '@navikt/digisyfo-npm';
import { SykmeldingopplysningForsikring, SykmeldingopplysningFravaersperioder } from '../sykmeldingstatuspanel/SykmeldingStatuspanelOpplysning';

const SykmeldingUtdragForSelvstendige = ({ erApen, sykmelding, erOppdelt }) => {
    return (<Utvidbar
        className="blokk js-sykmelding-utdrag"
        Overskrift="h2"
        erApen={erApen}
        visLukklenke={!erApen}
        tittel={getLedetekst('sykepengesoknad.sykmelding-utdrag.tittel')}
        variant="lilla"
        ikon="svg/plaster.svg"
        ikonHover="svg/plaster_hover.svg"
        ikonAltTekst="Plaster-ikon">
        <div>
            <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
            {
                erOppdelt
                && <Bjorn rootUrl="/sykefravaer" className="blokk" nokkel="sykepengesoknad.sykmelding-utdrag.oppdelt.bjorn" />
            }
            <SykmeldingNokkelOpplysning
                tittel={getLedetekst('sykepengesoknad.sykmelding-utdrag.dato-sykmeldingen-ble-skrevet')}>
                <p className="js-utstedelsesdato">{tilLesbarDatoMedArstall(sykmelding.bekreftelse.utstedelsesdato)}</p>
            </SykmeldingNokkelOpplysning>
            <SykmeldingNokkelOpplysning
                tittel={getLedetekst('din-sykmelding.arbeidssituasjon.tittel.2')}>
                <p className="js-arbeidssituasjon">{getLedetekst(`din-sykmelding.arbeidssituasjon.alternativ.${sykmelding.valgtArbeidssituasjon.toLowerCase()}`)}</p>
            </SykmeldingNokkelOpplysning>
            <SykmeldingopplysningFravaersperioder sykmelding={sykmelding} />
            <SykmeldingopplysningForsikring sykmelding={sykmelding} />
        </div>
    </Utvidbar>);
};

SykmeldingUtdragForSelvstendige.propTypes = {
    erApen: PropTypes.bool,
    erOppdelt: PropTypes.bool,
    sykmelding: sykmeldingPt,
};

export default SykmeldingUtdragForSelvstendige;
