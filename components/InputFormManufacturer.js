import { Form, useNotification, Button } from "@web3uikit/core";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import trustyContactAbi from "../constants/foodTrusty.json";
import axios from "axios";
import TabModal from "../components/TabModal";
import { useEffect, useState } from "react";

function InputFormManufacturer() {
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];

  const [defaultData, setDefaultData] = useState([
    {
      inputWidth: "100%",
      name: "Name of meal",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Serial number",
      type: "tel",
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
      name: "id of manufacturer",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Name of manufacturer",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Corporate id of manufacturer",
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Address of manufacturer",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Type of manufacturer",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Zip code of manufacturer",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "End date",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Date of purchase of raw material",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Date of sale",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Nutritional value",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Ingredients",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Storage temperature of meal",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Ingredient 1",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Purchase date of ingredient 1",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Supplier of ingredient 1",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Place of storage of ingredient 1",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Storage temperature of ingredient 1",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Purchase date of ingredient 2",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Supplier of ingredient 2",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Place of storage of ingredient 2",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Storage temperature of ingredient 2",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Last date of housekeeping of place and freezer",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "Last date of housekeeping of freezer",
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: "How many time employees wash their hands day of cooking",
      type: "text",
      value: "",
    },

    {
      inputWidth: "100%",
      name: "Carbon footprint",
      type: "text",
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

  const handleSubmit = async (event) => {
    let file;
    const JWT = process.env.PINATA_JWT;
    event.data.find((curr) => {
      if (curr.inputName == "Image") {
        file = curr.inputResult;
      }
    });
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
      // console.log(formData);

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
      // console.log(`res= ${JSON.stringify(res)}`);
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
    // console.log(ProjectMetadataUploadResponse);
    // console.log(`ipfs://${ProjectMetadataUploadResponse.data.IpfsHash}`);

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

export default InputFormManufacturer;
