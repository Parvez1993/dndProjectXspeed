import React, { useState } from "react";
import { useDrag } from "react-dnd";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const SideBarItem = ({ data }) => {
  const [open, setOpen] = useState(false);

  const [id, setId] = useState("");

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [{ opacity }, drag] = useDrag({
    item: data,
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  return (
    <>
      {" "}
      <div
        className="sideBarItem"
        ref={drag}
        style={{ opacity }}
        onClick={() => {
          onOpenModal();
          setId(data.id);
        }}
      >
        {data.component.type}
      </div>
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <h5>Id:{id}</h5>
      </Modal>
    </>
  );
};
export default SideBarItem;
