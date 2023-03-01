import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import trustyContactAbi from "../constants/foodTrusty.json";
import InputFormDistributor from "../components/InputFormDistributor";
import InputFormGlower from "../components/InputFormGlower";
import InputFormRestaurant from "../components/InputFormRestaurant";
import InputFormManufacturer from "../components/InputFormManufacturer";
import InputFormSlaughter from "../components/InputFormSlaughter";
import { BannerStrip } from "@web3uikit/core";
import InputFormExample from "../components/example";

export default function Home() {
  const [formId, setFormId] = useState("");
  const { isWeb3Enabled, account, chainId } = useMoralis();
  let foodTrustyContractAddress;
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  if (networkMapping[chainString] != undefined) {
    foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];
  } else {
    foodTrustyContractAddress = networkMapping["31337"].foodTrusty[0];
  }

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

  async function ShowForm() {
    if (await getManufacturer()) {
      setFormId(1);
    }
    if (await getRestaurant()) {
      setFormId(2);
    }
    if (await getGrower()) {
      setFormId(3);
    }
    if (await getSlaughter()) {
      setFormId(4);
    }
    if (await getWholesaler()) {
      setFormId(5);
    }
    if (await getAdmin()) {
      setFormId(6);
    }
  }

  useEffect(() => {
    setFormId(0);
    if (account) {
      ShowForm();
    }
  }, [account]);

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
          chainString === "80001" || networkMapping[chainString] ? (
            formId === 0 ? (
              <div>
                <BannerStrip
                  onCloseBtnClick={function noRefCheck() {}}
                  text="You are not registered!"
                  type="error"
                />
              </div>
            ) : formId === 1 ? (
              <InputFormExample />
            ) : formId === 2 ? (
              <InputFormRestaurant />
            ) : formId === 3 ? (
              <InputFormGlower />
            ) : formId === 4 ? (
              <InputFormSlaughter />
            ) : formId === 5 ? (
              <InputFormDistributor />
            ) : (
              ""
            )
          ) : (
            <div>
              <BannerStrip
                onCloseBtnClick={function noRefCheck() {}}
                text="Please switch to Polygon Network"
                type="error"
              />
            </div>
          )
        ) : (
          <div>
            <BannerStrip
              onCloseBtnClick={function noRefCheck() {}}
              text="Please connect a Wallet"
              type="error"
            />
          </div>
        )}
      </div>

      <div className="px-10"></div>
    </div>
  );
}
