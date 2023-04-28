import { LegacyRef, useEffect, useRef, useState } from 'react'
import { StyledButton as Button } from '../Button' 
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import * as S from './styles'
import { Loading } from '../Loading/Loading';
import { Box } from '@mui/material';

type Props = {
  fileItem: Blob
}

function PDFViewer({ fileItem } : Props){
  const canvasRef = useRef<HTMLCanvasElement>()
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pagesQuantity, setPagesQuantity] = useState<number>(0)
  const [fileIn8Array, setFileIn8Array] = useState()
  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < pagesQuantity

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const onLoadSuccess = ({ numPages }: any): void => {
    setPagesQuantity(numPages)
  }

  

  return (
    <S.Container>
      <S.Toolbar>
        <S.ButtonGroup>
          <Button onClick={previousPage} disabled={!canPreviousPage}>
            &laquo; Voltar
          </Button>
          <Button onClick={nextPage} disabled={!canNextPage}>
            Próximo &raquo;
          </Button>
        </S.ButtonGroup>
        <span>
          Página {currentPage} de {pagesQuantity}
        </span>
      </S.Toolbar>

      <Document
        file={fileItem}
        loading={<div style={{paddingBottom:20}}><Loading width={100} /></div>}
        error={'Não foi possível carregar o PDF.'}
        noData={'Nenhum PDF encontrado.'}
        onLoadSuccess={onLoadSuccess}
      >
        <Page
          canvasRef={canvasRef as LegacyRef<HTMLCanvasElement>}
          pageNumber={currentPage}
          renderAnnotationLayer={false}
        />
      </Document>
    </S.Container>
  )
}

export default PDFViewer
