import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISMANGLENDEMEDVIRKNING_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import {
  NewForhandsvarselVurderingRequestDTO,
  NewFinalVurderingRequestDTO,
  VurderingResponseDTO,
  NewVurderingRequestDTO,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";

function useSendVurdering<T extends NewVurderingRequestDTO>() {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISMANGLENDEMEDVIRKNING_ROOT}/manglende-medvirkning/vurderinger`;

  const postVurdering = (vurdering: T) =>
    post<VurderingResponseDTO>(path, vurdering);

  return useMutation({
    mutationFn: postVurdering,
    onSuccess: (data: VurderingResponseDTO) => {
      queryClient.setQueryData(
        manglendeMedvirkningQueryKeys.manglendeMedvirkning(personident),
        (oldData: VurderingResponseDTO[]) => [data, ...oldData]
      );
    },
  });
}

export function useSendVurderingManglendeMedvirkning() {
  return useSendVurdering<NewFinalVurderingRequestDTO>();
}

export function useSendForhandsvarselManglendeMedvirkning() {
  return useSendVurdering<NewForhandsvarselVurderingRequestDTO>();
}
