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
  Container,
  Rating,
} from "@mui/material";

import { UpdateButton } from "@repo/ui/button";
import {
  selectStatus,
  updateUserAsync,
} from "../../lib/features/user/userUpdateSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { UpdateUserPayload } from "../../lib/features/user/userUpdateAPI";
import ProtectedRoute from "../../components/protectedRoute";
import Navbar from "../../components/navbar";
import { getUserList } from "../../api/userListAPI";
import { useAuth } from "../../context/authProvider";
import { User } from "@repo/entities";
import FloatingAddButton from "../../components/fab";
import AddDialogue from "../../components/addDialogue";

export default function Home() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [fetching, setFetching] = useState(false);
  const [idToken, setIdToken] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const { user, loading } = useAuth();

  const [dialogue, setDialogue] = useState(false);
  const [modifyUser, setModifyUser] = useState<User | undefined>();

  const userValue: UpdateUserPayload = {
    id: "iQWqAB5p6a8dUeDmhoFMO",
    token: "",
    user: {
      name: "string",
      email: "",
      age: 0,
      address: "",
      numberOfRents: 0,
      recentlyActive: 0,
      totalAverageWeightRatings: 0,
      totalPotential: 0,
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setFetching(true);
      const token = (await user?.getIdToken(true)) || "";
      setIdToken(token);
      const userList = await getUserList({ token });
      setUsers(userList.data);
      setFetching(false);
    };

    if (!loading && user) {
      fetchUsers();
    }
  }, [user, loading]);

  const onFabClick = () => {
    setDialogue(true);
  };

  const onDialogueClose = () => {
    setModifyUser(undefined);
    setDialogue(false);
  };

  const onCardClick = (item: User) => {
    setModifyUser(item);
    setDialogue(true);
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <Container maxWidth="xl">
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {users?.map((item, index) => (
            <Card key={index} sx={{ width: 255, my: 3, mx: 2 }}>
              <CardHeader
                avatar={
                  <Avatar>{item.name && item.name[0].toUpperCase()}</Avatar>
                }
                title={item.name}
                subheader={item.email}
              />
              <CardContent>
                <Rating
                  defaultValue={item.totalAverageWeightRatings}
                  precision={0.01}
                  readOnly
                />
              </CardContent>
              <CardActions>
                <Button onClick={() => onCardClick(item)} size="small">
                  Show More
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        <UpdateButton
          onclick={() => dispatch(updateUserAsync(userValue))}
          disabled={status == "loading"}
        >
          Update
        </UpdateButton>

        {users && (
          <AddDialogue
            token={idToken}
            user={modifyUser}
            openDialogue={dialogue}
            onClose={onDialogueClose}
          />
        )}

        <FloatingAddButton onClick={onFabClick} />
      </Container>
      <Backdrop
        sx={(theme) => ({
          bgcolor: "transparent",
          color: "primary",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={fetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ProtectedRoute>
  );
}
