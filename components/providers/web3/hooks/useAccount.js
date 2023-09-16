import { useEffect } from "react";
import useSWR from "swr";

const adminAddress = {
  "0x5c232d814b697ce57aee6d2ef571ef406ad30b9f1c4d7fa2469b0589c6f3a9e0": true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...swrResponse } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error(
          "Cannot retreive an account, please refresh the browser!"
        );
      }

      return account;
    }
  );

  useEffect(() => {
    console.log("SUBSCRIBTING");
    provider &&
      provider.on("accountsChanged", (accounts) => {
        console.log("ON ACCOUNT DATA");
        mutate(accounts[0] ?? null)});
        console.log(provider);
  }, [provider]);

  return {
    data,
    isAdmin: (data && adminAddress[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...swrResponse,
  };
};
