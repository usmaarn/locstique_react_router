import { Skeleton } from "antd";

const ProductSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8">
      {Array(count).map((el) => (
        <div
          className="space-y-2 bg-white p-2 rounded-xl shadow w-full md:w-64"
          key={el}
        >
          <Skeleton className="h-32 md:h-64" />
          <div className="space-y-1">
            <Skeleton className="h-3" />
            <Skeleton className="h-3" />
          </div>
          <div className="space-x-2">
            <Skeleton className="inline-block h-3 w-10" />
            <Skeleton className="inline-block h-3 w-10" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
