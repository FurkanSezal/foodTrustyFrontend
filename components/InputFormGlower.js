import { Form, useNotification, Button } from "@web3uikit/core";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import trustyContactAbi from "../constants/foodTrusty.json";
import axios from "axios";
import TabModal from "../components/TabModal";
import { useEffect, useState } from "react";

function InputFormGlower() {
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];

  const [defaultData, setDefaultData] = useState([
    {
      inputWidth: "100%",
      name: "Name of grower",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "id of grower",
      type: "tel",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Corporate id of grower",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "id of lot",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Place of field",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Incubation period",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Organic (Y/N)",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Harvest date",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Test date",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Test result",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Type of food gave",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Supplier of food 1",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Purchase date of food 1",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Type of fertilizer",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Supplier of fertilizer",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Purchase date of fertilizer 1",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Type of drug given",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Supplier of drug 1",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Purchase date of drug 1",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Type of packaging recyclable (Y/N)",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Place of packaging",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Mode of transport",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Storage temperature",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Place of storage",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Last date of housekeeping of place of storage and freeze 1",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "How many time employees wash their hands day of cooking",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Carbon footprint",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },

    {
      inputWidth: "100%",
      name: "Image",
      type: "file",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Product description:",
      type: "textarea",
      value: "",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const hideModel = () => setShowModal(false);
  const showModel = async () => {
    setShowModal(true);
  };

  const handleAddTab = async (property) => {
    const textField = {
      inputWidth: "100%",
      name: property,
      type: "text",

      value: "",
    };
    setDefaultData([...defaultData, textField]);
    //console.log(defaultData);
  };

  const handleSubmit = async (event) => {
    let file;
    event.data.find((curr) => {
      if (curr.inputName == "Image") {
        file = curr.inputResult;
      }
    });

    const JWT = process.env.PINATA_JWT;
    if (file) {
      /*  console.log(event.data);
    console.log(`Event data: ${JSON.stringify(event.data)}`); */
      const formData = new FormData();

      formData.append("file", file);

      const metadata = JSON.stringify({
        name: file.name,
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      //  console.log(res.data.IpfsHash);
      const image = event.data.find((curr) => {
        return curr.inputName == "Image";
      });
      image.inputResult = res.data.IpfsHash;
    }
    // console.log(`Event data: ${JSON.stringify(event.data)}`);
    const ProjectMetadataUploadResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      event.data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: JWT,
        },
      }
    );
    // console.log(`ipfs://${ProjectMetadataUploadResponse.IpfsHash}`);

    const addProductOptions = {
      abi: trustyContactAbi,
      contractAddress: foodTrustyContractAddress,
      functionName: "addProduct",
      params: {
        _ipfsHash: ProjectMetadataUploadResponse.data.IpfsHash,
      },
    };

    await runContractFunction({
      params: addProductOptions,
      onError: (error) => {
        console.log(error);
      },
      onSuccess: handleOnsuccessAddProduct,
    });
    async function handleOnsuccessAddProduct(tx) {
      await tx.wait(1);
      dispatch({
        type: "Success",
        message: "Product Adding..",
        title: "Product Added",
        position: "topR",
      });
    }
  };
  useEffect(() => {}, [defaultData]);
  return (
    <div>
      <Form
        customFooter={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              size="regular"
              text="Add New Property"
              theme="secondary"
              onClick={showModel}
            />
            <Button
              size="regular"
              text="Add Product"
              theme="primary"
              type="submit"
            />
          </div>
        }
        buttonConfig={{
          onClick: function noRefCheck() {},
          theme: "primary",
        }}
        data={defaultData}
        onSubmit={handleSubmit}
        title="Add Product"
      />
      <TabModal
        isVisible={showModal}
        onClose={hideModel}
        onAddProperty={handleAddTab}
      ></TabModal>
    </div>
  );
}

export default InputFormGlower;
