import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import trustyContactAbi from "../constants/foodTrusty.json";
import { Information, BannerStrip } from "@web3uikit/core";
import { useRouter } from "next/router";

export default function Home() {
  const { isWeb3Enabled, account, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];
  const productId = useRouter().query.productId;
  const [imageURI, setImageURI] = useState("");
  const [lastProductId, setLastProductId] = useState("");
  const [metadataobj, setmMetadataobj] = useState([]);
  const [flag, setflag] = useState(false);

  const { runContractFunction: getIpfsHashById } = useWeb3Contract();

  const { runContractFunction: getManufacturer } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "getManufacturer",
    params: { _manufacturer: account },
  });

  const { runContractFunction: getRestaurant } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "getRestaurant",
    params: { _restaurant: account },
  });

  const { runContractFunction: getGrower } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "getGrower",
    params: { _grower: account },
  });

  const { runContractFunction: getSlaughter } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "getSlaughter",
    params: { _slaughter: account },
  });
  const { runContractFunction: getWholesaler } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "getWholesaler",
    params: { _wholesaler: account },
  });
  const { runContractFunction: getAdmin } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "getAdmin",
    params: { _admin: account },
  });

  const { runContractFunction: getLastProductId } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "getLastProductId",
    params: {},
  });

  async function selectShowData() {
    setLastProductId(await getLastProductId());
    if (
      (await getManufacturer()) ||
      (await getRestaurant()) ||
      (await getGrower()) ||
      (await getSlaughter()) ||
      (await getWholesaler()) ||
      (await getAdmin())
    ) {
      setflag(true);
    } else {
      setflag(false);
    }
  }
  async function showData() {
    try {
      const hash = await getIpfsHashById({
        params: {
          abi: trustyContactAbi,
          contractAddress: foodTrustyContractAddress,
          functionName: "getIpfsHashById",
          params: { _productId: productId },
        },
      });
      //  console.log(hash);
      const requestURL = "https://gateway.ipfs.io/ipfs/" + hash;

      const tokenURIResponse = await (await fetch(requestURL)).json();
      //  console.log(`tokenURIResponse:${JSON.stringify(tokenURIResponse)}`);
      //  console.log(`tokenURIResponse:${typeof tokenURIResponse}`);

      setmMetadataobj(tokenURIResponse);
      const findImageUrl = tokenURIResponse.find((curr) => {
        return curr.inputName == "Image";
      });
      const imageURL =
        "https://gateway.ipfs.io/ipfs/" + findImageUrl.inputResult;
      // console.log(imageURL);
      setImageURI(imageURL);

      return tokenURIResponse;
    } catch {
      (e) => {
        console.log("error");
        console.log(e);
      };
    }
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      selectShowData();
      showData();
    } else {
      <div>
        <BannerStrip
          onCloseBtnClick={function noRefCheck() {}}
          text="Please Connect a Wallet"
          type="error"
        />
      </div>;
    }
  }, [account]);

  function showAllData() {
    if (metadataobj.length !== 0) {
      return (
        <div>
          {metadataobj.map((curr) => {
            if (curr.inputName !== "Image") {
              return (
                <div>
                  <Information
                    information={curr.inputResult}
                    topic={curr.inputName}
                  />
                </div>
              );
            }
          })}
        </div>
      );
    }
  }

  function showEndUserData() {
    if (metadataobj.length !== 0) {
      return (
        <div>
          {metadataobj.map((curr) => {
            if (
              curr.inputName == "Name of meal" ||
              curr.inputName == "Serial number" ||
              curr.inputName == "id of lot" ||
              curr.inputName == "Name of restaurant" ||
              curr.inputName == "End date" ||
              curr.inputName == "Cooking date" ||
              curr.inputName == "Nutritional value" ||
              curr.inputName == "Storage temperature" ||
              curr.inputName == "Carbon footprint"
            ) {
              return (
                <div>
                  <Information
                    information={curr.inputResult}
                    topic={curr.inputName}
                  />
                </div>
              );
            }
          })}
        </div>
      );
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>foodTrusty</title>
        <meta name="description" content="foodTrusty" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div>
        {isWeb3Enabled ? (
          <div>
            <div>
              {lastProductId > productId ? (
                <div>
                  <div className="px-2 border-b-2 flex flex-row">
                    <Information information={productId} topic="Product Id" />
                  </div>
                  <div className="px-2">
                    <div>
                      <div className="  border-spacing-10  w-full bg-white border border-red-500 rounded-md overflow-hidden">
                        <Image
                          loader={() => imageURI}
                          src={imageURI}
                          alt=""
                          width={500}
                          height={500}
                        />
                      </div>

                      <div>{flag ? showAllData() : showEndUserData()}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <BannerStrip
                    onCloseBtnClick={function noRefCheck() {}}
                    text="Please enter a valid product Id"
                    type="error"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <BannerStrip
              onCloseBtnClick={function noRefCheck() {}}
              text="Please Connect a Wallet"
              type="error"
            />
          </div>
        )}
      </div>
      <div className="px-10"></div>
    </div>
  );
}
