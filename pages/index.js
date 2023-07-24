import { CourseList } from "@components/course";
import { Hero, Breadcrumbs } from "@components/common";
import { OrderCard } from "@components/order";
import { EthRates, WalletBar } from "@components/web3";
import { BaseLayout } from "@components/layout";
import { getAllCourses } from "@content/courses/fetcher";

export default function Home({ courses }) {
  return (
    <>
      <Hero />
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

Home.Layout = BaseLayout;
