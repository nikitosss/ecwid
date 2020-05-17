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

function addRow<T extends Obj>(selectedObjects: Array<T>, height: number, top: number, gap: number): Array<Cell<T>> {
  const result: Array<Cell<T>> = [];

  selectedObjects.reduce((left, object) => {
    const ratio = height / object.height;
    const width = object.width * ratio;

    result.push({
      width,
      height,
      left,
      top,
      object,
    });

    return left + width + gap;
  }, 0);

  return result;
}

export default <T extends Obj>(objects: Array<T>, { rowMaxHeight, width, gap = 0 }: Options): Array<Cell<T>> => {
  let list = cloneDeep<Array<T>>(objects);
  let grid: Array<Cell<T>> = [];
  let top = 0;

  while (list.length > 0) {
    let rowHeight = 0;
    let selectedObjects: Array<T> = [];

    const isFull = list.some((item) => {
      selectedObjects.push(item);

      rowHeight = getRowHeight(selectedObjects, width, gap);

      return rowHeight <= rowMaxHeight;
    });

    if (isFull) {
      grid = [...grid, ...addRow<T>(selectedObjects, rowHeight, top, gap)];
      top += rowHeight + gap;
    } else {
      grid = [...grid, ...addRow<T>(selectedObjects, rowMaxHeight, top, gap)];
      break;
    }

    list = list.slice(selectedObjects.length);

    selectedObjects = [];
  }

  return grid;
};
