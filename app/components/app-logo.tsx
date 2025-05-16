import { cn } from "~/lib/utils";
import { Link, type LinkProps } from "react-router";

const AppLogo = ({
  className,
  ...props
}: Omit<LinkProps, "to" | "children"> & { className?: string }) => {
  return (
    <Link
      to="/"
      className={cn("text-2xl sm:text-3xl text-black! uppercase", className)}
      {...props}
    >
      <b>Locs</b>
      <span className="font-light">tique</span>
    </Link>
  );
};

export default AppLogo;
