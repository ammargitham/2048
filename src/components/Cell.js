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
    background: ${props => (!props.value ? '#ffc5a3' : 'cadetblue')};
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
