import { CourseList, CoursCard } from "@components/ui/course";
import { Hero } from "@components/ui/common";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useWeb3 } from "@components/providers";

export default function Home({ courses }) {
  const { web3, isLoading } = useWeb3();

  return (
    <>
      <Hero />
      <CourseList courses={courses}>
        {(course) => <CoursCard key={course.id} course={course} />}
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

Home.Layout = BaseLayout;
