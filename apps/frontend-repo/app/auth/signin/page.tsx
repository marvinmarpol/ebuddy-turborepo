"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../../../context/authProvider";
import { signinSchema } from "@repo/entities";

export default function Signin() {
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  type FormFields = z.infer<typeof signinSchema>;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signinSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setErrorMsg("");

    if (!data.email || !data.password) {
      setErrorMsg("Email and password are required");
      return;
    }

    try {
      const res = await login(data.email, data.password);
      router.push("/");
    } catch (error: any) {
      setErrorMsg(error.message as string);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: "100%", padding: "3em" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          {errorMsg && <Typography color="error">{errorMsg}</Typography>}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              autoComplete="off"
              {...register("email")}
            />
            {errors.email && (
              <Typography gutterBottom variant="body2" color="error">
                {errors.email.message}
              </Typography>
            )}

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <Typography gutterBottom variant="body2" color="error">
                {errors.password.message}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ my: 3 }}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1">
                Doesn't have an account yet?
              </Typography>
              <Typography variant="body2" color="primary">
                <Link href="/auth/signup">Sign Up</Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
