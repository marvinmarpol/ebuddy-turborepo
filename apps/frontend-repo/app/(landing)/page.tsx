"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  Container,
  Rating,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProtectedRoute from "../../components/protectedRoute";
import Navbar from "../../components/navbar";
import { getUserList } from "../../api/userListAPI";
import { useAuth } from "../../context/authProvider";
import { User, userSchema } from "@repo/entities";
import FloatingAddButton from "../../components/fab";
import AddDialogue from "../../components/addDialogue";
import { UpdateButton } from "@repo/ui/button";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import {
  selectStatus,
  updateUserAsync,
} from "../../lib/features/user/userUpdateSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [users, setUsers] = useState<User[]>([]);
  const { user, loading } = useAuth();
  const [idToken, setIdToken] = useState("");

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [fetching, setFetching] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("error occured");

  const [dialogue, setDialogue] = useState(false);

  type FormFields = z.infer<typeof userSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      address: "",
      numberOfRents: 0,
      totalAverageWeightRatings: 0.0,
    },
    resolver: zodResolver(userSchema),
  });

  const handleExpandClick = (index: number, user: User) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);

    if (expandedIndex !== index) {
      setValue("id", user.id);
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("age", user.age || 0);
      setValue("numberOfRents", user.numberOfRents || 0);
      setValue(
        "totalAverageWeightRatings",
        user.totalAverageWeightRatings || 0
      );
      setValue("address", user.address || "");
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const userIndex = expandedIndex;
      if (userIndex === null) {
        return;
      }

      // Clone and update the specific user
      const updatedUsers = [...users];
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...data };

      // Update local state
      setUsers(updatedUsers);

      // Update user data to the API
      const res = await dispatch(
        updateUserAsync({
          token: idToken,
          user: updatedUsers[userIndex],
        })
      );

      setMessage("User updated successfully");
      setIsSnackbarOpen(true);
    } catch (error: any) {
      setMessage("Error updating user");
      setIsSnackbarOpen(true);
    }
  };

  const handleAddUser: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await dispatch(
        updateUserAsync({
          token: idToken,
          user: data,
        })
      );

      const payload = res.payload as User;
      data.id = payload.id;
      setUsers((prevUsers) => [...prevUsers, { ...data }]);
      setDialogue(false);

      setMessage("User added successfully");
      setIsSnackbarOpen(true);
    } catch (error) {
      setMessage("Failed to add new user");
      setIsSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFetching(true);
        const token = (await user?.getIdToken(true)) || "";
        setIdToken(token);
        const userList = await getUserList({ token });
        setUsers(userList.data);
        setFetching(false);
      } catch (error: any) {
        setIsSnackbarOpen(true);
        setMessage(error.message as string);
      } finally {
        setFetching(false);
      }
    };

    if (!loading && user) {
      fetchUsers();
    }
  }, [user, loading]);

  const onFabClick = () => {
    setDialogue(true);
  };

  const onDialogueClose = () => {
    setDialogue(false);
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <Container maxWidth="xl">
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {users?.map((item, index) => (
            <Card
              key={index}
              sx={{ width: 255, my: 3, mx: 2, alignSelf: "flex-start" }}
            >
              <CardHeader
                avatar={
                  <Avatar>{item.name && item.name[0].toUpperCase()}</Avatar>
                }
                title={item.name}
                subheader={item.email}
              />
              <CardContent>
                <Rating
                  value={item.totalAverageWeightRatings || 0}
                  precision={0.01}
                  readOnly
                />
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleExpandClick(index, item)}
                  size="small"
                >
                  {expandedIndex === index ? "Show Less" : "Show More"}
                </Button>
              </CardActions>
              <Collapse
                in={expandedIndex === index}
                timeout={"auto"}
                unmountOnExit
              >
                <CardContent>
                  <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                      ID: {item.id}
                    </Typography>
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
                      label="Name"
                      variant="outlined"
                      margin="normal"
                      autoComplete="off"
                      {...register("name")}
                    />
                    {errors.name && (
                      <Typography gutterBottom variant="body2" color="error">
                        {errors.name.message}
                      </Typography>
                    )}

                    <TextField
                      fullWidth
                      label="Age"
                      variant="outlined"
                      margin="normal"
                      autoComplete="off"
                      type="number"
                      {...register("age", { valueAsNumber: true })}
                    />
                    {errors.age && (
                      <Typography gutterBottom variant="body2" color="error">
                        {errors.age.message}
                      </Typography>
                    )}

                    <TextField
                      fullWidth
                      label="Number of rents"
                      variant="outlined"
                      margin="normal"
                      autoComplete="off"
                      {...register("numberOfRents", { valueAsNumber: true })}
                    />
                    {errors.numberOfRents && (
                      <Typography gutterBottom variant="body2" color="error">
                        {errors.numberOfRents.message}
                      </Typography>
                    )}

                    <TextField
                      fullWidth
                      label="Rating"
                      variant="outlined"
                      margin="normal"
                      autoComplete="off"
                      {...register("totalAverageWeightRatings", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.totalAverageWeightRatings && (
                      <Typography gutterBottom variant="body2" color="error">
                        {errors.totalAverageWeightRatings.message}
                      </Typography>
                    )}

                    <TextField
                      fullWidth
                      label="Address"
                      variant="outlined"
                      margin="normal"
                      autoComplete="off"
                      multiline
                      rows={4}
                      {...register("address")}
                    />
                    {errors.address && (
                      <Typography gutterBottom variant="body2" color="error">
                        {errors.address.message}
                      </Typography>
                    )}

                    <UpdateButton disabled={status == "loading"}>
                      Update
                    </UpdateButton>
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          ))}
        </Box>

        {users && (
          <AddDialogue
            openDialogue={dialogue}
            onClose={onDialogueClose}
            onSubmit={handleAddUser}
          />
        )}

        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={6000}
          onClose={() => {
            setIsSnackbarOpen(false);
          }}
          message={message}
        />

        <FloatingAddButton onClick={onFabClick} />
      </Container>
      <Backdrop
        sx={(theme) => ({
          color: "primary",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={fetching || isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ProtectedRoute>
  );
}
