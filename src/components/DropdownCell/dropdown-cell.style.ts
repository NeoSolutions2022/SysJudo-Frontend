import styled from "styled-components";

export const Container = styled.div``;

export const Cell = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
  cursor: zoom-in;
`;

export const DropCell = styled.div`
  position: absolute;
  z-index: 10;
  background: #ffffff;
  height: 300px;
  min-width: 300px;
  width: fit-content;
  word-wrap: break-word;
  word-break: break-all;
  cursor: zoom-out;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 3px 3px 4px #9d9d9d;
`;
