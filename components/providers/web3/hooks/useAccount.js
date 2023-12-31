import { useEffect } from "react";
import useSWR from "swr";

const adminAddress = {
  "0x5c232d814b697ce57aee6d2ef571ef406ad30b9f1c4d7fa2469b0589c6f3a9e0": true,
  "0x3ffc12cb3507db319b51ac713f46e96ac26c6f327cdea7c6d8cc6fe34c832aee": true,
};

export const handler = (web3) => () => {
  const { data, ...swrResponse } = useSWR(
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

  return {
    data,
    isAdmin: (data && adminAddress[web3.utils.keccak256(data)]) ?? false,
    ...swrResponse,
  };
};
