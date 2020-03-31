import { createSlice } from '@reduxjs/toolkit';
import { ANIMATION_DURATION, COL_COUNT } from './constants';
import {
  getEmptyCells,
  getRandomRowCol,
  mergeCells,
  moveCells
} from './services';

export const slice = createSlice({
  name: 'grid',
  initialState: {
    nextId: 0,
    grid: Array(COL_COUNT)
      .fill(null)
      .map(() => Array(COL_COUNT).fill(null)),
    gameOver: false
  },
  reducers: {
    setCell: (state, { payload: { row, col, value } }) => {
      state.grid[row][col] = {
        id: state.nextId,
        value
      };
      state.nextId++;
      localStorage.setItem('grid', JSON.stringify(state.grid));
      localStorage.setItem('nextId', state.nextId);
    },
    setGrid: (state, { payload: grid }) => {
      state.grid = grid;
      localStorage.setItem('grid', JSON.stringify(state.grid));
    },
    setNextId: (state, { payload: id }) => {
      state.nextId = id;
    },
    checkGameOver: state => {
      const grid = state.grid;
      const emptyCells = getEmptyCells(grid);
      if (emptyCells.length) {
        return;
      }
      // if there are no empty cells
      // check if moving cells in any direction changes the grid
      let updatedGrid = moveCells(grid, 'up');
      if (JSON.stringify(grid) !== JSON.stringify(updatedGrid)) {
        return;
      }
      updatedGrid = moveCells(grid, 'down');
      if (JSON.stringify(grid) !== JSON.stringify(updatedGrid)) {
        return;
      }
      updatedGrid = moveCells(grid, 'left');
      if (JSON.stringify(grid) !== JSON.stringify(updatedGrid)) {
        return;
      }
      updatedGrid = moveCells(grid, 'right');
      if (JSON.stringify(grid) !== JSON.stringify(updatedGrid)) {
        return;
      }
      state.gameOver = true;
    }
  }
});

export const { setCell, setGrid, checkGameOver, setNextId } = slice.actions;

export const up = () => (dispatch, getState) => {
  const {
    grid: { grid }
  } = getState();
  doNextStep(grid, 'up', dispatch);
};

export const down = () => (dispatch, getState) => {
  const {
    grid: { grid }
  } = getState();
  doNextStep(grid, 'down', dispatch);
};

export const left = () => (dispatch, getState) => {
  const {
    grid: { grid }
  } = getState();
  doNextStep(grid, 'left', dispatch);
};

export const right = () => (dispatch, getState) => {
  const {
    grid: { grid }
  } = getState();
  doNextStep(grid, 'right', dispatch);
};

export const init = () => (dispatch, getState) => {
  const {
    grid: { grid }
  } = getState();
  const gridString = localStorage.getItem('grid');
  if (!gridString) {
    addNewCell(grid, dispatch);
    return;
  }
  dispatch(setNextId(localStorage.getItem('nextId')));
  dispatch(setGrid(JSON.parse(gridString)));
};

function doNextStep(grid, direction, dispatch) {
  const updatedGrid = moveCells(grid, direction);
  if (JSON.stringify(updatedGrid) === JSON.stringify(grid)) {
    return;
  }
  dispatch(setGrid(updatedGrid));

  const updatedGrid2 = mergeCells(updatedGrid);
  if (JSON.stringify(updatedGrid2) !== JSON.stringify(updatedGrid)) {
    setTimeout(() => {
      dispatch(setGrid(updatedGrid2));
    }, ANIMATION_DURATION);
  }

  setTimeout(() => {
    addNewCell(updatedGrid2, dispatch);
  }, ANIMATION_DURATION);
}

function addNewCell(grid, dispatch) {
  const rowCol = getRandomRowCol(grid);
  if (!rowCol) {
    return;
  }
  const [row, col] = rowCol;
  const newCellLoc = {
    row,
    col,
    value: 2
  };
  dispatch(setCell(newCellLoc));
  setTimeout(() => {
    dispatch(checkGameOver());
  }, 1000);
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectGrid = state => state.grid.grid;

export const selectGameOver = state => state.grid.gameOver;

export default slice.reducer;
