import React, { useState } from 'react';
import { HambugerMenuHistoryContext } from './Context';

export const HambugerMenuHisotryProvider = ({ children }) => {
  const [menuHistory, setMenuHistory] = useState<Array<string>>([]);

  const addMenuHistory = (item) => {
    setMenuHistory([...menuHistory, item]);
  };

  const undoMenuHistory = () => {
    const updatedMenuHistory = [...menuHistory];
    updatedMenuHistory.pop();
    setMenuHistory(updatedMenuHistory);
  };

  const HambugerMenuHisotryValues = {
    menuHistory,
    addMenuHistory,
    undoMenuHistory
  };

  return <HambugerMenuHistoryContext.Provider value={HambugerMenuHisotryValues}>{children}</HambugerMenuHistoryContext.Provider>;
};
