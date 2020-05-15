import cloneDeep from 'src/utils/cloneDeep';

type Options = {
  rowMaxHeight: number;
  width: number;
  gap?: number;
};

type Obj = {
  width: number;
  height: number;
};

export type Cell<T> = {
  top: number;
  left: number;
  width: number;
  height: number;
  object: T;
};

function getRowHeight<T extends Obj>(objects: Array<T>, width: number, gap: number): number {
  const widthWithoutGap = width - objects.length * gap + gap;
  const ratio = objects.reduce((sum, object: T) => sum + object.width / object.height, 0);

  return widthWithoutGap / ratio;
}

function addRow<T extends Obj>(
  grid: Array<Cell<T>>,
  selectedObjects: Array<T>,
  height: number,
  top: number,
  gap: number
): Array<Cell<T>> {
  let left = 0;

  return selectedObjects.reduce((result, object) => {
    const ratio = height / object.height;
    const width = object.width * ratio;

    result.push({
      width,
      height,
      left,
      top,
      object,
    });

    left += width + gap;

    return result;
  }, grid);
}

export default <T extends Obj>(objects: Array<T>, { rowMaxHeight, width, gap = 0 }: Options): Array<Cell<T>> => {
  let list = cloneDeep<Array<T>>(objects);
  const grid: Array<Cell<T>> = [];
  let top = 0;

  while (list.length > 0) {
    let rowHeight = 0;
    let isFullRow = false;
    let end = 1;
    let selectedObjects: Array<T> = [];

    // eslint-disable-next-line no-loop-func
    list.some(() => {
      selectedObjects = list.slice(0, end);

      rowHeight = getRowHeight(selectedObjects, width, gap);
      isFullRow = rowHeight <= rowMaxHeight;

      if (!isFullRow) {
        end += 1;
        return false;
      }

      addRow<T>(grid, selectedObjects, rowHeight, top, gap);
      top += rowHeight + gap;
      return true;
    });

    if (!isFullRow) {
      addRow<T>(grid, selectedObjects, rowMaxHeight, top, gap);
      break;
    }

    list = cloneDeep<Array<T>>(objects).slice(grid.length);
  }

  return grid;
};
