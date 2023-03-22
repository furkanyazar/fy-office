import React from "react";
import { Button, Modal } from "react-bootstrap";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";

import { hideNotification } from "../../store/slices/notificationSlice";

const NotificationModal = () => {
  const dispatch = useAppDispatch();

  const { show, title, description, buttons } = useAppSelector((state) => state.notificationItems);

  const handleClose = () => dispatch(hideNotification());

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        {buttons.map((button, index) => (
          <Button key={index} variant={button.variant} onClick={button.handleClick}>
            {button.text}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
