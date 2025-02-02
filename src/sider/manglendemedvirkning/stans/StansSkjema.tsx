import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useSendVurderingManglendeMedvirkning } from "@/data/manglendemedvirkning/useSendVurderingManglendeMedvirkning";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  List,
  Textarea,
} from "@navikt/ds-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useManglendeMedvirkningVurderingDocument } from "@/hooks/manglendemedvirkning/useManglendeMedvirkningVurderingDocument";
import {
  NewFinalVurderingRequestDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  heading: "Skriv innstilling til NAY",
  p1: "Skriv kort hvilke opplysninger som ligger til grunn for stans, samt din vurdering av hvorfor vilkåret ikke er oppfylt og vurdering av eventuelle nye opplysninger.",
  begrunnelseLabel: "Innstilling om stans (obligatorisk)",
  afterSendInfo: {
    title: "Videre må du huske å:",
    gosysoppgave: "Sende oppgave til NAY i Gosys:",
    gosysoppgaveListe: {
      tema: "Tema: Sykepenger",
      gjelder: "Gjelder: Behandle vedtak",
      oppgavetype: "Oppgavetype: Vurder konsekvens for ytelse",
      prioritet: "Prioritet: Høy",
    },
    stoppknapp:
      "Gi beskjed om stans til ny saksbehandlingsløsning via Stoppknappen under fanen Sykmeldinger i Modia.",
  },
  buttonDescription:
    "Når du trykker “Stans” blir innstillingen journalført og kan sees i Gosys.",
  forhandsvisningLabel: "Forhåndsvis innstillingen",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Stans",
  avbrytButton: "Avbryt",
  success:
    "Innstillingen om stans av sykepenger i forbindelse med medvirkningsplikten § 8-8 er lagret i historikken og blir journalført automatisk.",
};

const begrunnelseMaxLength = 5000;

export interface StansSkjemaValues {
  begrunnelse: string;
}

interface Props {
  varselSvarfrist: Date;
}

export default function StansSkjema({ varselSvarfrist }: Props) {
  const personident = useValgtPersonident();
  const sendVurdering = useSendVurderingManglendeMedvirkning();
  const formMethods = useForm<StansSkjemaValues>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const { getStansDocument } = useManglendeMedvirkningVurderingDocument();

  const { setNotification } = useNotification();

  const submit = (values: StansSkjemaValues) => {
    const stansVurdering: NewFinalVurderingRequestDTO = {
      personident: personident,
      vurderingType: VurderingType.STANS,
      begrunnelse: values.begrunnelse,
      document: getStansDocument({
        begrunnelse: values.begrunnelse,
        varselSvarfrist: varselSvarfrist,
      }),
    };

    sendVurdering.mutate(stansVurdering, {
      onSuccess: () => {
        setNotification({
          message: texts.success,
        });
      },
    });
  };

  return (
    <Box background="surface-default" padding="6">
      <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
        <Heading level="2" size="medium">
          {texts.heading}
        </Heading>
        <BodyShort>{texts.p1}</BodyShort>
        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.missingBegrunnelse,
          })}
          value={watch("begrunnelse")}
          label={texts.begrunnelseLabel}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
        <List as="ul" title={texts.afterSendInfo.title}>
          <List.Item>
            {texts.afterSendInfo.gosysoppgave}
            <List as="ul" className="ml-1">
              <List.Item>
                {texts.afterSendInfo.gosysoppgaveListe.tema}
              </List.Item>
              <List.Item>
                {texts.afterSendInfo.gosysoppgaveListe.gjelder}
              </List.Item>
              <List.Item>
                {texts.afterSendInfo.gosysoppgaveListe.oppgavetype}
              </List.Item>
              <List.Item>
                {texts.afterSendInfo.gosysoppgaveListe.prioritet}
              </List.Item>
            </List>
          </List.Item>
          <List.Item>{texts.afterSendInfo.stoppknapp}</List.Item>
        </List>
        <BodyShort>{texts.buttonDescription}</BodyShort>
        <HStack gap="4">
          <Button loading={sendVurdering.isPending} type="submit">
            {texts.sendVarselButtonText}
          </Button>
          <Button as={Link} to={manglendeMedvirkningPath} variant="secondary">
            {texts.avbrytButton}
          </Button>
          <Forhandsvisning
            contentLabel={texts.forhandsvisningLabel}
            getDocumentComponents={() =>
              getStansDocument({
                begrunnelse: watch("begrunnelse"),
                varselSvarfrist: varselSvarfrist,
              })
            }
          />
        </HStack>
      </form>
    </Box>
  );
}
