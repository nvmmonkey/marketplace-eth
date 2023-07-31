import { useEffect } from "react";
import useSWR from "swr";

export const handler = (web3, provider) => () => {
  const { mutate, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const netId = await web3.eth.getChainId();
      return netId.toString();
    }
  );

  useEffect(() => {
    provider && provider.on("chainChanged", (chainId) => mutate(chainId));
  }, [web3]);

  return {
    network: {
      mutate,
      ...rest,
    },
  };
};
