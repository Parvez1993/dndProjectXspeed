import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COMPONENT } from "./constants";
import { useDndContext } from "./Contextapi";

const style = {
  border: "1px dashed black",
  padding: "0.5rem 1rem",
  backgroundColor: "white",
  cursor: "move",
};
const Component = ({ data, components, path }) => {
  const ref = useRef(null);
  const { onOpenModal, setId } = useDndContext();
  const [{ isDragging }, drag] = useDrag({
    item: { type: COMPONENT, id: data.id, path },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const component = components[data.id];

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="component draggable"
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal();
        setId(data.id);
      }}
    >
      <div>{data.id}</div>
      <div>{component && component.content}</div>
    </div>
  );
};
export default Component;
