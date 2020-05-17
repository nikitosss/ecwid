import React from 'react';

export const Settings = React.createContext({
  defaultUrl: `${document.location.href}/frontend-test-task/gallery-images.json`,
  rowMaxHeight: 0,
  changeRowMaxHeight(value: number) {
    this.rowMaxHeight = value;
  },
  maxWidth: 0,
  changeMaxWidth(value: number) {
    this.maxWidth = value;
  },
  minWidth: 0,
  changeMinWidth(value: number) {
    this.minWidth = value;
  },
});

export default Settings;
