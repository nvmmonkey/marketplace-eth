import { CourseList } from "@components/ui/course";
import { WalletBar } from "@components/ui/web3";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useAccount, useNetwork } from "@components/hooks/web3";

export default function Marketplace({ courses }) {
  const { account } = useAccount();
  const { network } = useNetwork();

  return (
    <>
      <div className="py-4">
        <WalletBar
          address={account.data}
          network={{
            data: network.data,
            target: network.target,
            isSupported: network.isSupported,
            hasFinishedFirstFetch: network.hasFinishedFirstFetch,
          }}
        />
      </div>
      <CourseList courses={courses}>
        {(course) => <CourseCard key={course.id} course={course} />}
      </CourseList>
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
