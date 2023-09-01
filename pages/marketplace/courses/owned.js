import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import Link from "next/link";
import { useRouter } from "next/router";

export default function OwnedCourses({ courses }) {
  const { account } = useAccount();
  const router = useRouter();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.hasFinishedFirstFetch &&
          (!ownedCourses.data || ownedCourses?.data.length === 0) && (
            <div className="w-1/2">
              <Message type="warning">
                <div>You don't own any courses.</div>
                <Link href="/marketplace" legacyBehavior>
                  <a className="font-normal hover:underline">
                    <i>Purchase Course</i>
                  </a>
                </Link>
              </Message>
            </div>
          )}
        {ownedCourses.data?.map((course) => (
          <OwnedCourseCard key={course.id} course={course}>
            <Button
              onClick={() => {
                router.push(`/courses/${course.slug}`);
              }}
            >
              Watch the course
            </Button>
          </OwnedCourseCard>
        ))}
      </section>
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();

  return {
    props: {
      courses: data,
    },
  };
}

OwnedCourses.Layout = BaseLayout;
