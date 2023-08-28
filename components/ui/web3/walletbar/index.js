import { useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button } from "@components/ui/common";

export default function WalletBar() {
  const { requireInstall, hasFinishedFirstFetch } = useWeb3();
  const { account, network } = useWalletInfo();

  return (
    <section className="text-white bg-indigo-600 rounded-lg">
      <div className="p-8">
        <h1 className="lg:text-2xl md:text-xl xs:text-sm break-words">
          Hello, {account.data}
        </h1>
        <h2 className="subtitle mb-5 lg:text-2xl md:text-xl xs:text-base ">
          I hope you are having a great day!
        </h2>
        <div className="flex justify-between items-center">
          <div className="sm:flex sm:justify-center lg:justify-start ">
            <Button
              variant="white"
              className="mr-2 lg:text-xl md:text-xl xs:text-sm p-2"
            >
              Learn how to purchase
            </Button>
          </div>
          <div>
            {!hasFinishedFirstFetch &&
              !network.isSupported &&
              !requireInstall && (
                <div className="bg-red-400 p-4 rounded-lg">
                  <div>Connected to wrong network</div>
                  <div>
                    Connect to: {` `}
                    <strong className="text-2xl">{network.target}</strong>
                  </div>
                </div>
              )}
            {requireInstall && (
              <div className="bg-yellow-500 p-4 rounded-lg my-2">
                Cannot connect to network. Please install Metamask.
              </div>
            )}
            {!hasFinishedFirstFetch && network.data && (
              <div>
                <span>Currently on </span>
                <strong className="text-2xl">{network.data}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
