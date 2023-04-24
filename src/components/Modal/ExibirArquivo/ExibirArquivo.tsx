import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Modal } from '..';

interface DocumentProps {
  modalOpen: boolean,
  setModalOpen : any
}

export function ExibirArquivo({
  modalOpen, setModalOpen
} : DocumentProps) {
  const [numPages, setNumPages] = useState<null | number>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [m, setM] = useState(true)
  interface NumPagesProps{
    numPages : number
  }

  function onDocumentLoadSuccess({ numPages } : NumPagesProps) {
    setNumPages(numPages);
  }

  return (
    <Modal title="Anexos" modalId={5} width="md">


    <div>
      <Document file="." onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
    </Modal>
  );
}