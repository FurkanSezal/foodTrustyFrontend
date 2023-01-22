import { Table } from "@web3uikit/core";
import React, { useEffect, useState } from "react";
import trustyContactAbi from "../constants/foodTrusty.json";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";

function TableList() {
  const { chainId, account, isWeb3Enabled, web3 } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const foodTrustyContractAddress = networkMapping[chainString].foodTrusty[0];

  const [dataArray, setDataArray] = useState([]);

  let buffer = [];

  async function getEvents() {
    const provider = web3;
    const latestBlockNumber = await provider.getBlockNumber();

    const contract = new ethers.Contract(
      foodTrustyContractAddress,
      trustyContactAbi,
      web3.getSigner()
    );

    let events = await contract.queryFilter("*", 8313403, latestBlockNumber);
    // console.log(`Events: ${JSON.stringify(events)}`);

    /* events.forEach((curr) => {
      const topicsArray = curr.topics;
      console.log(topicsArray);
      topicsArray.forEach((currx) => {
        if (
          currx ===
          "0x5395c982500d238617407b91e3631a9430487141c013267f69552e7a916adf9f"
        ) {
          if (topicsArray[1].slice(26) === account.slice(2)) {
            console.log(topicsArray[2]);
            let bufferObj = {};
            bufferObj.projectId = topicsArray[2];
            bufferObj.data = topicsArray[3];
            buffer.push(bufferObj);
          }
        }
      });
    });
    console.log(`Tabledata : ${JSON.stringify(buffer)}`);
    const newDataArray = buffer.map((item) => {
      return ["", parseInt(item.projectId), item.data.toString(), ""];
    });
    // update the state with the new array
    const updatedDataArray = dataArray.concat(newDataArray);
    setDataArray(updatedDataArray); */
  }

  useEffect(() => {
    if (account || isWeb3Enabled) {
      setDataArray([]);
      getEvents();
    }
  }, [account]);

  return (
    <div>
      <Table
        columnsConfig="60px 3fr 2fr 2fr  80px"
        data={dataArray}
        header={[
          "",
          <span>ProductId</span>,
          <span>Type</span>,
          <span>Module</span>,
          "",
        ]}
        maxPages={3}
        onPageNumberChanged={function noRefCheck() {}}
        onRowClick={function noRefCheck(tx) {
          console.log(tx);
        }}
        pageSize={5}
      />
    </div>
  );
}

export default TableList;
