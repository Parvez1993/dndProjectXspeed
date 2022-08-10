import React from "react";
import Modal from "react-responsive-modal";
import { useDndContext } from "./Contextapi";

function MyModal() {
  const { open, onCloseModal, id } = useDndContext();
  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      center
      classNames={{
        overlay: "customOverlay",
        modal: "customModal",
      }}
    >
      <h2>The id of this component is:{id}</h2>
    </Modal>
  );
}

export default MyModal;
