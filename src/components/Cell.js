import React from 'react';
import styled from 'styled-components';
import { GRID_GAP } from '../features/grid/constants';

const CellContainer = styled.div`
  display: flex;
  flex: 0 0 25%;
  justify-content: center;
  align-items: stretch;
  padding: ${() => GRID_GAP / 2 + 'px'};

  &:before {
    content: '';
    display: table;
    padding-top: 100%;
  }

  & .content {
    flex-grow: 1;
    border-radius: 10px;
    background: ${props => {
      if (!props.value) {
        return '#c6bab1';
      }
      switch (props.value) {
        case 2:
          return '#e8ddd4';
        case 4:
          return '#e3d8bf';
        case 8:
          return '#ecab76';
        case 16:
          return '#e88852';
        case 32:
          return '#f47b60';
        case 64:
          return '#de5639';
        case 128:
          return '#e8d264';
        case 256:
          return '#ebcb4d';
        case 1024:
          return '#dcb512';
        case 2048:
        default:
          return '#e7c000';
      }
      return '#ffc5a3';
    }};
    color: white;
    font-size: 2.5em;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default function Cell({ className, value, elemRef }) {
  return (
    <CellContainer ref={elemRef} className={className} value={value}>
      <div className="content">{value}</div>
    </CellContainer>
  );
}
