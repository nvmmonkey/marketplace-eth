import { CourseList, CourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { Button, Loader, Message } from "@components/ui/common";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";
import { withToast } from "@utils/toast";

export default function Marketplace({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, account, isConnecting } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);

    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const value = web3.utils.toWei(String(order.price));

    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { t: "bytes32", v: emailHash },
        { t: "bytes32", v: orderHash }
      );

      withToast(_purchaseCourse(hexCourseId, proof, value));
      // console.log({ hexCourseId, orderHash, emailHash, proof, value });
    } else {
      withToast(_repurchaseCourse(orderHash, value));
    }
  };

  const _purchaseCourse = async (hexCourseId, proof, value) => {
    try {
      const res = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });

      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const _repurchaseCourse = async (courseHash, value) => {
    try {
      const res = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });

      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <>
      <MarketHeader />

      <CourseList courses={courses}>
        {(course) => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <CourseCard
              disabled={!hasConnectedWallet}
              key={course.id}
              state={owned?.state}
              course={course}
              Footer={() => {
                if (requireInstall) {
                  return (
                    <Button size="sm" variant="lightPurple" disabled={true}>
                      Install
                    </Button>
                  );
                }

                if (isConnecting) {
                  return (
                    <Button size="sm" variant="lightPurple" disabled={true}>
                      <Loader size="sm" />
                    </Button>
                  );
                }

                if (!ownedCourses.hasFinishedFirstFetch) {
                  return (
                    // <div style={{ height: "42px" }}></div>
                    <Button variant="lightPurple" disabled={true}>
                      <Loader size="sm" />
                    </Button>
                  );
                }

                if (owned) {
                  return (
                    <>
                      <div className="flex">
                        <Button
                          onClick={() =>
                            alert("You are the owner of this course!")
                          }
                          size="sm"
                          variant="white"
                          disabled={false}
                        >
                          Yours &#10003;
                        </Button>
                        {owned.state === "deactivated" && (
                          <Button
                            size="sm"
                            variant="purple"
                            onClick={() => {
                              setIsNewPurchase(false);
                              setSelectedCourse(course);
                            }}
                            disabled={false}
                          >
                            Fund to Activate
                          </Button>
                        )}
                      </div>
                    </>
                  );
                }

                return (
                  <Button
                    size="sm"
                    onClick={() => setSelectedCourse(course)}
                    variant="lightPurple"
                    disabled={!hasConnectedWallet}
                  >
                    Purchase
                  </Button>
                );
              }}
            />
          );
        }}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onSubmit={purchaseCourse}
          onClose={() => {
            {
              setSelectedCourse(null);
              setIsNewPurchase(true);
            }
          }}
        />
      )}
    </>
  );
}

//** ------------- */
//** STATIC RENDER */
//** ------------- */

export function getStaticProps() {
  const { data } = getAllCourses();

  return {
    props: {
      courses: data,
    },
  };
}

Marketplace.Layout = BaseLayout;
