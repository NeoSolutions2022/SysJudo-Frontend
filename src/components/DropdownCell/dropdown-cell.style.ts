import styled from "styled-components";

export const Container = styled.div``;

export const Cell = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
  cursor: pointer;
`;

export const DropCell = styled.div`
  box-sizing: border-box;
  position: absolute;
  padding: 20px;
  z-index: 10;
  background: #ffffff;
  height: 300px;
  min-width: 400px;
  max-height: 300px;
  overflow: auto;
  height: fit-content;
  width: fit-content;
  max-width: 1000px;
  word-wrap: break-word;
  word-break: break-all;
  cursor: not-allowed;
  padding: 10px;
  color: #1d93ff;
  border-radius: 5px;
  box-shadow: 3px 3px 4px #9d9d9d;

  /* Estilos da barra lateral do scroll */
  ::-webkit-scrollbar {
    width: 8px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #1d93ff;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

