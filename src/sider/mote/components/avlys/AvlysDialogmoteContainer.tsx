import React, { ReactElement } from "react";
import AvlysDialogmoteSkjema from "./AvlysDialogmoteSkjema";
import { DialogmoteSideContainer } from "../../../../components/dialogmote/DialogmoteSideContainer";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Avlys dialogmøte",
  pageHeader: "Avlys dialogmøte",
};

const AvlysDialogmoteContainer = (): ReactElement => (
  <DialogmoteSideContainer title={texts.pageTitle} header={texts.pageHeader}>
    {(dialogmote) => (
      <MalformProvider>
        <AvlysDialogmoteSkjema
          dialogmote={dialogmote}
          pageTitle={texts.pageTitle}
        />
      </MalformProvider>
    )}
  </DialogmoteSideContainer>
);

export default AvlysDialogmoteContainer;
