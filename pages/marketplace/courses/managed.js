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
import { normalizeOwnedCourse } from "@utils/normalize";
import { useEffect, useState } from "react";

//BEFORE TX BALANCE -  90781604576224587420 - 90.78160457622458742 ETH
//GAS 139809 * 1000000008 = 139809001118472 wei => 0.000139809001118472 ETH
// GAS +  VALUE SNED = 0.000139809001118472 + 1 = 1.000139809001118472

//AFTER TX(calculation) -> 89.7814647672 ETH
//AFTER TX BALANCE from web3.utils.getBalance() = 89781464767223468948 => 89.781464767223468948 ETH
// MATCHING    89.**7814647672**
//             89.**7814647672**23468948
// Deactivate  90.**7814647672**23468948

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
  const [searchedCourse, setSearchedCourse] = useState(null);

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

  const changeCourseState = async (courseHash, method) => {
    try {
      await contract.methods[method](courseHash).send({ from: account.data });
    } catch (e) {
      console.error(e.message);
    }
  };

  const activateCourse = async (courseHash) => {
    changeCourseState(courseHash, "activateCourse");
  };

  const deactivateCourse = async (courseHash) => {
    changeCourseState(courseHash, "deactivateCourse");
  };

  const searchCourse = async (hash) => {
    const re = /[0-9A-Fa-f]{6}/g;

    if (hash && hash.length === 66 && re.test(hash)) {
      const course = await contract.methods.getCourseHashByHash(hash).call();

      if (course.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedCourse(web3)({ hash }, course);
        setSearchedCourse(normalized);
        return;
      }
    }

    setSearchedCourse(null);
  };

  return (
    <>
      <div className="py-4">
        <MarketHeader />
        <CourseFilter onSearchSubmit={searchCourse} />
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
                  <Button
                    onClick={() => {
                      deactivateCourse(course.hash);
                    }}
                    variant="red"
                  >
                    Deactivate
                  </Button>
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
