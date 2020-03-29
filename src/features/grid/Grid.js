import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import MovableCell from '../../components/MovableCell';
import useKeyListener from '../../hooks/useKeyListener';
import useResizeListener from '../../hooks/useResizeListener';
import { COL_COUNT, GRID_GAP } from './constants';
import GridBg from './GridBg';
import { down, init, left, right, selectGrid, up } from './gridSlice';

// const GridBackground = styled.div`
//   background: #ff9800;
//   width: 50%;
//   display: none;
//   grid-template-columns: ${props => `repeat(${props.colCount}, 1fr)`};
//   grid-gap: ${() => `${GRID_GAP}px`};
//   padding: ${() => `${GRID_GAP}px`};
//   border-radius: 10px;
//   position: absolute;
//   z-index: -1;
// `;

const TilesContainer = styled.div`
  width: 50%;
  border-radius: 10px;
  position: absolute;
  padding: ${() => `${GRID_GAP / 2}px`};
  z-index: 1;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
`;

// const animateElementIn = (el, i) =>
//   anime({
//     targets: el,
//     opacity: 1,
//     duration: 200,
//     easing: 'linear'
//   });

// const exitThenFlipThenEnter = ({
//   hideEnteringElements,
//   animateEnteringElements,
//   animateExitingElements,
//   animateFlippedElements
// }) => {
//   hideEnteringElements();
//   animateFlippedElements().then(animateEnteringElements);
// };

export default function Grid() {
  const [tileCellWidth, setTileCellWidth] = useState(0);
  const [prevLocations, setPrevLocations] = useState(new Map());

  const dispatch = useDispatch();

  const grid = useSelector(selectGrid);

  const gridBgRef = useRef(null);
  const tileRef = useRef(null);

  useKeyListener(code => {
    // console.log(code);
    switch (code) {
      case 'ArrowUp':
        dispatch(up());
        break;
      case 'ArrowDown':
        dispatch(down());
        break;
      case 'ArrowLeft':
        dispatch(left());
        break;
      case 'ArrowRight':
        dispatch(right());
        break;
      default:
        break;
    }
  });

  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  useLayoutEffect(() => {
    setTileGridSize();
  });

  useResizeListener(() => {});

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
      <TilesContainer ref={tileRef} colCount={COL_COUNT}>
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
                      onStart={() =>
                        onAnimationStart(
                          bottomCell.id,
                          row,
                          col,
                          bottomCell.value
                        )
                      }
                      style={{ zIndex: 1 }}
                    />
                  ),
                  <MovableCell
                    key={`${row},${col}`}
                    from={prevLocations.get(cell.id)}
                    to={{ row, col }}
                    value={cell.value}
                    width={tileCellWidth}
                    onStart={() =>
                      onAnimationStart(cell.id, row, col, cell.value)
                    }
                  />
                ];
              });
          })}
      </TilesContainer>
    </div>
  );
}
