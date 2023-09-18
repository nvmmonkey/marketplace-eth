import { useEthPrice, COURSE_PRICE } from "@components/hooks/useEthPrice";
import { Loader } from "@components/ui/common";
import Image from "next/image";

export default function EthRates() {
  const { eth } = useEthPrice();

  return (
    <div className="flex flex-col xs:flex-row items-center">
      <div className="p-6 border drop-shadow rounded-md mr-2 text-center">
        <div className="flex items-center">
          {eth.data ? (
            <>
              <Image height="35" width="35" src="/small-eth.webp" />
              <span className="text-xl font-bold"> = {eth.data}$</span>
            </>
          ) : (
            <div className=" flex justify-center">
              <Loader size="sm" />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-500">Current eth Price</p>
      </div>

      <div className="p-6 border drop-shadow rounded-md text-center">
        <div className="flex items-center">
          <span className="text-xl font-bold ">{eth.perItem}</span>
          {eth.data ? (
            <>
              <Image height="35" width="35" src="/small-eth.webp" />
              <span className="text-2xl font-bolds"> = ${COURSE_PRICE}</span>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Loader size="md" />
            </div>
          )}
        </div>
        <p className="text-lg text-gray-500">Price per course</p>
      </div>
    </div>
  );
}
