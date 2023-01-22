import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import trustyContactAbi from "../constants/foodTrusty.json";
import InputFormDistributor from "../components/InputFormDistributor";
import InputFormGlower from "../components/InputFormGlower";
import InputFormRestaurant from "../components/InputFormRestaurant";
import InputForm from "../components/InputForm";
import InputFormManufacturer from "../components/InputFormManufacturer";
import InputFormSlaughter from "../components/InputFormSlaughter";
import InputFormExample from "../components/example";

export default function Home() {
  const [formId, setFormId] = useState("");
  const { isWeb3Enabled, account, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];

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
      {formId === 0 ? (
        "You are not registered! "
      ) : formId === 1 ? (
        <InputFormManufacturer />
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
      )}

      <div className="px-10"></div>
    </div>
  );
}
