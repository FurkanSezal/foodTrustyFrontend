import { Form, useNotification, Button } from "@web3uikit/core";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import trustyContactAbi from "../constants/foodTrusty.json";
import axios from "axios";
import TabModal from "../components/TabModal";
import { useEffect, useState } from "react";
import { languageDoc } from "../constants/languageDoc";

function InputFormDistributor({ language }) {
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];

  const [defaultData, setDefaultData] = useState([
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Nameofmeal"],
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Serialnumber"],
      type: "tel",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["idoflot"],
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["idofwholesaler"],
      type: "text",
      validation: {
        required: true,
      },
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Nameofwholesaler"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Corporateidofwholesaler"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Addressofwholesaler"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Typeofwholesaler"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Zipcodeofwholesaler"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Enddate"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Purchasedate"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Dateofsale"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Cookingdate"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Nutritionalvalue"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Ingredients"],
      type: "text",
      value: "",
    },

    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Storagetemperature"],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"][
        "Lastdateofhousekeepingoffreezer"
      ],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"][
        "Howmanytimeemployeeswashtheirhandsdayofcooking"
      ],
      type: "text",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Carbonfootprint"],
      type: "text",
      value: "",
    },

    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["Image"],
      type: "file",
      value: "",
    },
    {
      inputWidth: "100%",
      name: languageDoc[language ? language : "FR"]["ProductDescription"],
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
      // console.log(`Event data: ${JSON.stringify(event.data)}`);
    }

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
        message: languageDoc[language ? language : "FR"]["ProductAdding"],
        title: languageDoc[language ? language : "FR"]["ProductAdded"],
        position: "topR",
      });
      dispatch({
        type: "Success",
        title:
          languageDoc[language ? language : "FR"][
            "Duetonetworkactivityaddingcouldtakes34mins"
          ],
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
              text={languageDoc[language ? language : "FR"]["addnewproperty"]}
              theme="secondary"
              onClick={showModel}
            />
            <Button
              size="regular"
              text={languageDoc[language ? language : "FR"]["AddProduct"]}
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
        language={language}
      ></TabModal>
    </div>
  );
}

export default InputFormDistributor;
