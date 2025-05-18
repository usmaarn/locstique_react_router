import { Button, Result, Space } from "antd";
import { ButtonLink } from "./link";
import { useNavigate } from "react-router";

const ErrorPage = ({
  status = 500,
  message = "Interna Server Error",
  details = "An unexpected error occurred.",
}: {
  status?: number;
  details?: string;
  message?: string;
}) => {
  const navigate = useNavigate();

  return (
    <main className="pt-16 p-4 container mx-auto">
      <Result
        status={status as 500}
        title={message}
        subTitle={details}
        extra={
          <Space>
            <ButtonLink to="/" type="primary">
              Back to Home
            </ButtonLink>

            {status !== 404 && (
              <Button onClick={() => navigate(0)} color="blue" variant="solid">
                Reload Page
              </Button>
            )}
          </Space>
        }
      />
    </main>
  );
};

export default ErrorPage;
