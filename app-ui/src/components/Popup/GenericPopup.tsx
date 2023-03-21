import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface GenericPopupWindowProps {
    size?: 'sm' | 'lg' | 'xl';
    areaLabelledBy?: string | undefined;
    show: boolean;
    onHide: () => void;
    contentClassName?: string | undefined;
    onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
    onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
    onExit?: (node: HTMLElement) => void;
    headerClassName?: string | undefined;
    title?: string;
    className?: string | undefined;
    bodyClassName?: string | undefined;
    footerClassName?: string | undefined;
    children: React.ReactNode;
    extraButton?: string | undefined;
    extraButtonVariant?: string | undefined;
    extraAction?: () => void;
    props?: any;
}
function GenericPopupWindow(props: GenericPopupWindowProps) {
  return (
    <Modal
      size={props.size}
      area-labelledby={props.areaLabelledBy}
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      contentClassName={props.contentClassName}
      onEntering={props.onEntering}
      onEntered={props.onEntered}
      onExit={props.onExit}
    >
      <Modal.Header 
        closeButton 
        className={props.headerClassName}
      >
        <Modal.Title >{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={props.bodyClassName}
      >
        {props.children}
      </Modal.Body>
      <Modal.Footer
        className={props.footerClassName}
      >
        <Button onClick={props.onHide}>Close</Button>
        {props.extraButton ? (
          <Button variant={props.extraButtonVariant} onClick={props.extraAction}>{props.extraButton}</Button>
        ) : null }
      </Modal.Footer>
    </Modal>
  );
}

export default GenericPopupWindow;
