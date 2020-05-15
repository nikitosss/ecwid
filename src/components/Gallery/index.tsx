import './styles.scss';

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

export const Gallery = ({
  images,
  options: { rowMaxHeight = 100, gap },
  width: wrapWidth = 0,
  debounceWait = 300,
  className,
  style,
  ...props
}: GalleryProps & React.HTMLAttributes<HTMLElement>): JSX.Element => {
  const [grid, setGrid] = useState<Array<Cell<ImageType>>>();
  const [wrapHeight, setWrapHeight] = useState<string>('auto');
  const wrapElement = useRef<HTMLDivElement>(Object.create(null));
  const setState = useCallback(() => {
    const cells = generateGrid<ImageType>(images, {
      width: wrapElement.current ? wrapElement.current.offsetWidth : wrapWidth,
      rowMaxHeight,
      gap,
    });
    const lastCell = cells[cells.length - 1];

    setWrapHeight(`${lastCell.top + lastCell.height}px`);
    setGrid(cells);
  }, [images, wrapWidth, rowMaxHeight, gap]);
  const debounceHandler = debounce(setState, debounceWait);

  useEffect(() => {
    setState();
    window.addEventListener('resize', debounceHandler);

    return (): void => {
      window.removeEventListener('resize', debounceHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, wrapWidth, rowMaxHeight, gap]);

  return (
    <div
      className={`gallery${className ? ` ${className}` : ''}`}
      ref={wrapElement}
      style={{ ...style, height: wrapHeight }}
      {...props}
    >
      {grid &&
        grid.map(({ top, left, height, width, object }) => (
          <img
            className="gallery__item"
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
        ))}
    </div>
  );
};

export default Gallery;
