import React from "react";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Textarea,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { Link } from "react-router-dom";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import {
  NewFinalVurderingRequestDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useSendVurderingManglendeMedvirkning } from "@/data/manglendemedvirkning/useSendVurderingManglendeMedvirkning";
import { useForm } from "react-hook-form";
import { useManglendeMedvirkningVurderingDocument } from "@/hooks/manglendemedvirkning/useManglendeMedvirkningVurderingDocument";
import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  title: "Unntak fra medvirkelsesplikten",
  info: "Skriv en kort begrunnelse for hvorfor bruker kan få unntak fra vilkårene i § 8-8, og hvilke opplysninger som ligger til grunn for vurderingen.",
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Åpne forhåndsvisning for å se vurderingen. Når du trykker Lagre journalføres vurderingen automatisk.",
  forhandsvisningLabel: "Forhåndsvis vurderingen",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Sett unntak",
  avbrytButton: "Avbryt",
  success:
    "Vurderingen om unntak fra medvirkningsplikten § 8-8 er lagret i historikken og blir journalført automatisk.",
};

interface UnntakSkjemaValues {
  begrunnelse: string;
}

const begrunnelseMaxLength = 5000;

interface Props {
  forhandsvarselSendtDato: Date;
}

export default function UnntakSkjema({ forhandsvarselSendtDato }: Props) {
  const personident = useValgtPersonident();
  const { setNotification } = useNotification();
  const sendVurdering = useSendVurderingManglendeMedvirkning();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<UnntakSkjemaValues>({ defaultValues: { begrunnelse: "" } });
  const { getUnntakDocument } = useManglendeMedvirkningVurderingDocument();

  const submit = (values: UnntakSkjemaValues) => {
    const requestBody: NewFinalVurderingRequestDTO = {
      personident: personident,
      vurderingType: VurderingType.UNNTAK,
      begrunnelse: values.begrunnelse,
      document: getUnntakDocument({
        begrunnelse: values.begrunnelse,
        forhandsvarselSendtDato: forhandsvarselSendtDato,
      }),
    };

    sendVurdering.mutate(requestBody, {
      onSuccess: () => {
        setNotification({
          message: texts.success,
        });
      },
    });
  };
  return (
    <Box background="surface-default" padding="6" className="mb-2">
      <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
        <Heading level="2" size="medium">
          {texts.title}
        </Heading>
        <BodyShort>{texts.info}</BodyShort>
        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.missingBegrunnelse,
          })}
          value={watch("begrunnelse")}
          label={texts.begrunnelseLabel}
          description={texts.begrunnelseDescription}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
        {sendVurdering.isError && (
          <SkjemaInnsendingFeil error={sendVurdering.error} />
        )}
        <HStack gap="4">
          <Button loading={sendVurdering.isPending} type="submit">
            {texts.sendVarselButtonText}
          </Button>
          <Forhandsvisning
            contentLabel={texts.forhandsvisningLabel}
            getDocumentComponents={() =>
              getUnntakDocument({
                begrunnelse: watch("begrunnelse"),
                forhandsvarselSendtDato: forhandsvarselSendtDato,
              })
            }
          />
          <Button as={Link} to={manglendeMedvirkningPath} variant="secondary">
            {texts.avbrytButton}
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
