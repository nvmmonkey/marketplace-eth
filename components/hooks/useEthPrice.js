import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);
  const jsonData = await res.json();

  return jsonData.market_data.current_price.usd ?? null;
};

const URL =
  "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false";

export const useEthPrice = () => {
  //   const swrRes = useSWR(URL, (url) => {
  //     fetcher(url);
  //   });

  //   return swrRes;

  const swrRes = useSWR(URL, fetcher, { refreshInterval: 1000 });

  return { eth: { ...swrRes } };
};
