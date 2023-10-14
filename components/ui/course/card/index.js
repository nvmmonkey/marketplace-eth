import Image from "next/image";
import Link from "next/link";

export default function Card({ course, disabled, Footer }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="flex h-full">
        <div className="flex h-full next-image-wrapper">
          <Image
            className={`object-cover ${disabled && "filter grayscale"}`}
            src={course.coverImage}
            width="200"
            height="230"
            alt={course.title}
          />
        </div>
        <div className="p-8 pb-4 flex-1">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {course.type}
          </div>
          <Link
            className="h-12 block mt-1 text-sm sm:text-lg leading-tight font-medium text-black hover:underline"
            href={`/courses/${course.slug}`}
          >
            {course.title}
          </Link>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            {course.description.substring(0, 70)}...
          </p>
          {Footer && (
            <div className="mt-2 ">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
