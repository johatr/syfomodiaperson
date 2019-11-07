import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Container, mapStateToProps } from '../../src/containers/SykepengesoknadContainer';
import soknader from '../../src/reducers/soknader';
import sykepengesoknader from '../../src/reducers/sykepengesoknader';
import ledetekster from '../../src/reducers/ledetekster';
import sykmeldinger from '../../src/reducers/sykmeldinger';
import { soknaderHentet } from '../../src/actions/soknader_actions';
import mockSykepengesoknader from '../mockdata/mockSykepengesoknader';
import mockSoknader from '../mockdata/mockSoknader';
import { sykepengesoknaderHentet } from '../../src/actions/sykepengesoknader_actions';
import SykepengesoknadArbeidstaker from '../../src/components/sykepengesoknad-arbeidstaker/SykepengesoknadArbeidstaker';
import Feilmelding from '../../src/components/Feilmelding';
import SykepengesoknadSelvstendig from '../../src/components/sykepengesoknad-selvstendig/SykepengesoknadSelvstendig';
import * as toggleSelectors from '../../src/selectors/toggleSelectors';
import SykepengesoknadUtland from '../../src/components/sykepengesoknad-utland/SykepengesoknadUtland';
import { sykmeldingerHentet } from '../../src/actions/sykmeldinger_actions';

describe('SykepengesoknadContainer', () => {
    let toggleStub;
    let state;
    let ownProps;
    let settOwnPropsId;
    const ARBEIDSTAKERSOKNAD_ID = 'b9732cc7-6101-446e-a1ef-ec25a425b4fb';
    const NAERINGSDRIVENDESOKNAD_ID = 'faadf7c1-3aac-4758-8673-e9cee1316a3c';
    const OPPHOLD_UTLAND_ID = 'e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee';

    beforeEach(() => {
        state = {
            soknader: soknader(soknader(), soknaderHentet(mockSoknader)),
            sykepengesoknader: sykepengesoknader(sykepengesoknader(), sykepengesoknaderHentet(mockSykepengesoknader)),
            sykmeldinger: sykmeldinger(sykmeldinger(), sykmeldingerHentet([])),
            ledetekster: ledetekster(),
            tilgang: {
                data: {
                    harTilgang: true,
                },
            },
            navbruker: {
                data: {
                    navn: 'Ola Nordmann',
                },
            },
        };
        ownProps = {
            params: {
                sykepengesoknadId: '1',
            },
        };
        settOwnPropsId = (soknadId) => {
            ownProps.params.sykepengesoknadId = soknadId;
        };
        toggleStub = sinon.stub(toggleSelectors, 'erDev').returns(false);
    });

    afterEach(() => {
        toggleStub.restore();
    });

    describe('Visning av sykepengesøknad for arbeidstakere', () => {
        it('Skal vise SykepengesoknadArbeidstaker', () => {
            settOwnPropsId(ARBEIDSTAKERSOKNAD_ID);
            const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
            expect(component.find(SykepengesoknadArbeidstaker).length).to.equal(1);
        });

        it('Skal vise SendtSoknadArbeidstakerNy', () => {
            settOwnPropsId(OPPHOLD_UTLAND_ID);
            const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
            expect(component.find(SykepengesoknadUtland).length).to.equal(1);
        });
    });

    describe('Håndtering av feil', () => {
        it('Skal vise feilmelding hvis søknaden er en arbeidstaker-søknad og henting av arbeidstaker-søknader feiler', () => {
            settOwnPropsId(ARBEIDSTAKERSOKNAD_ID);
            state.sykepengesoknader.hentingFeilet = true;
            state.sykepengesoknader.data = [];
            const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
            expect(component.find(Feilmelding)).to.have.length(1);
        });

        it('Skal ikke vise feilmelding hvis søknaden er en arbeidstaker-søknad og henting av selvstendig-søknader feiler', () => {
            settOwnPropsId(ARBEIDSTAKERSOKNAD_ID);
            state.soknader.hentingFeilet = true;
            state.soknader.data = [];
            const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
            expect(component.find(SykepengesoknadArbeidstaker).length).to.equal(1);
            expect(component.find(Feilmelding).length).to.equal(0);
        });

        it('Skal vise feilmelding hvis søknaden er en selvstendig-søknad og henting av selvstendig-søknader feiler', () => {
            settOwnPropsId(NAERINGSDRIVENDESOKNAD_ID);
            state.soknader.hentingFeilet = true;
            state.soknader.data = [];
            const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
            expect(component.find(Feilmelding)).to.have.length(1);
        });

        it('Skal ikke vise feilmelding hvis søknaden er en selvstendig-søknad og henting av arbeidstaker-søknader feiler', () => {
            settOwnPropsId(NAERINGSDRIVENDESOKNAD_ID);
            state.sykepengesoknader.hentingFeilet = true;
            state.sykepengesoknader.data = [];
            const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
            expect(component.find(SykepengesoknadSelvstendig).length).to.equal(1);
            expect(component.find(Feilmelding).length).to.equal(0);
        });

        it('Skal vise feilmelding hvis veileder ikke har tilgang', () => {
            settOwnPropsId(NAERINGSDRIVENDESOKNAD_ID);
            state.tilgang.data = {
                harTilgang: false,
            };
            const component = shallow(<Container {...mapStateToProps(state, ownProps)} />);
            expect(component.find(Feilmelding).length).to.equal(1);
        });
    });
});
