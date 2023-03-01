import { Form, BannerStrip } from "@web3uikit/core";
import { useRouter } from "next/router";
import { useMoralis, useWeb3Contract } from "react-moralis";
import React, { useEffect, useState } from "react";
import trustyContactAbi from "../constants/foodTrusty.json";
import networkMapping from "../constants/networkMapping.json";
import { languageDoc } from "../constants/languageDoc";

export default function Search({ language }) {
  const router = useRouter();
  const { chainId, account, isWeb3Enabled, web3 } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];
  const { runContractFunction: getLastProductId } = useWeb3Contract();
  const [productLastId, setProductLastId] = useState();
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (isWeb3Enabled || account) {
      getProductIDD();
    }
  }, [account, language]);

  async function getProductIDD() {
    const lastProductID = await getLastProductId({
      params: {
        abi: trustyContactAbi,
        contractAddress: foodTrustyContractAddress,
        functionName: "getLastProductId",
        params: {},
      },
    });
    //console.log(parseInt(lastProductID));

    setProductLastId(parseInt(lastProductID));
  }

  return (
    <div>
      <div>
        {" "}
        {isWeb3Enabled ? (
          !check ? (
            <Form
              buttonConfig={{
                onClick: function noRefCheck() {},
                theme: "primary",
              }}
              data={[
                {
                  inputWidth: "100%",
                  name: languageDoc[language]["EnteryourproductId"],
                  type: "text",
                  value: "",
                  validation: {
                    required: true,
                  },
                },
              ]}
              onSubmit={function goToProductPage(tx) {
                // console.log(tx.data[0].inputResult);
                if (tx.data[0].inputResult <= productLastId) {
                  setCheck(false);
                  router.push({
                    pathname: `/${tx.data[0].inputResult}`,
                  });
                } else {
                  setCheck(true);
                }
              }}
              title={languageDoc[language]["SearchbyProductId"]}
            />
          ) : (
            <div>
              <div
                key="1"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  transform: "scale(1)",
                }}
              >
                <BannerStrip
                  onCloseBtnClick={function noRefCheck() {}}
                  text={languageDoc[language]["PleaseentervalidproductId"]}
                  type="error"
                />
              </div>
              <div className="py-10">
                <Form
                  buttonConfig={{
                    onClick: function noRefCheck() {},
                    theme: "primary",
                  }}
                  data={[
                    {
                      inputWidth: "100%",
                      name: languageDoc[language]["EnteryourproductId"],
                      type: "text",
                      value: "",
                      validation: {
                        required: true,
                      },
                    },
                  ]}
                  onSubmit={function goToProductPage(tx) {
                    //console.log(tx.data[0].inputResult);
                    if (tx.data[0].inputResult <= productLastId) {
                      setCheck(false);
                      router.push({
                        pathname: "/productPage",
                        query: { productId: tx.data[0].inputResult },
                      });
                    } else {
                      setCheck(true);
                    }
                  }}
                  title={languageDoc[language]["SearchbyProductId"]}
                />
              </div>
            </div>
          )
        ) : (
          <div>
            <div
              key="1"
              style={{
                display: "flex",
                flexDirection: "column",
                transform: "scale(1)",
              }}
            >
              <BannerStrip
                onCloseBtnClick={function noRefCheck() {}}
                text={languageDoc[language]["PleaseConnectWallet"]}
                type="error"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
