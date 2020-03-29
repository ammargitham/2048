import { createSlice } from '@reduxjs/toolkit';
import { ANIMATION_DURATION, COL_COUNT } from './constants';
import { getRandomRowCol, mergeCells, moveCells } from './services';

export const slice = createSlice({
  name: 'grid',
  initialState: {
    nextId: 0,
    grid: Array(COL_COUNT)
      .fill(null)
      .map(() => Array(COL_COUNT).fill(null))
  },
  reducers: {
    setCell: (state, { payload: { row, col, value } }) => {
      state.grid[row][col] = {
        id: state.nextId,
        value
      };
      state.nextId++;
    },
    setGrid: (state, { payload: grid }) => {
      state.grid = grid;
    }
  }
});

export const { setCell, setGrid } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

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
  addNewCell(grid, dispatch);
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
  dispatch(
    setCell({
      row,
      col,
      value: 2
    })
  );
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectGrid = state => state.grid.grid;

export default slice.reducer;
