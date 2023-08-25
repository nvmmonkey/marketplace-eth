import { CourseList, CourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { Button } from "@components/ui/common";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { useWalletInfo } from "@components/hooks/web3";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";

export default function Marketplace({ courses }) {
  const { web3, contract } = useWeb3();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const { canPurchaseCourse, account } = useWalletInfo();

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);

    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const emailHash = web3.utils.sha3(order.email);
    const proof = web3.utils.soliditySha3(
      { t: "bytes32", v: emailHash },
      { t: "bytes32", v: orderHash }
    );

    const value = web3.utils.toWei(String(order.price));
    console.log({ hexCourseId, orderHash, emailHash, proof, value });

    try {
      const res = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      console.log(res);
    } catch (err) {
      console.log(err);
      console.error("Purhcase Course: Operation has failed!");
    }
  };

  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <CourseList courses={courses}>
        {(course) => (
          <CourseCard
            disabled={!canPurchaseCourse}
            key={course.id}
            course={course}
            Footer={() => (
              <div className="mt-4">
                <Button
                  onClick={() => setSelectedCourse(course)}
                  variant="lightPurple"
                  disabled={!canPurchaseCourse}
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          onSubmit={purchaseCourse}
          onClose={() => {
            setSelectedCourse(null);
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
