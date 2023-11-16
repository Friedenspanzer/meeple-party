"use client";

import classNames from "classnames";
import { createContext, useContext, useId, useState } from "react";

interface ModalProviderProps {
  children?: React.ReactNode;
}

interface ModalConfiguration {
  title: String;
  content: React.ReactNode;
}

interface ModalContext {
  open: (configuration: ModalConfiguration) => void;
}

const ModalContext = createContext<ModalContext>({
  open: (_) => {},
});

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  return (
    <ModalContext.Provider
      value={{
        open: (_) => {
          console.log("HURZ");
          setOpen(true);
        },
      }}
    >
      <div
        className={classNames("modal fade", { show: open })}
        style={open ? { display: "block" } : {}}
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby={titleId}
        aria-hidden={!open}
        data-bs-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={titleId}>
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {children}
    </ModalContext.Provider>
  );
};

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export default ModalProvider;
