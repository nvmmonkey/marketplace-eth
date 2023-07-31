import Image from "next/image";
import Link from "next/link";

export default function Card({ course }) {
  return (
    <div

      className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
    >
      <div className="flex h-full w-full">
        <div className="flex w-full h-full ">
          <Image
            className="object-cover"
            height="230"
            width="200"
            src={course.coverImage}
            alt={course.title}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {course.type}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
          >
            {course.title}
          </Link>
          <p className="mt-2 text-gray-500">{course.description}</p>
        </div>
      </div>
    </div>
  );
}
