import { handler as createAccountHook } from "./useAccount";
import { handler as createNetworkHook } from "./useNetwork";
import { handler as useOwnedCoursesHook } from "./useOwnedCourses";
import { handler as useOwnedCourseHook } from "./useOwedCourse";

export const setupHooks = ({ web3, provider, contract }) => {
  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3, provider),
    useOwnedCourses: useOwnedCoursesHook(web3, contract),
    useOwnedCourse: useOwnedCourseHook(web3, contract),
  };
};
