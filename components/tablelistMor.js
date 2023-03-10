import { Table, Loading, Button } from "@web3uikit/core";
import React, { useEffect, useState } from "react";
import trustyContactAbi from "../constants/foodTrusty.json";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Moralis from "moralis";
import { productAddEventAbi } from "../constants/eventAbi";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import UpdateModal from "./QrModal";
import { languageDoc } from "../constants/languageDoc";

function TableListMor({ language }) {
  const { chainId, account, isWeb3Enabled, web3 } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddressChecker =
    networkMapping[chainString].foodTrusty[0];
  const foodTrustyContractAddress = foodTrustyContractAddressChecker
    ? foodTrustyContractAddressChecker
    : networkMapping["31337"].foodTrusty[0];
  const router = useRouter();
  const [dataArray, setDataArray] = useState([]);
  const [column, setColumn] = useState();
  const [showModal, setShowModal] = useState(false);
  const hideModel = () => setShowModal(false);
  const [qr, setQr] = useState();

  let buffer = [];

  const { runContractFunction: getIpfsHashById } = useWeb3Contract();

  async function getEvents() {
    let updatedDataArray = [];
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      });
    }
    const address = foodTrustyContractAddress;

    const chain = EvmChain.MUMBAI;
    const topic =
      "0xe134b4ea5d7bbbc326560c8b487b0f7dcbbc155167bc8815018c0a18eca87b86";
    const abi = productAddEventAbi;

    const response = await Moralis.EvmApi.events.getContractEvents({
      address,
      chain,
      topic,
      abi,
    });

    // console.log(response.toJSON().result);

    response.toJSON().result.forEach((curr) => {
      if (curr.data.adder.slice(2) === account.slice(2)) {
        // console.log(curr.data.productId);
        let bufferObj = {};
        bufferObj.productId = curr.data.productId;

        buffer.push(bufferObj);
      }
    });
    // console.log(`Tabledata : ${JSON.stringify(buffer)}`);
    const newDataArray = await Promise.all(
      buffer.map(async (item) => {
        // console.log(parseInt(item.productId));

        const hash = await getIpfsHashById({
          params: {
            abi: trustyContactAbi,
            contractAddress: foodTrustyContractAddress,
            functionName: "getIpfsHashById",
            params: { _productId: parseInt(item.productId) },
          },
        });

        // console.log(`hash:${hash}`);
        const requestURL = "https://gateway.pinata.cloud/ipfs/" + hash;

        const tokenURIResponse = await (await fetch(requestURL)).json();
        //console.log(requestURL);
        setColumn(tokenURIResponse[0].inputName);
        return [
          "",
          parseInt(item.productId),
          tokenURIResponse[0].inputResult,
          <Button
            color="red"
            text={languageDoc[language ? language : "FR"]["ShowQrCode"]}
            onClick={async function generateQRcode() {
              try {
                // console.log(await QRCode.toDataURL(requestURL));
                setQr(
                  await QRCode.toDataURL(window.location.href + item.productId)
                );
                setShowModal(true);
              } catch (err) {
                console.error(err);
              }
            }}
            theme="colored"
          />,
          <Button
            color="red"
            text={languageDoc[language ? language : "FR"]["DownloadQRCode"]}
            onClick={async function generateQRcode() {
              try {
                const a = document.createElement("a");
                a.href = await QRCode.toDataURL(
                  window.location.href + item.productId
                );
                a.download = "Image.png";
                a.click();
              } catch (err) {
                console.error(err);
              }
            }}
            theme="colored"
          />,
        ];
      })
    );
    //console.log(`newDataArray: ${newDataArray}`);
    // update the state with the new array

    updatedDataArray = newDataArray;
    //console.log(`updatedDataArray: ${updatedDataArray}`);
    setDataArray(updatedDataArray);
  }

  useEffect(() => {
    if (isWeb3Enabled || account) {
      getEvents();
    }
  }, [account, language]);

  return (
    <div>
      <UpdateModal
        isVisible={showModal}
        onClose={hideModel}
        imageURI={qr}
        language={language}
      />
      ;
      <Table
        columnsConfig="60px 1fr 2fr 2fr 160px"
        alignCellItems="center"
        data={dataArray}
        customLoadingContent={
          <div>
            <Loading size={30} spinnerColor="#0B72C4" text="Getting data..." />
          </div>
        }
        noPagination
        header={[
          "",
          <span>{languageDoc[language ? language : "FR"]["ProductId"]}</span>,
          <span>{column}</span>,
          "",
        ]}
        maxPages={3}
        onRowClick={function noRefCheck(tx) {
          /*  console.log(tx);
          console.log(`ProductId:${dataArray[tx][1]}`); */

          router.push({
            pathname: `/${dataArray[tx][1]}`,
          });
        }}
        pageSize={100}
      />
    </div>
  );
}

export default TableListMor;
