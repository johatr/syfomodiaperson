import React, { ReactElement } from "react";
import { BodyShort, Box } from "@navikt/ds-react";
import { useSenOppfolgingSvarQuery } from "@/data/senoppfolging/useSenOppfolgingSvarQuery";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { KandidatSvar } from "@/sider/senoppfolging/KandidatSvar";
import { VurdertKandidat } from "@/sider/senoppfolging/VurdertKandidat";
import * as Tredelt from "@/sider/TredeltSide";
import {
  SenOppfolgingStatus,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { VeiledningRutine } from "@/sider/senoppfolging/VeiledningRutine";
import { NewVurderingForm } from "@/sider/senoppfolging/NewVurderingForm";

const texts = {
  ikkeVarslet: {
    info1:
      "Den sykmeldte har ikke mottatt varsel om at det snart er slutt på sykepengene enda.",
    info2:
      "Når den sykmeldte har mindre enn 90 dager igjen av sykepengene, vil han eller hun få et varsel om å svare på spørsmål rundt sin situasjon på innloggede sider.",
    info3:
      "Når spørsmålene er besvart, vil du få en oppgave i oversikten din om å vurdere videre oppfølging. Svarene fra den sykmeldte dukker opp på denne siden.",
  },
};

export default function SenOppfolging(): ReactElement {
  const { data: svar } = useSenOppfolgingSvarQuery();
  const { data: kandidater } = useSenOppfolgingKandidatQuery();
  const kandidat = kandidater[0];
  const isFerdigbehandlet =
    kandidat?.status === SenOppfolgingStatus.FERDIGBEHANDLET;
  const ferdigbehandletVurdering = kandidat?.vurderinger.find(
    (vurdering) => vurdering.type === SenOppfolgingVurderingType.FERDIGBEHANDLET
  );

  return svar && kandidat ? (
    <Tredelt.Container>
      <Tredelt.FirstColumn>
        <KandidatSvar svar={svar} />
        {isFerdigbehandlet && ferdigbehandletVurdering ? (
          <VurdertKandidat vurdering={ferdigbehandletVurdering} />
        ) : (
          <NewVurderingForm kandidat={kandidat} />
        )}
      </Tredelt.FirstColumn>
      <Tredelt.SecondColumn>
        <VeiledningRutine />
      </Tredelt.SecondColumn>
    </Tredelt.Container>
  ) : (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4"
    >
      <BodyShort size="small">{texts.ikkeVarslet.info1}</BodyShort>
      <BodyShort size="small">{texts.ikkeVarslet.info2}</BodyShort>
      <BodyShort size="small">{texts.ikkeVarslet.info3}</BodyShort>
    </Box>
  );
}
