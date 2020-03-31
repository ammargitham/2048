import { getRandomInt } from '../../helpers';

function getNextRow(row, col, gridLength, direction) {
  switch (direction) {
    default:
    case 'up':
      if (row === -1) {
        return 1;
      }
      if (col === gridLength - 1) {
        return row + 1;
      }
      return row;
    case 'down':
      if (row === -1) {
        return gridLength - 1;
      }
      if (col === gridLength - 1) {
        return row - 1;
      }
      return row;
    case 'left':
    case 'right':
      if (row === -1) {
        return 0;
      }
      if (row === gridLength - 1) {
        return 0;
      }
      return row + 1;
  }
}

function getNextCol(row, col, gridLength, direction) {
  switch (direction) {
    default:
    case 'up':
    case 'down':
      if (col === -1) {
        return 0;
      }
      if (col === gridLength - 1) {
        return 0;
      }
      return col + 1;
    case 'left':
      if (col === -1) {
        return 0;
      }
      if (row === gridLength - 1) {
        return col + 1;
      }
      return col;
    case 'right':
      if (col === -1) {
        return gridLength - 1;
      }
      if (row === gridLength - 1) {
        return col - 1;
      }
      return col;
  }
}

function getNewLocation(row, col, direction) {
  let tempRow = row;
  let tempCol = col;
  switch (direction) {
    default:
    case 'up':
      tempRow = tempRow - 1;
      break;
    case 'down':
      tempRow = tempRow + 1;
      break;
    case 'left':
      tempCol = tempCol - 1;
      break;
    case 'right':
      tempCol = tempCol + 1;
      break;
  }
  return [tempRow, tempCol];
}

export function moveCells(grid, direction) {
  const newGrid = JSON.parse(JSON.stringify(grid));
  const gridLength = newGrid.length;
  let row = -1;
  let col = -1;
  while (true) {
    const tempRow = row;
    row = getNextRow(tempRow, col, gridLength, direction);
    col = getNextCol(tempRow, col, gridLength, direction);
    if (row < 0 || row >= gridLength || col < 0 || col >= gridLength) {
      break;
    }
    const cell = newGrid[row][col];
    if (!cell) {
      continue;
    }
    let prevRow = row;
    let prevCol = col;
    newGrid[row][col] = null;
    while (true) {
      const [newRow, newCol] = getNewLocation(prevRow, prevCol, direction);
      if (
        newRow < 0 ||
        newRow === gridLength ||
        newCol < 0 ||
        newCol === gridLength
      ) {
        newGrid[prevRow][prevCol] = cell;
        break;
      }
      const newCell = newGrid[newRow][newCol];
      if (newCell) {
        if (!Array.isArray(newCell) && newCell.value === cell.value) {
          newGrid[newRow][newCol] = [cell, newCell];
          break;
        }
        newGrid[prevRow][prevCol] = cell;
        break;
      }
      prevRow = newRow;
      prevCol = newCol;
    }
  }
  return newGrid;
}

export function mergeCells(grid) {
  const newGrid = JSON.parse(JSON.stringify(grid));
  grid.forEach((rows, rowNum) => {
    rows.forEach((cell, colNum) => {
      if (!cell || !Array.isArray(cell)) {
        return;
      }
      const updatedCell = JSON.parse(JSON.stringify(cell[1]));
      updatedCell.value = updatedCell.value * 2;
      newGrid[rowNum][colNum] = updatedCell;
    });
  });
  return newGrid;
}

export function getEmptyCells(grid) {
  const cells = [];
  grid.forEach((rows, rowNum) => {
    rows.forEach((cell, colNum) => {
      if (!cell) {
        cells.push(rowNum * grid.length + colNum);
      }
    });
  });
  return cells;
}

export function getRandomRowCol(grid) {
  const emptyCells = getEmptyCells(grid);
  if (!emptyCells.length) {
    // console.log('Game over');
    return null;
  }
  const nextCellIndex = emptyCells[getRandomInt(emptyCells.length)];
  const row = Number.parseInt(nextCellIndex / grid.length, 10);
  const col = nextCellIndex % grid.length;
  // console.log(
  //   'emptyCells',
  //   emptyCells,
  //   'nextCellIndex:',
  //   nextCellIndex,
  //   'row:',
  //   row,
  //   'col:',
  //   col
  // );
  return [row, col];
}
