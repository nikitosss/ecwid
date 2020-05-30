import React from 'react';

const state = {
  defaultUrl: `${document.location.href}/frontend-test-task/gallery-images.json`,
  rowMaxHeight: 0,
  changeRowMaxHeight(value: number) {
    state.rowMaxHeight = value;
  },
  maxWidth: 0,
  changeMaxWidth(value: number) {
    state.maxWidth = value;
  },
  minWidth: 0,
  changeMinWidth(value: number) {
    state.minWidth = value;
  },
};

export const Settings = React.createContext(state);

export default Settings;
