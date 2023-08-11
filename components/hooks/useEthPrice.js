import useSWR from "swr";

const URL =
  "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false";

export const COURSE_PRICE = 15;

const fetcher = async (url) => {
  const res = await fetch(url);
  const jsonData = await res.json();

  return jsonData.market_data.current_price.usd ?? null;
};

export const useEthPrice = () => {
  //   const swrRes = useSWR(URL, (url) => {
  //     fetcher(url);
  //   });

  //   return swrRes;

  const { data, ...rest } = useSWR(URL, fetcher, { refreshInterval: 10000 });

  const perItem = (data && COURSE_PRICE / Number(data))?.toFixed(6) ?? null;

  return { eth: { data, perItem, ...rest } };
};
