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
  const { web3 } = useWeb3();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const { canPurchaseCourse, account } = useWalletInfo();

  const purchaseCourse = (order) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    console.log("Course ID Hex " + hexCourseId);
    // hex course id = 0x31343130343734000000000000000000 => 16 bytes
    // address = 0xe3C05279aeA40E5fAC8bA9d1A8803D1707B1774b
    // hex data = 31343130343734000000000000000000e3C05279aeA40E5fAC8bA9d1A8803D1707B1774b

    // Order Hash =
    // keccak256(hex data) = a3a28c093e57dadecaf37bea4a861bc86b54b3f5c8dae5b2acd8412efd6ede9d

    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );
    console.log("Order Hash " + orderHash);

    // email = test@gmail.com
    // keccak256(email) = email hash =
    // af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902
    const emailHash = web3.utils.sha3(order.email);
    console.log("Email Hash " + emailHash);

    // construst proof = emailHash + orderHash
    // proof data = af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902a3a28c093e57dadecaf37bea4a861bc86b54b3f5c8dae5b2acd8412efd6ede9d
    // Proof Hash:
    // keccak256(proof data) = ae6812a942414af38baa7157eccdc8eaa993948dc02e89eeb1f3f43237479d3f
    const proof = web3.utils.soliditySha3(
      { type: "bytes", value: emailHash },
      { type: "bytes", value: orderHash }
    );
    console.log("Proof Hash " + proof);
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
