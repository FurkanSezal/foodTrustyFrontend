import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import TableListMor from "../components/tablelistMor";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import trustyContactAbi from "../constants/foodTrusty.json";
import React, { useEffect, useState } from "react";
import Search from "../components/end-user-home-search";
import { BannerStrip } from "@web3uikit/core";

export default function Home() {
  const { chainId, account, isWeb3Enabled, web3 } = useMoralis();
  let foodTrustyContractAddress;
  const chainString = chainId ? parseInt(chainId).toString() : "31337";

  if (networkMapping[chainString] != undefined) {
    foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];
  } else {
    foodTrustyContractAddress = networkMapping["31337"].foodTrusty[0];
  }

  const [flag, setflag] = useState(false);

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

  async function showHomePage() {
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

  useEffect(() => {
    if (account) {
      showHomePage();
    }
  }, [account, isWeb3Enabled]);

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
            {chainString === "80001" || networkMapping[chainString] ? (
              <div>
                <div>{flag ? <TableListMor /> : <Search />}</div>
              </div>
            ) : (
              <div>
                <BannerStrip
                  onCloseBtnClick={function noRefCheck() {}}
                  text="Please switch to Polygon Network"
                  type="error"
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <BannerStrip
              onCloseBtnClick={function noRefCheck() {}}
              text="Please Connect a Wallet!"
              type="error"
            />
          </div>
        )}
      </div>
    </div>
  );
}
