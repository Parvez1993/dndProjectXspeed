import React, { useState, useCallback } from "react";

import DropZone from "./DropZone";
import TrashDropZone from "./TrashDropZone";
import SideBarItem from "./SideBarItem";
import Row from "./Row";
import initialData from "./initial-data";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from "./helpers";

import {
  SIDEBAR_ITEMS,
  SIDEBAR_ITEM,
  COMPONENT,
  COLUMN,
  ROW,
  COLUMNs,
} from "./constants";
import shortid from "shortid";
import { useEffect } from "react";
import MyModal from "./MyModal";

const Container = () => {
  const initialLayout = initialData.layout; // this is the very first initial layout
  const initialComponents = initialData.components; // component0: {id: 'component0', type: 'input', content: 'Some input'}

  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  const [result, setResult] = useState(
    JSON.stringify(layout, null, layout.length)
  );

  useEffect(() => {
    setResult(JSON.stringify(layout, null, layout.length));
  }, [setLayout, layout]);

  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        if (item.component.type === ROW) {
          const newComponent = {
            id: shortid.generate(),
            ...item.component,
          };
          const newItem = {
            id: newComponent.id,
            type: ROW,
          };
          setComponents({
            ...components,
            [newComponent.id]: newComponent,
          });
          setLayout(
            handleMoveSidebarComponentIntoParent(
              layout,
              splitDropZonePath,
              newItem
            )
          );
          return;
        }

        if (item.component.type === COLUMN) {
          const newComponent = {
            id: shortid.generate(),
            ...item.component,
          };
          const newItem = {
            id: newComponent.id,
            type: COLUMN,
          };
          setComponents({
            ...components,
            [newComponent.id]: newComponent,
          });
          setLayout(
            handleMoveSidebarComponentIntoParent(
              layout,
              splitDropZonePath,
              newItem
            )
          );
          return;
        }
        // 1. Move sidebar item into page
        const newComponent = {
          id: shortid.generate(),
          ...item.component,
        };
        const newItem = {
          id: newComponent.id,
          type: COMPONENT,
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent,
        });
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
    },
    [layout, components]
  );

  const renderRow = (row, currentPath, layoutRender) => {
    return (
      <Row
        key={row.id}
        data={row} //{type: 'row', id: 'row0', children: Array(2)}
        handleDrop={handleDrop}
        components={components}
        // components: {
        //   component0: { id: "component0", type: "input", content: "Some input" },
        //   component1: { id: "component1", type: "image", content: "Some image" },
        // }
        path={currentPath} //0
        layoutRender={layoutRender}
      />
    );
  };

  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <>
      <MyModal />
      <div className="body">
        <div className="sideBar">
          {Object.values(SIDEBAR_ITEMS).map((sideBarItem, index) => (
            <SideBarItem key={sideBarItem.id} data={sideBarItem} />
          ))}
        </div>
        <div className="pageContainer">
          <div className="page">
            {layout.map((row, index) => {
              const currentPath = `${index}`;

              const layoutRender = true;
              return (
                <React.Fragment key={row.id}>
                  <DropZone
                    data={{
                      path: currentPath, //0
                      childrenCount: layout.length,
                    }}
                    onDrop={handleDrop}
                    path={currentPath}
                  />

                  {renderRow(row, currentPath, layoutRender)}
                </React.Fragment>
              );
            })}
            <DropZone
              data={{
                path: `${layout.length}`, // 2
                childrenCount: layout.length, //2
              }}
              onDrop={handleDrop}
              isLast
            />
          </div>

          <TrashDropZone
            data={{
              layout,
            }}
            onDrop={handleDropToTrashBin}
          />
        </div>
      </div>
      <div className="out_box">
        <pre className="result">{result}</pre>
      </div>
      lo
    </>
  );
};
export default Container;
