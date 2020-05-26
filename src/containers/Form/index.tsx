import './styles.scss';

import React, { useContext, useState } from 'react';
import importImages from 'src/api/importImages';
import SettingsContext from 'src/contexts/Settings';
import { ImageType } from 'src/types/Image';

type FormProps = {
  onImport: (images: ImageType[]) => void;
};

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
    <form className={`form${className ? ` ${className}` : ''}`} {...props} onSubmit={onSubmit}>
      <fieldset className="form__fieldset">
        <legend>Import</legend>
        <div className="form__group">
          <label className="form__label" htmlFor="url">
            <input
              className="form__input"
              type="url"
              name="url"
              id="url"
              pattern="https?://.+"
              required
              defaultValue={defaultUrl}
              onChange={(event): void => setUrl(event.target.value)}
            />
          </label>
          <button className="form__button" type="submit" disabled={!url}>
            Upload
          </button>
        </div>
      </fieldset>
      <fieldset className="form__fieldset">
        <legend>Settings</legend>
        <div className="form__group">
          <label className="form__label" htmlFor="rowMaxHeight">
            <span className="form__label_text">Row max height</span>
            <input
              className="form__input"
              type="number"
              id="rowMaxHeight"
              required
              defaultValue={rowMaxHeight}
              onChange={(event): void => changeRowMaxHeight(Number(event.target.value))}
            />
          </label>
          <label className="form__label" htmlFor="maxWidth">
            <span className="form__label_text">Max width</span>
            <input
              className="form__input"
              type="number"
              id="maxWidth"
              required
              defaultValue={maxWidth}
              onChange={(event): void => changeMaxWidth(Number(event.target.value))}
            />
          </label>
          <label className="form__label" htmlFor="minWidth">
            <span className="form__label_text">Min width</span>
            <input
              className="form__input"
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
