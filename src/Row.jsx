import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ROW } from "./constants";
import DropZone from "./DropZone";
import Column from "./Column";
import { useDndContext } from "./Contextapi";

const style = {};
const Row = ({ data, components, handleDrop, path, layoutRender }) => {
  let empty = [];

  const { onOpenModal, setId } = useDndContext();

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ROW,
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

  const renderColumn = (column, currentPath) => {
    console.log("column", column);
    return (
      <>
        {" "}
        {layoutRender ? (
          <Column
            key={column.id}
            data={column}
            components={components}
            handleDrop={handleDrop}
            path={currentPath}
          />
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="base draggable row"
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal();
        setId(data.id);
      }}
    >
      {data.id}
      <div className="columns">
        {data.children.map((column, index) => {
          const currentPath = `${path}-${index}`;

          return (
            <React.Fragment key={column.id}>
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children.length,
                }}
                onDrop={handleDrop}
                className="horizontalDrag"
              />
              {renderColumn(column, currentPath)}
            </React.Fragment>
          );
        })}
        <DropZone
          data={{
            path: `${path}-${data.children.length}`,
            childrenCount: data.children.length,
          }}
          onDrop={handleDrop}
          className="horizontalDrag"
          isLast
        />
      </div>
    </div>
  );
};
export default Row;
