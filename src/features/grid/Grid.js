import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swipeable } from 'react-swipeable';
import styled from 'styled-components';
import MovableCell from '../../components/MovableCell';
import useKeyListener from '../../hooks/useKeyListener';
import useResizeListener from '../../hooks/useResizeListener';
import { COL_COUNT, GRID_GAP } from './constants';
import GameOver from './GameOver';
import GridBg from './GridBg';
import {
  down,
  init,
  left,
  right,
  selectGameOver,
  selectGrid,
  up
} from './gridSlice';

const TilesContainer = styled(Swipeable)`
  width: 50%;
  border-radius: 10px;
  position: absolute;
  padding: ${() => `${GRID_GAP / 2}px`};
  z-index: 2;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;

  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

const StyledGameOver = styled(GameOver)`
  z-index: 3;
`;

export default function Grid() {
  const [tileCellWidth, setTileCellWidth] = useState(0);
  const [tileCellHeight, setTileCellHeight] = useState(0);
  const [prevLocations, setPrevLocations] = useState(new Map());

  const dispatch = useDispatch();

  const grid = useSelector(selectGrid);
  const gameOver = useSelector(selectGameOver);

  const gridBgRef = useRef(null);
  const tileRef = useRef(null);
  const gameOverRef = useRef(null);

  useKeyListener(code => {
    dispatchDir(code);
  });

  function dispatchDir(dirOrCode) {
    switch (dirOrCode) {
      case 'ArrowUp':
      case 'Up':
        dispatch(up());
        break;
      case 'ArrowDown':
      case 'Down':
        dispatch(down());
        break;
      case 'ArrowLeft':
      case 'Left':
        dispatch(left());
        break;
      case 'ArrowRight':
      case 'Right':
        dispatch(right());
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  useLayoutEffect(() => {
    setTileGridSize();
  });

  useResizeListener(() => {
    setTileGridSize();
  });

  function onAnimationStart(id, row, col, value) {
    setPrevLocations(prevLocations.set(id, { row, col, value }));
  }

  function setTileGridSize() {
    if (!gridBgRef.current || !tileRef.current) {
      return;
    }
    const bgEle = gridBgRef.current;
    const tileEle = tileRef.current;
    const {
      width: gridWidth,
      height: gridHeigth
    } = bgEle.getBoundingClientRect();
    tileEle.style.height = gridHeigth + 'px';
    setTileCellWidth((gridWidth - GRID_GAP) / COL_COUNT);
    setTileCellHeight((gridHeigth - GRID_GAP) / COL_COUNT);
    if (gameOverRef.current) {
      gameOverRef.current.style.height = gridHeigth + 'px';
      gameOverRef.current.style.width = gridWidth + 'px';
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <GridBg reference={gridBgRef} />
      <TilesContainer
        innerRef={ref => (tileRef.current = ref)}
        colCount={COL_COUNT}
        trackMouse={true}
        onSwiped={({ dir }) => dispatchDir(dir)}
      >
        {Array(COL_COUNT)
          .fill(null)
          .map((_c, row) => {
            return Array(COL_COUNT)
              .fill(null)
              .map((_c, col) => {
                let cell = grid[row][col];
                if (!cell) {
                  return '';
                }
                let bottomCell;
                if (Array.isArray(cell)) {
                  bottomCell = cell[0];
                  cell = cell[1];
                }
                return [
                  bottomCell && (
                    <MovableCell
                      key={`bottom-${row},${col}`}
                      from={prevLocations.get(bottomCell.id)}
                      to={{ row, col }}
                      value={bottomCell.value}
                      width={tileCellWidth}
                      height={tileCellHeight}
                      onStart={() =>
                        onAnimationStart(
                          bottomCell.id,
                          row,
                          col,
                          bottomCell.value
                        )
                      }
                      style={{ zIndex: 2 }}
                    />
                  ),
                  <MovableCell
                    key={`${row},${col}`}
                    from={prevLocations.get(cell.id)}
                    to={{ row, col }}
                    value={cell.value}
                    width={tileCellWidth}
                    height={tileCellHeight}
                    onStart={() =>
                      onAnimationStart(cell.id, row, col, cell.value)
                    }
                  />
                ];
              });
          })}
      </TilesContainer>
      {gameOver && <StyledGameOver innerRef={gameOverRef} />}
    </div>
  );
}
