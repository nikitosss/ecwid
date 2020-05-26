import './styles.scss';

import { cn } from '@bem-react/classname';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImageType } from 'src/types/Image';
import generateGrid, { Cell } from 'src/utils/grid';

type GalleryProps = {
  images: Array<ImageType>;
  options: {
    rowMaxHeight?: number;
    gap?: number;
  };
  width?: number;
  debounceWait?: number;
};

const b = cn('gallery');

const getGrid = (
  items: ImageType[],
  width: number,
  rowMaxHeight: number,
  gap?: number
): { cells: Array<Cell<ImageType>>; height: string } => {
  const cells = generateGrid<ImageType>(items, {
    width,
    rowMaxHeight,
    gap,
  });
  const lastCell = cells[cells.length - 1];

  return {
    cells,
    height: `${lastCell.top + lastCell.height}px`,
  };
};

export const Gallery = ({
  images,
  options: { rowMaxHeight = 100, gap },
  width: wrapWidth = 0,
  debounceWait = 300,
  className,
  style,
  children,
  ...props
}: GalleryProps & React.HTMLAttributes<HTMLElement>): JSX.Element => {
  const { cells: defaultCells, height: defaultWrapHeight = 'auto' } = getGrid(images, wrapWidth, rowMaxHeight, gap);
  const [grid, setGrid] = useState<Array<Cell<ImageType>>>(defaultCells);
  const [wrapHeight, setWrapHeight] = useState<string>(defaultWrapHeight);
  const wrapElement = useRef<HTMLDivElement>(Object.create(null));
  const setState = useCallback(() => {
    const { cells, height } = getGrid(
      images,
      wrapElement.current ? wrapElement.current.offsetWidth : wrapWidth,
      rowMaxHeight,
      gap
    );

    setWrapHeight(height);
    setGrid(cells);
  }, [images, wrapWidth, rowMaxHeight, gap]);
  const debounceHandler = debounce(setState, debounceWait);

  useEffect(() => {
    setState();
  }, [images, wrapWidth, rowMaxHeight, gap, setState]);

  useEffect(() => {
    window.addEventListener('resize', debounceHandler);

    return (): void => {
      window.removeEventListener('resize', debounceHandler);
    };
  }, [debounceHandler, debounceWait]);

  return (
    <div className={b(undefined, [className])} ref={wrapElement} style={{ ...style, height: wrapHeight }} {...props}>
      {grid &&
        (typeof children === 'function'
          ? children(grid)
          : grid.map(({ top, left, height, width, object }) => (
              <img
                className={b('item')}
                key={object.id}
                src={object.url}
                alt={object.alt || ''}
                height={height}
                width={width}
                style={{
                  top,
                  left,
                }}
              />
            )))}
    </div>
  );
};

export default Gallery;
