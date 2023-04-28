import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;

  canvas {
    width: 100% !important;
    height: auto !important;
  }
  .react-pdf__Page__textContent{
    display: none !important;
  }
`

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-bottom: 1rem;
`

export const ButtonGroup = styled.div`
display: flex !important;
  margin-bottom: 0.5rem;
  * {
    margin-left: 1.2rem;
  }
`
