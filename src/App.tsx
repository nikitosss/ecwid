import './App.scss';

import { cn } from '@bem-react/classname';
import React, { useContext, useEffect, useState } from 'react';
import importImages from 'src/api/importImages';
import Loader from 'src/components/Spinner';
import FormSettings from 'src/containers/Form';
import SettingsContext from 'src/contexts/Settings';
import { ImageType } from 'src/types/Image';

const Gallery = React.lazy(() => import('src/components/Gallery'));

const b = cn('app');

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
    <section className={b()}>
      <SettingsContext.Provider
        value={{ defaultUrl, rowMaxHeight, changeRowMaxHeight, maxWidth, changeMaxWidth, minWidth, changeMinWidth }}
      >
        <header className={b('header')}>
          <FormSettings
            className={b('settings')}
            onImport={(data: ImageType[]): void => setImages([...data, ...images])}
          />
        </header>
        {Boolean(images.length) && (
          <main className={b('main')} style={{ maxWidth: `${maxWidth}px`, minWidth: `${minWidth}px` }}>
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
          </main>
        )}
      </SettingsContext.Provider>
    </section>
  );
};

export default App;
