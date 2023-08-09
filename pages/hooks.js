import { useEthPrice } from "@components/hooks/useEthPrice";
import { useEffect, useState } from "react";

const useCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount((c) => c + 1);
    }, [1000]);
  }, []);

  console.log("CALLING USECOUNTER");

  return count;
};

const SimpleComponents = () => {
  //   const count = useCounter();

  const { eth } = useEthPrice();

  return <h1>Simple Component - {eth.data}</h1>;
};

export default function HooksPage() {
  //   const count = useCounter();
  const { eth } = useEthPrice();

  return (
    <>
      <div>Hello World - {eth.data}</div>
      <SimpleComponents />
    </>
  );
}
