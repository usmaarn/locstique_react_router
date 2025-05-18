import { Button, type ButtonProps } from "antd";
import { useNavigate } from "react-router";

export function ButtonLink({ to, ...props }: ButtonProps & { to: string }) {
  const navigate = useNavigate();
  return (
    <Button
      {...props}
      onClick={(e) => (props.onClick ? props.onClick(e) : navigate(to))}
    />
  );
}
