import { Modal, Input } from "@web3uikit/core";
import { useState } from "react";
import { languageDoc } from "../constants/languageDoc";

export default function TabModal({
  isVisible,
  onClose,
  onAddProperty,
  language,
}) {
  const [newProperty, setNewProperty] = useState("");

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      title={languageDoc[language ? language : "FR"]["AddPropertyname"]}
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
      cancelText={languageDoc[language ? language : "FR"]["Cancel"]}
    >
      <div className="py-4">
        <Input
          label={languageDoc[language ? language : "FR"]["Propertyname"]}
          width="100%"
          onChange={(event) => {
            setNewProperty(event.target.value);
          }}
        />
      </div>
    </Modal>
  );
}
