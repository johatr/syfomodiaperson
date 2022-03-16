import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as moteActions from "../../../data/mote/moter_actions";
import MotebookingSkjema from "../skjema/MotebookingSkjema";
import AppSpinner from "../../AppSpinner";
import Feilmelding from "../../Feilmelding";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";

const texts = {
  skjermetBrukerError: {
    title: "Ikke mulig å sende møteforespørsel",
    message: "Brukeren er registrert med skjermingskode 6 eller 7.",
  },
  noValgtEnhetError: {
    title: "Du må velge Enhet",
    message:
      "For at du skal kunne opprette et møte må du velge hvilken enhet dette møtet skal knyttes til. Det styres av hvilken enhet du har valgt i toppmenyen. " +
      "Hvis du får denne og det ser ut som du allerede har valgt riktig enhet, prøv å velg en annen enhet og så tilbake igjen.",
  },
  noLederError: {
    title: "Lederen mangler!",
    message:
      "Møteplanleggeren kan bare brukes hvis nærmeste leder er registrert. Arbeidsgiveren må gjøre dette i Altinn.",
  },
};

const MotebookingSkjemaContainer = ({
  antallNyeTidspunkt,
  arbeidstaker,
  fjernAlternativ,
  flereAlternativ,
  fnr,
  henter,
  hentingFeilet,
  opprettMote,
  skjermetBruker,
  sender,
  sendingFeilet,
}) => {
  const { valgtEnhet } = useValgtEnhet();
  const {
    currentLedere: ledere,
    isLoading: henterLedere,
    isError: henterLedereFeilet,
  } = useLedereQuery();
  if (henter || henterLedere) {
    return <AppSpinner />;
  } else if (skjermetBruker) {
    return (
      <Feilmelding
        tittel={texts.skjermetBrukerError.title}
        melding={texts.skjermetBrukerError.message}
      />
    );
  } else if (hentingFeilet || henterLedereFeilet) {
    return <Feilmelding />;
  } else if (!valgtEnhet) {
    return (
      <Feilmelding
        tittel={texts.noValgtEnhetError.title}
        melding={texts.noValgtEnhetError.message}
      />
    );
  } else if (ledere.length === 0) {
    return (
      <Feilmelding
        tittel={texts.noLederError.title}
        melding={texts.noLederError.message}
      />
    );
  }
  return (
    <MotebookingSkjema
      antallNyeTidspunkt={antallNyeTidspunkt}
      arbeidstaker={arbeidstaker}
      fjernAlternativ={fjernAlternativ}
      flereAlternativ={flereAlternativ}
      fnr={fnr}
      ledere={ledere}
      opprettMote={opprettMote}
      valgtEnhet={valgtEnhet}
      sender={sender}
      sendingFeilet={sendingFeilet}
    />
  );
};

MotebookingSkjemaContainer.propTypes = {
  antallNyeTidspunkt: PropTypes.number,
  arbeidstaker: PropTypes.object,
  fnr: PropTypes.string,
  fjernAlternativ: PropTypes.func,
  flereAlternativ: PropTypes.func,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  opprettMote: PropTypes.func,
  skjermetBruker: PropTypes.bool,
  sender: PropTypes.bool,
  sendingFeilet: PropTypes.bool,
};

export function mapStateToProps(state, ownProps) {
  return {
    fnr: ownProps.fnr,
    arbeidstaker: state.navbruker.data,
    henter: state.navbruker.henter,
    skjermetBruker: state.moter.skjermetBruker,
    antallNyeTidspunkt: state.moter.antallNyeTidspunkt,
    hentingFeilet: state.navbruker.hentingFeilet,
    sender: state.moter.sender,
    sendingFeilet: state.moter.sendingFeilet,
  };
}

const container = connect(
  mapStateToProps,
  Object.assign({}, moteActions)
)(MotebookingSkjemaContainer);

export default container;
