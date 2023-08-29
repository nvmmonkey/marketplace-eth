import Image from "next/image";

const STATE_COLORS = {
  purchased: "indigo",
  activated: "green",
  deactivated: "red",
};

export default function OwnedCourseCard({ children, course }) {
  const stateColor = STATE_COLORS[course.state];

  return (
    <div className="bg-white border shadow overflow-hidden sm:rounded-lg mb-3">
      <div className="block md:flex">
        <div className="flex-2 lg:flex-1 sm:flex-0 relative ">
          <div className="next-image-wrapper h-90 sm:h-full">
            <Image
              className="object-cover aspect-video sm:aspect-square"
              src={course.coverImage}
              height="500"
              width="300"
              layout="responsive"
            />
          </div>
        </div>

        <div className="flex-4">
          <div className="px-4 py-3 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              <span className="mr-2">{course.title}</span>
              <span
                className={`text-xs text-${stateColor}-700 bg-${stateColor}-100 rounded-full p-2`}
              >
                {course.state}
              </span>
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {course.price} ETH
            </p>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex">
                <dt className="mr-2 text-sm font-medium text-gray-500">Course ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.ownedCourseId}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 sm:px-6 flex">
                <dt className="mr-2 text-sm font-medium text-gray-500">Proof</dt>
                <dd className="break-words mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.proof}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 sm:px-6">{children}</div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
