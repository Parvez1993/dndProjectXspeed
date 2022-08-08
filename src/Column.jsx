import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "./constants";
import DropZone from "./DropZone";
import Component from "./Component";
import ResizePanel from "react-resize-panel";

const style = {};
const Column = ({ data, components, handleDrop, path }) => {
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("100%");
  // On top layout
  let onResize = (event, { element, size, handle }) => {
    setWidth(size.width);
    setHeight(size.height);
  };

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
              path: `${path}-${data.children.length}`,
              childrenCount: data.children.length,
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

{
  /* <Resizable height={height} width={width} onResize={onResize}>
  <div
    className="box"
    style={{
      width: width + "px",
      height: height + "px",
    }}
  ></div>
</Resizable>; */
}
