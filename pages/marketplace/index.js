import { CourseList } from "@components/ui/course";
import { WalletBar } from "@components/ui/web3";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useAccount } from "@components/hooks/web3/useAccount";
import { useNetwork } from "@components/hooks/web3/useNetwork";

export default function Marketplace({ courses }) {
  const { account } = useAccount();
  const { network } = useNetwork();

  return (
    <>
      <div className="py-4">
        <WalletBar address={account.data} network={network.data} />
      </div>
      <CourseList courses={courses} />
    </>
  );
}

//** ------------- */
//** STATIC RENDER */
//** ------------- */

export function getStaticProps() {
  const { data, courseMap } = getAllCourses();

  return {
    props: {
      courses: data,
    },
  };
}

Marketplace.Layout = BaseLayout;
