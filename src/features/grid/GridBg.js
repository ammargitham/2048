import React from 'react';
import styled from 'styled-components';
import Cell from '../../components/Cell';
import { COL_COUNT, GRID_GAP } from './constants';

const TilesContainer = styled.div`
  width: 50%;
  border-radius: 10px;
  position: absolute;
  padding: ${() => `${GRID_GAP / 2}px`};
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  background: #ff9800;
  z-index: -1;

  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

export default function GridBg({ reference }) {
  return (
    <TilesContainer ref={reference} colCount={COL_COUNT}>
      {Array(COL_COUNT)
        .fill(null)
        .map((_c, row) => {
          return Array(COL_COUNT)
            .fill(null)
            .map((_c, col) => {
              return <Cell key={`bg-${row},${col}`} />;
            });
        })}
    </TilesContainer>
  );
}
