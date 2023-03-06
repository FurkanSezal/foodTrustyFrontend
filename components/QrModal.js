import { Modal } from "@web3uikit/core";
import Image from "next/image";
import { languageDoc } from "../constants/languageDoc";

export default function UpdateModal({
  isVisible,
  onClose,
  imageURI,
  language,
}) {
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
      okText={languageDoc[language ? language : "FR"]["DownloadQRCode"]}
      cancelText={languageDoc[language ? language : "FR"]["Cancel"]}
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
