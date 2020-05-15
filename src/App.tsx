import './App.scss';

import React, { useContext, useEffect, useState } from 'react';
import importImages from 'src/api/importImages';
import Loader from 'src/components/Spinner';
import FormSettings from 'src/containers/Form';
import SettingsContext from 'src/contexts/Settings';
import { ImageType } from 'src/types/Image';

const Gallery = React.lazy(() => import('src/components/Gallery'));

export const App = (): JSX.Element => {
  const { defaultUrl } = useContext(SettingsContext);
  const [images, setImages] = useState<ImageType[]>([]);
  const [rowMaxHeight, setRowMaxHeight] = useState<number>(250);
  const changeRowMaxHeight = (value: number): void => setRowMaxHeight(value);
  const [maxWidth, setMaxWidth] = useState<number>(860);
  const changeMaxWidth = (value: number): void => setMaxWidth(value);
  const [minWidth, setMinWidth] = useState<number>(320);
  const changeMinWidth = (value: number): void => setMinWidth(value);

  useEffect(() => {
    importImages(defaultUrl)
      .then((response) => setImages(response))
      .catch((error: Error) => console.error(error));
  }, [defaultUrl]);

  return (
    <div className="app">
      <SettingsContext.Provider
        value={{ defaultUrl, rowMaxHeight, changeRowMaxHeight, maxWidth, changeMaxWidth, minWidth, changeMinWidth }}
      >
        <FormSettings className="app__form" onImport={(data: ImageType[]): void => setImages([...data, ...images])} />
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
      </SettingsContext.Provider>
    </div>
  );
};

export default App;
