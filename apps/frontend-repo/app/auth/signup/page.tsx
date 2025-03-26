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
import { registerSchema } from "@repo/entities";
import { resolve } from "path";

export default function Signin() {
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const { register: registerUser, logout } = useAuth();

  type FormFields = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setErrorMsg("");

    if (data.password !== data.confirmPassword) {
      setErrorMsg("Password confimation failed");
      return;
    }

    try {
      await registerUser(data.email, data.password);
      router.push("/");
    } catch (error: any) {
      setErrorMsg(error.message as string);
    } finally {
      reset();
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
            Sign Up
          </Typography>
          {errorMsg && (
            <Typography variant="body2" color="error">
              {errorMsg}
            </Typography>
          )}
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

            <TextField
              fullWidth
              label="Password Confirmation"
              variant="outlined"
              margin="normal"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword?.message && (
              <Typography gutterBottom variant="body2" color="error">
                {errors.confirmPassword.message}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ my: 3 }}
              disabled={isSubmitting}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1">Already have an account?</Typography>
              <Typography variant="body2" color="primary">
                <Link href="/auth/signin">Sign In</Link>
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
