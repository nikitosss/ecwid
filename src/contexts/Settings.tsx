import React from 'react';

export const Settings = React.createContext({
  defaultUrl: `${document.location.href}/frontend-test-task/gallery-images.json`,
  rowMaxHeight: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeRowMaxHeight: (value: number) => {},
  maxWidth: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeMaxWidth: (value: number) => {},
  minWidth: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeMinWidth: (value: number) => {},
});

export default Settings;
