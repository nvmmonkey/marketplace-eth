const Item = ({ title, value, className }) => {
  return (
    <div className={`${className} px-4 py-2 xs:px-6`}>
      <div className=" items-center mr-2 text-sm font-medium text-gray-500">
        {title}
      </div>
      <div className="break-all mt-1 text-sm text-gray-900 xs:mt-0 xs:col-span-2">
        {value}
      </div>
    </div>
  );
};

export default function ManagedCourseCard({
  children,
  course,
  isSearched = false,
}) {
  return (
    <div
      className={`${
        isSearched
          ? "border-indigo-700 shadow-lg shadow-indigo-200 "
          : "bg-gray-200"
      } bg-white border shadow overflow-hidden xs:rounded-lg mb-3`}
    >
      {Object.keys(course).map((key, i) => (
        <Item
          className={`${i % 2 ? "bg-white " : "bg-gray-50"}`}
          key={key}
          title={key[0].toUpperCase() + key.slice(1)}
          value={course[key]}
        />
      ))}

      <div className="bg-white px-4 py-3 xs:px-6">{children}</div>
    </div>
  );
}
