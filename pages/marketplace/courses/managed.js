import {
  useAccount,
  useAdmin,
  useManagedCourses,
} from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import {
  CourseFilter,
  ManagedCourseCard,
  OwnedCourseCard,
} from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { useState } from "react";

const VerficationInput = ({ onVerify }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..."
      />
      <Button
        onClick={() => {
          onVerify(email);
        }}
      >
        Verify
      </Button>
    </div>
  );
};

export default function ManagedCourses() {
  const { web3, contract } = useWeb3();
  const [proofedOwnership, setProofedOwnership] = useState({});

  const { account } = useAdmin({ redirectTo: "/marketplace" });
  const { managedCourses } = useManagedCourses(account);

  const verifyCourse = (email, { hash, proof }) => {
    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { t: "bytes32", v: emailHash },
      { t: "bytes32", v: hash }
    );

    proofToCheck === proof
      ? setProofedOwnership({ ...proofedOwnership, [hash]: true })
      : setProofedOwnership({ ...proofedOwnership, [hash]: false });
  };

  if (!account.isAdmin) {
    return null;
  }

  const activateCourse = async (courseHash) => {
    try {
      await contract.methods
        .activateCourse(courseHash)
        .send({ from: account.data });
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <>
      <div className="py-4">
        <MarketHeader />
        <CourseFilter />
      </div>
      <section className="grid grid-cols-1">
        {managedCourses.data?.map((course) => {
          return (
            <ManagedCourseCard key={course.ownedCourseId} course={course}>
              <VerficationInput
                onVerify={(email) => {
                  verifyCourse(email, {
                    hash: course.hash,
                    proof: course.proof,
                  });
                }}
              />
              {proofedOwnership[course.hash] && (
                <div className="mt-2">
                  <Message>Verified!</Message>
                </div>
              )}
              {proofedOwnership[course.hash] === false && (
                <div className="mt-2">
                  <Message type="danger">Wrong Proof!</Message>
                </div>
              )}

              {course.state === "purchased" && (
                <div className="mt-2">
                  <Button
                    onClick={() => {
                      activateCourse(course.hash);
                    }}
                    variant="green"
                  >
                    Activate
                  </Button>
                  <Button variant="red">Deactivate</Button>
                </div>
              )}
            </ManagedCourseCard>
          );
        })}
      </section>
    </>
  );
}

ManagedCourses.Layout = BaseLayout;
