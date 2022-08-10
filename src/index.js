import React from "react";
import ReactDOM from "react-dom";
import Example from "./example";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import "./styles.css";
import { DndContextProvider } from "./Contextapi";

function App() {
  return (
    <>
      <DndContextProvider>
        <div className="App">
          <DndProvider backend={Backend}>
            <Example />
          </DndProvider>
        </div>
      </DndContextProvider>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
