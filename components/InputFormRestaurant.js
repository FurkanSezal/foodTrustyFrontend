import { Form, useNotification } from "@web3uikit/core";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import trustyContactAbi from "../constants/foodTrusty.json";
import axios from "axios";
import { storeProjectData } from "../../scripts/uploadToIpfs";

function InputFormRestaurant() {
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];

  const handleSubmit = async (event) => {
    let file;
    event.data.find((curr) => {
      if (curr.inputName == "Image") {
        file = curr.inputResult;
      }
    });

    const JWT = process.env.PINATA_JWT;

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
    // console.log(`Event data: ${JSON.stringify(event.data)}`);
    const ProjectMetadataUploadResponse = await storeProjectData(event.data);
    // console.log(`ipfs://${ProjectMetadataUploadResponse.IpfsHash}`);

    const addProductOptions = {
      abi: trustyContactAbi,
      contractAddress: foodTrustyContractAddress,
      functionName: "addProduct",
      params: {
        _ipfsHash: ProjectMetadataUploadResponse.IpfsHash,
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

  return (
    <Form
      buttonConfig={{
        onClick: function noRefCheck() {},
        theme: "primary",
      }}
      data={[
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
          name: "ID of lot",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "ID of Restaurant",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Name of restaurant",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Corporate id of restaurant",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Address of restaurant",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Type of restaurant",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Zip code of restaurant",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "End date",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Cooking date",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Nutritional value",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Ingredients",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Purchase date of ingredient 1",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Supplier of ingredient 1",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Purchase date of ingredient 2",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Supplier of ingredient 2",
          type: "text",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Storage temperature ",
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
          name: "Last date of housekeeping of place and freezer",
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
      ]}
      onSubmit={handleSubmit}
      title="Add Product"
    />
  );
}

export default InputFormRestaurant;
