import {
  useAccount,
  useNetwork,
  useOwnedCourses,
  useWalletInfo,
} from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function OwnedCourses({ courses }) {
  const { account } = useAccount();
  const { network } = useWalletInfo();
  const { requireInstall } = useWeb3();
  const router = useRouter();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  return (
    <>
      <MarketHeader />

      <section className="grid grid-cols-1">
        {!network.isSupported && (
          <div className="w-1/2">
            <Message type="danger">
              <div>Please connect to the correct network.</div>
            </Message>
          </div>
        )}
        {network.isSupported && ownedCourses.isEmpty && (
          <div className="w-1/2">
            <Message type="warning">
              <div>You don&apos;t own any courses.</div>
              <Link href="/marketplace" legacyBehavior>
                <a className="font-normal hover:underline">
                  <i className="opacity-50">Purchase Course Here</i>
                </a>
              </Link>
            </Message>
          </div>
        )}
        {account.isEmpty && (
          <div className="w-1/2">
            <Message type="warning">
              <div>
                <i>Please connect to Metamask.</i>
              </div>
            </Message>
          </div>
        )}
        {requireInstall && (
          <div className="w-1/2">
            <Message type="warning">
              <div>Please Install Metamask.</div>
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
