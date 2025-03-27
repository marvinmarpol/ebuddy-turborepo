import { useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import { ReactNode, useEffect } from "react";

import { useAuth } from "../context/authProvider";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "90vh",
          alignItems: "center",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
