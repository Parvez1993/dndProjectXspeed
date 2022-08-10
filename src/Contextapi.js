import React, { useContext, useState } from "react";

export const DndContext = React.createContext();

export const DndContextProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [id, setId] = useState("");

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    setId("");
  };

  return (
    <DndContext.Provider value={{ open, onOpenModal, onCloseModal, id, setId }}>
      {children}
    </DndContext.Provider>
  );
};

export const useDndContext = () => {
  return useContext(DndContext);
};
