import useAuth from "@/lib/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return function SecureRoute(props) {
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate("/auth/login");
      }
      setIsLoading(false);
    }, [user, navigate]);

    if (isLoading)
      return (
        <div className="grid h-screen  place-items-center">
          <span className="loading loading-infinity loading-lg text-blue-500"></span>
        </div>
      );

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
