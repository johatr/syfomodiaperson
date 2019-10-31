import React from 'react';
import PropTypes from 'prop-types';
import { getLedetekst, toDatePrettyPrint } from '@navikt/digisyfo-npm';
import SykmeldingUtdrag from '../../connected-components/SykmeldingUtdrag';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes';
import Statuspanel, { StatusNokkelopplysning, Statusopplysninger } from '../Statuspanel';
import VerktoylinjeGjenapne from '../sykepengesoknad-felles/VerktoylinjeGjenapneSoknad';

const AvbruttSoknad = ({ sykepengesoknad, fnr }) => {
    return (<div>
        <Statuspanel>
            <Statusopplysninger>
                <StatusNokkelopplysning tittel="Status">
                    <p>
                        {getLedetekst(`sykepengesoknad.status.${sykepengesoknad.status}`)}
                    </p>
                </StatusNokkelopplysning>
                <StatusNokkelopplysning tittel="Dato avbrutt">
                    <p>
                        {toDatePrettyPrint(sykepengesoknad.avbruttDato)}
                    </p>
                </StatusNokkelopplysning>
            </Statusopplysninger>
            <VerktoylinjeGjenapne soknad={sykepengesoknad} />
        </Statuspanel>
        <SykmeldingUtdrag soknad={sykepengesoknad} fnr={fnr} erApen />
    </div>);
};

AvbruttSoknad.propTypes = {
    sykepengesoknad: sykepengesoknadPt,
    fnr: PropTypes.string,
};

export default AvbruttSoknad;
