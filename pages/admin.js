import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import trustyContactAbi from "../constants/foodTrusty.json";
import React, { useEffect, useState } from "react";
import {
  BannerStrip,
  Form,
  Radios,
  Button,
  useNotification,
} from "@web3uikit/core";

export default function Home() {
  const { chainId, account, isWeb3Enabled, web3 } = useMoralis();
  let foodTrustyContractAddress;
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const [role, setRole] = useState(1);
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();

  if (networkMapping[chainString] != undefined) {
    foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];
  } else {
    foodTrustyContractAddress = networkMapping["31337"].foodTrusty[0];
  }

  const [flag, setflag] = useState(false);

  const { runContractFunction: addManufacturer } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "addManufacturer",
  });

  const { runContractFunction: addGrower } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "addGrower",
  });

  const { runContractFunction: addSlaughter } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "addSlaughter",
  });
  const { runContractFunction: addWholesaler } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "addWholesaler",
  });
  const { runContractFunction: addAdmin } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "addAdmin",
  });

  const { runContractFunction: getAdmin } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "getAdmin",
  });

  const { runContractFunction: getOwner } = useWeb3Contract({
    abi: trustyContactAbi,
    contractAddress: foodTrustyContractAddress,
    functionName: "owner",
  });

  async function handleAddRole(e) {
    console.log(e);
    const address = e.data[0].inputResult;
    if (role == 0) {
      /*  console.log("role");
      console.log(e.data[0].inputResult); */

      const addRestaurantOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "addRestaurant",
        params: {
          _restaurant: address,
        },
      };

      await runContractFunction({
        params: addRestaurantOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessAddRestaurant,
      });
      async function handleOnsuccessAddRestaurant(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Restaurant Adding..",
          title: "Restaurant Added",
          position: "topR",
        });
      }
    } else if (role == 1) {
      const addGrowerOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "addGrower",
        params: {
          _grower: address,
        },
      };

      await runContractFunction({
        params: addGrowerOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessAddGrower,
      });
      async function handleOnsuccessAddGrower(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Grower Adding..",
          title: "Grower Added",
          position: "topR",
        });
      }
    } else if (role == 2) {
      const addSlaughterOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "addSlaughter",
        params: {
          _slaughter: address,
        },
      };

      await runContractFunction({
        params: addSlaughterOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessAddSlaughter,
      });
      async function handleOnsuccessAddSlaughter(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Slaughter Adding..",
          title: "Slaughter Added",
          position: "topR",
        });
      }
    } else if (role == 3) {
      const addManufacturerOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "addManufacturer",
        params: {
          _manufacturer: address,
        },
      };

      await runContractFunction({
        params: addManufacturerOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessAddManufacturer,
      });
      async function handleOnsuccessAddManufacturer(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Manufacturer Adding..",
          title: "Manufacturer Added",
          position: "topR",
        });
      }
    } else if (role == 4) {
      const addWholesalerOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "addWholesaler",
        params: {
          _wholesaler: address,
        },
      };

      await runContractFunction({
        params: addWholesalerOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessAddWholesaler,
      });
      async function handleOnsuccessAddWholesaler(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Wholesaler Adding..",
          title: "Wholesaler Added",
          position: "topR",
        });
      }
    } else {
      const addAdminOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "addAdmin",
        params: {
          _admin: address,
        },
      };

      await runContractFunction({
        params: addAdminOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessAddAdmin,
      });
      async function handleOnsuccessAddAdmin(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Admin Adding..",
          title: "Admin Added",
          position: "topR",
        });
      }
    }
  }

  async function handleDeleteRole() {
    const input = document.querySelector("#adminForm input");
    // const allInputs = document.querySelectorAll('#adminForm input');
    // allInputs.forEach(input => { console.log(input.value) })
    const address = input.value;
    // console.log(address);

    if (role == 0) {
      const removeRestaurantOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "removeRestaurant",
        params: {
          _restaurant: address,
        },
      };

      await runContractFunction({
        params: removeRestaurantOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessRemoveRestaurant,
      });
      async function handleOnsuccessRemoveRestaurant(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Restaurant Removing..",
          title: "Restaurant Removed",
          position: "topR",
        });
      }
    } else if (role == 1) {
      const removeGrowerOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "removeGrower",
        params: {
          _grower: address,
        },
      };

      await runContractFunction({
        params: removeGrowerOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessRemoveGrower,
      });
      async function handleOnsuccessRemoveGrower(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Grower Removing..",
          title: "Grower Removed",
          position: "topR",
        });
      }
    } else if (role == 2) {
      const removeSlaughterOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "removeSlaughter",
        params: {
          _slaughter: address,
        },
      };

      await runContractFunction({
        params: removeSlaughterOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessRemoveSlaughter,
      });
      async function handleOnsuccessRemoveSlaughter(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Slaughter Removing..",
          title: "Slaughter Removed",
          position: "topR",
        });
      }
    } else if (role == 3) {
      const removeManufacturerOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "removeManufacturer",
        params: {
          _manufacturer: address,
        },
      };

      await runContractFunction({
        params: removeManufacturerOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessRemoveManufacturer,
      });
      async function handleOnsuccessRemoveManufacturer(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Manufacturer Removing..",
          title: "Manufacturer Removed",
          position: "topR",
        });
      }
    } else if (role == 4) {
      const removeWholesalerOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "removeWholesaler",
        params: {
          _wholesaler: address,
        },
      };

      await runContractFunction({
        params: removeWholesalerOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessRemoveWholesaler,
      });
      async function handleOnsuccessRemoveWholesaler(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Wholesaler Removing..",
          title: "Wholesaler Removed",
          position: "topR",
        });
      }
    } else {
      const removeAdminOptions = {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "removeAdmin",
        params: {
          _admin: address,
        },
      };

      await runContractFunction({
        params: removeAdminOptions,
        onError: (error) => {
          console.log(error);
        },
        onSuccess: handleOnsuccessRemoveAdmin,
      });
      async function handleOnsuccessRemoveAdmin(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "Wholesaler Removing..",
          title: "Wholesaler Removed",
          position: "topR",
        });
      }
    }
  }

  async function showHomePage() {
    if (
      (await getAdmin({
        params: {
          params: { _admin: account },
        },
      })) ||
      (await getOwner()).toLowerCase() === account.toLowerCase()
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
                <div>
                  {flag ? (
                    <div className="px-8 py-4">
                      <Radios
                        id="radios"
                        items={[
                          "Restaurant",
                          "Grower",
                          "Slaughter",
                          "Manufacturer",
                          "Wholesaler",
                          "Admin",
                        ]}
                        onChange={(e) => {
                          setRole(e.target.value);
                        }}
                        setWhichIsChecked={0}
                      />
                      <div>
                        <Form
                          id="adminForm"
                          customFooter={
                            <div>
                              <div>
                                <Button
                                  size="regular"
                                  text="Delete The Role"
                                  theme="secondary"
                                  onClick={handleDeleteRole}
                                  type="button"
                                />
                              </div>

                              <div className="py-4">
                                <Button
                                  size="regular"
                                  text="Add New Role"
                                  theme="primary"
                                  type="submit"
                                />
                              </div>
                            </div>
                          }
                          data={[
                            {
                              name: "Address of Role",
                              type: "text",
                              validation: {
                                required: true,
                              },
                              value: "",
                            },
                          ]}
                          onSubmit={handleAddRole}
                          title="Address of Role"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <BannerStrip
                        text="You are not authorized to see this page"
                        type="error"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <BannerStrip
                  text="Please switch to Polygon Network"
                  type="error"
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <BannerStrip text="Please Connect a Wallet!" type="error" />
          </div>
        )}
      </div>
    </div>
  );
}
