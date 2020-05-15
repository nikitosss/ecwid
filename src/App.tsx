import './App.scss';

import React, { useEffect, useState } from 'react';
import importImages from 'src/api/importImages';
import Loader from 'src/components/Spinner';
import { ImageType } from 'src/types/Image';

const Gallery = React.lazy(() => import('src/components/Gallery'));

const defaultUrl = `${document.location.href}/frontend-test-task/gallery-images.json`;

export const App = (): JSX.Element => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [rowMaxHeight, setRowMaxHeight] = useState<number>(162);
  const [maxWidth, setMaxWidth] = useState<number>(860);
  const [minWidth, setMinWidth] = useState<number>(320);
  const onSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    const urlElement = document.querySelector<HTMLInputElement>('#url');
    const url = urlElement ? urlElement.value : '';

    importImages(url)
      .then((response) => setImages([...response, ...images]))
      .catch((error: Error) => {
        alert(error);
        return console.error(error);
      });
  };

  useEffect(() => {
    importImages(defaultUrl)
      .then((response) => setImages(response))
      .catch((error: Error) => console.error(error));
  }, []);

  return (
    <div className="app">
      <form className="app__form" onSubmit={onSubmit}>
        <fieldset className="app__fieldset">
          <legend>Импорот</legend>
          <div className="app__group">
            <label className="app__label" htmlFor="url">
              <input
                className="app__input"
                type="url"
                name="url"
                id="url"
                pattern="https?://.+"
                required
                defaultValue={defaultUrl}
              />
            </label>
            <button className="app__button" type="submit">
              Submit
            </button>
          </div>
        </fieldset>
        <fieldset className="app__fieldset">
          <legend>Настройки</legend>
          <div className="app__group">
            <label className="app__label" htmlFor="rowMaxHeight">
              <span className="app__label_text">Row max height</span>
              <input
                className="app__input"
                type="number"
                id="rowMaxHeight"
                required
                defaultValue={rowMaxHeight}
                onChange={(event): void => setRowMaxHeight(Number(event.target.value))}
              />
            </label>
            <label className="app__label" htmlFor="maxWidth">
              <span className="app__label_text">Max width</span>
              <input
                className="app__input"
                type="number"
                id="maxWidth"
                required
                min={minWidth}
                defaultValue={maxWidth}
                onChange={(event): void => setMaxWidth(Number(event.target.value))}
              />
            </label>
            <label className="app__label" htmlFor="minWidth">
              <span className="app__label_text">Min width</span>
              <input
                className="app__input"
                type="number"
                id="minWidth"
                required
                max={maxWidth}
                defaultValue={minWidth}
                onChange={(event): void => setMinWidth(Number(event.target.value))}
              />
            </label>
          </div>
        </fieldset>
      </form>
      {Boolean(images.length) && (
        <div className="app__gallery" style={{ maxWidth: `${maxWidth}px`, minWidth: `${minWidth}px` }}>
          <React.Suspense fallback={<Loader />}>
            <Gallery
              images={images}
              options={{
                rowMaxHeight,
                gap: 4,
              }}
              width={maxWidth}
            />
          </React.Suspense>
        </div>
      )}
    </div>
  );
};

export default App;
