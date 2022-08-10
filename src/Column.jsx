import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "./constants";
import DropZone from "./DropZone";
import Component from "./Component";
import ResizePanel from "react-resize-panel";
import { useDndContext } from "./Contextapi";

const style = {};
const Column = ({ data, components, handleDrop, path }) => {
  const { onOpenModal, setId } = useDndContext();

  let width = "100%";
  let height = "100%";

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: COLUMN,
      id: data.id,
      children: data.children,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
    return (
      <Component
        key={component.id}
        data={component}
        components={components}
        path={currentPath}
      />
    );
  };

  return (
    <>
      <ResizePanel direction="e" style={{ flexGrow: "1" }}>
        <div
          ref={ref}
          style={{ ...style, opacity }}
          className="base draggable column"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
            setId(data.id);
          }}
        >
          {data.id}
          {data.children.map((component, index) => {
            const currentPath = `${path}-${index}`;

            return (
              <React.Fragment key={component.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: data.children.length,
                  }}
                  onDrop={handleDrop}
                />
                <div
                  className="box"
                  style={{
                    width: width + "px",
                    height: height + "px",
                  }}
                >
                  {renderComponent(component, currentPath)}
                </div>
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${path}-${data.children ? data.children.length : ""}`,
              childrenCount: `${data.children ? data.children.length : ""}`,
            }}
            onDrop={handleDrop}
            isLast
          />
        </div>
      </ResizePanel>
    </>
  );
};
export default Column;
