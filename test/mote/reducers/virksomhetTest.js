import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import virksomhet from '../../../src/reducers/virksomhet';
import * as actions from '../../../src/actions/virksomhet_actions';

describe('virksomhet', () => {
    it('Har en default state', () => {
        const state = virksomhet();
        expect(state).to.deep.equal({
            data: {},
            henter: false,
            hentingFeilet: false,
        });
    });

    it('Håndterer henterVirksomhet()', () => {
        const action = actions.henterVirksomhet();
        const state = virksomhet(undefined, action);
        expect(state).to.deep.equal({
            data: {},
            henter: true,
            hentingFeilet: false,
        });
    });

    it('Håndterer virksomhetHentet når det ikke finnes data fra før', () => {
        const data = {
            navn: 'NAV Consulting',
        };
        const orgnummer = '8877766';
        const action = actions.virksomhetHentet(orgnummer, data);
        const currentState = deepFreeze({
            data: {},
            henter: true,
            hentingFeilet: false,
        });
        const nextState = virksomhet(currentState, action);
        expect(nextState).to.deep.equal({
            data: {
                8877766: 'NAV Consulting',
            },
            henter: false,
            hentingFeilet: false,
        });
    });

    it('Håndterer virksomhetHentet når det finnes data fra før', () => {
        const data = {
            navn: 'NAV Consulting',
        };
        const orgnummer = '8877766';
        const action = actions.virksomhetHentet(orgnummer, data);
        const currentState = deepFreeze({
            data: {
                123: 'BEKK',
            },
            henter: true,
            hentingFeilet: false,
        });
        const nextState = virksomhet(currentState, action);
        expect(nextState).to.deep.equal({
            data: {
                8877766: 'NAV Consulting',
                123: 'BEKK',
            },
            henter: false,
            hentingFeilet: false,
        });
    });

    it('Håndterer hentVirksomhetFeilet', () => {
        const action = actions.hentVirksomhetFeilet();
        const currentState = deepFreeze({
            data: {},
            henter: true,
            hentingFeilet: false,
        });
        const nextState = virksomhet(currentState, action);
        expect(nextState).to.deep.equal({
            data: {},
            henter: false,
            hentingFeilet: true,
        });
    });
});
