import { Modal, Input } from "@web3uikit/core";
import { useState } from "react";

export default function TabModal({ isVisible, onClose, onAddProperty }) {
  const [newProperty, setNewProperty] = useState("");

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      title={"Add Property name"}
      onOk={async () => {
        try {
          onAddProperty && onAddProperty(newProperty);
          //  console.log(newProperty);
          onClose && onClose();
        } catch (err) {
          console.error(err);
        }
      }}
      okText="Ok"
    >
      <div className="py-4">
        <Input
          label="Property name"
          width="100%"
          onChange={(event) => {
            setNewProperty(event.target.value);
          }}
        />
      </div>
    </Modal>
  );
}
