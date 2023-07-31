import { CoursCard } from "@components/ui/course";

export default function List({ courses }) {
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((course) => (
        <CoursCard key={course.id} course={course} />
      ))}
    </section>
  );
}
