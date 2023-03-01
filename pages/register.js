import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import { useRouter } from "next/router";
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
import { languageDoc } from "../constants/languageDoc";

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
  const [language, setLanguage] = useState("FR");
  const router = useRouter();
  const { lang } = router.query;

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

  async function handleLanguage(language) {
    // console.log(language);
    setLanguage(language);
  }

  useEffect(() => {
    setFormId(0);
    if (account) {
      ShowForm();
    }
  }, [account, language]);

  return (
    <div className={styles.container}>
      <Head>
        <title>foodTrusty</title>
        <meta name="description" content="foodTrusty" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header setLanguage={handleLanguage} lang={lang} />
      <div>
        {isWeb3Enabled ? (
          chainString === "80001" || networkMapping[chainString] ? (
            formId === 0 ? (
              <div>
                <BannerStrip
                  onCloseBtnClick={function noRefCheck() {}}
                  text={languageDoc[language]["Youarenotregistered"]}
                  type="error"
                />
              </div>
            ) : formId === 1 ? (
              <InputFormManufacturer language={language} />
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
                text={languageDoc[language]["PleaseswitchtoPolygonNetwork"]}
                type="error"
              />
            </div>
          )
        ) : (
          <div>
            <BannerStrip
              onCloseBtnClick={function noRefCheck() {}}
              text={languageDoc[language]["PleaseConnectWallet"]}
              type="error"
            />
          </div>
        )}
      </div>

      <div className="px-10"></div>
    </div>
  );
}
