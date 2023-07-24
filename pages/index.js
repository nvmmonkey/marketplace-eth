import { CourseList } from "@components/ui/course";
import { Hero } from "@components/ui/common";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useWeb3 } from "@components/providers";

export default function Home({ courses }) {
  const { web3, isLoading } = useWeb3();

  return (
    <>
      {isLoading
        ? "Is Loading Web3"
        : web3
        ? "Web3 Ready!"
        : "Please Install Metamask!"}
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
