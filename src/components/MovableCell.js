import anime from 'animejs';
import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { ANIMATION_DURATION } from '../features/grid/constants';
import Cell from './Cell';

const StyledCell = styled(Cell)`
  z-index: 3;
  position: absolute;
  width: ${props => `${props.width || 0}px`};
`;

export default function MovableCell({
  width,
  height,
  from: { row: prevRow, col: prevCol, value: prevValue } = {},
  to: { row, col },
  onStart,
  ...rest
}) {
  const cellRef = useRef(null);
  useLayoutEffect(() => {
    let translateFromX = prevCol * width;
    let translateFromY = prevRow * height;
    const translateToX = col * width;
    const translateToY = row * height;
    const animeObj = {
      targets: cellRef.current,
      begin: onStart
    };
    if (!Number.isInteger(prevRow) || !Number.isInteger(prevCol)) {
      translateFromX = translateToX;
      translateFromY = translateToY;
    }
    animeObj.translateX = {
      value: [translateFromX, translateToX],
      duration: translateFromX === translateToX ? 0 : ANIMATION_DURATION,
      easing: 'easeInOutQuad'
    };
    animeObj.translateY = {
      value: [translateFromY, translateToY],
      duration: translateFromY === translateToY ? 0 : ANIMATION_DURATION,
      easing: 'easeInOutQuad'
    };
    if (
      translateFromX === translateToX &&
      translateFromY === translateToY &&
      rest.value !== prevValue
    ) {
      if (!prevValue) {
        animeObj.scale = [
          {
            value: 1.2,
            duration: 150,
            easing: 'easeInCubic'
          },
          {
            value: 1,
            duration: 150,
            easing: 'easeOutCubic'
          }
        ];
      } else {
        animeObj.scale = [
          {
            value: 1.2,
            duration: 150,
            easing: 'easeInCubic'
          },
          {
            value: 1,
            duration: 150,
            easing: 'easeOutCubic'
          }
        ];
      }
    }
    anime(animeObj);
  }, [
    onStart,
    prevRow,
    prevCol,
    row,
    col,
    width,
    height,
    prevValue,
    rest.value
  ]);

  return (
    <StyledCell
      elemRef={cellRef}
      width={width}
      // row={!prevRow ? row : null}
      // col={!prevCol ? col : null}
      {...rest}
    />
  );
}
