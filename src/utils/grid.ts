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

/**
 * Вычисление высоты строки от размеров объектов
 *
 * @param objects массив объектов
 * @param width ширина строки
 * @param gap межобъектный интервал
 */
function getRowHeight<T extends Obj>(objects: Array<T>, width: number, gap: number): number {
  // вычисляем ширину области с учетом отсупов между объектами
  const widthWithoutGap = width - objects.length * gap + gap;
  // вычисляем сумму соотношения сотрон объектов
  const ratio = objects.reduce((sum, object: T) => sum + object.width / object.height, 0);

  // из соотношения сторон объектов вычисляем высоту строки
  return widthWithoutGap / ratio;
}

/**
 * Добавление строки в сетку
 *
 * @param objects массив объектов
 * @param height высота строки
 * @param top отступ строки от версшины сетки
 * @param gap межстрочный интервал
 */
function addRow<T extends Obj>(objects: Array<T>, height: number, top: number, gap: number): Array<Cell<T>> {
  const result: Array<Cell<T>> = [];

  // заполняем строку увеличивая отступ с лева с каждым шагом
  objects.reduce((left, object) => {
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

/**
 * Генерация сетки
 *
 * @param objects массив объектов
 * @param options опции
 * @param options.rowMaxHeight максимальная высота строки.
 * @param options.width ширинна сетки.
 * @param options.gap межобъектный интервал.
 */
export default <T extends Obj>(objects: Array<T>, { rowMaxHeight, width, gap = 0 }: Options): Array<Cell<T>> => {
  let list = [...objects]; // копируем массив, т.к. он будет мутироваться
  let grid: Array<Cell<T>> = [];
  let top = 0; // отступ сверху для текущей строки

  // обходим циклом мутируемый массив
  while (list.length > 0) {
    let rowHeight = 0; // высота строки выбранных элементов
    let selectedObjects: Array<T> = [];

    // заполняем массив выбранных элементов, входящих в условие максимальной высоты строки
    const isFull = list.some((item) => {
      selectedObjects.push(item);

      rowHeight = getRowHeight(selectedObjects, width, gap);

      return rowHeight <= rowMaxHeight;
    });

    if (isFull) {
      // добавляем строку в сетку и продолжаем обход списка
      grid = [...grid, ...addRow<T>(selectedObjects, rowHeight, top, gap)];
      top += rowHeight + gap;
    } else {
      // добавляем строку с остатком и прерываем обход
      grid = [...grid, ...addRow<T>(selectedObjects, rowMaxHeight, top, gap)];
      break;
    }

    // исключаем из списка добавленные в сетку объекты
    list = list.slice(selectedObjects.length);

    // обнуляем выбор для следующей строки
    selectedObjects = [];
  }

  return grid;
};
