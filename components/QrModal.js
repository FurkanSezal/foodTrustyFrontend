import { Modal } from "@web3uikit/core";
import Image from "next/image";

export default function UpdateModal({ isVisible, onClose, imageURI }) {
  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={async () => {
        try {
          const a = document.createElement("a");
          a.href = imageURI;
          a.download = "Image.png";
          a.click();
        } catch (err) {
          console.error(err);
        }
      }}
      okText="Download QR Code"
    >
      <Image
        loader={() => imageURI}
        src={imageURI}
        alt=""
        width={400}
        height={400}
      />
    </Modal>
  );
}
