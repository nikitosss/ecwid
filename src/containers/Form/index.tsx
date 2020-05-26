import './styles.scss';

import { cn } from '@bem-react/classname';
import React, { useContext, useState } from 'react';
import importImages from 'src/api/importImages';
import SettingsContext from 'src/contexts/Settings';
import { ImageType } from 'src/types/Image';

type FormProps = {
  onImport: (images: ImageType[]) => void;
};

const b = cn('form');

export const Form = ({
  onImport,
  className,
  ...props
}: FormProps & React.HTMLAttributes<HTMLFormElement>): JSX.Element => {
  const {
    defaultUrl,
    rowMaxHeight,
    changeRowMaxHeight,
    maxWidth,
    changeMaxWidth,
    minWidth,
    changeMinWidth,
  } = useContext(SettingsContext);
  const [url, setUrl] = useState<string>(defaultUrl);
  const onSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();

    importImages(url)
      .then((images) => onImport(images))
      .catch((error: Error) => {
        alert(error);
        return console.error(error);
      });
  };

  return (
    <form className={b(undefined, [className])} {...props} onSubmit={onSubmit}>
      <fieldset className={b('fieldset')}>
        <legend>Import</legend>
        <div className={b('group')}>
          <label className={b('label')} htmlFor="url">
            <input
              className={b('input')}
              type="url"
              name="url"
              id="url"
              pattern="https?://.+"
              required
              defaultValue={defaultUrl}
              onChange={(event): void => setUrl(event.target.value)}
            />
          </label>
          <button className={b('button')} type="submit" disabled={!url}>
            Upload
          </button>
        </div>
      </fieldset>
      <fieldset className={b('fieldset')}>
        <legend>Settings</legend>
        <div className={b('group')}>
          <label className={b('label')} htmlFor="rowMaxHeight">
            <span className={b('labelText')}>Row max height</span>
            <input
              className={b('input')}
              type="number"
              id="rowMaxHeight"
              required
              defaultValue={rowMaxHeight}
              onChange={(event): void => changeRowMaxHeight(Number(event.target.value))}
            />
          </label>
          <label className={b('label')} htmlFor="maxWidth">
            <span className={b('labelText')}>Max width</span>
            <input
              className={b('input')}
              type="number"
              id="maxWidth"
              required
              defaultValue={maxWidth}
              onChange={(event): void => changeMaxWidth(Number(event.target.value))}
            />
          </label>
          <label className={b('label')} htmlFor="minWidth">
            <span className={b('labelText')}>Min width</span>
            <input
              className={b('input')}
              type="number"
              id="minWidth"
              required
              defaultValue={minWidth}
              onChange={(event): void => changeMinWidth(Number(event.target.value))}
            />
          </label>
        </div>
      </fieldset>
    </form>
  );
};

export default Form;
