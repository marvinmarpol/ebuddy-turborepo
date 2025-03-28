'use client';

import { useEffect, useState } from 'react';
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Snackbar,
} from '@mui/material';
import { z } from 'zod';
import { SubmitHandler } from 'react-hook-form';

import ProtectedRoute from '../../components/protectedRoute';
import Navbar from '../../components/navbar';
import { getUserList } from '../../api/userListAPI';
import { useAuth } from '../../context/authProvider';
import { sortUsersByPotential, User, userSchema } from '@repo/entities';
import FloatingAddButton from '../../components/fab';
import AddDialogue from '../../components/addDialogue';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
  selectStatus,
  updateUserAsync,
} from '../../lib/features/user/userUpdateSlice';
import { getTotalPotential } from '@repo/helpers';
import UserCards from './(component)/userCards';

export default function Home() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [idToken, setIdToken] = useState('');

  const [fetching, setFetching] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('error occured');

  const [dialogue, setDialogue] = useState(false);

  type FormFields = z.infer<typeof userSchema>;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFetching(true);
        const token = (await user?.getIdToken(true)) || '';
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

  const handleAddUser: SubmitHandler<FormFields> = async (data) => {
    setFetching(true);
    try {
      const res = await dispatch(
        updateUserAsync({
          token: idToken,
          user: data,
        })
      );

      const payload = res.payload as User;
      data.id = payload.id;

      // recalculate total potential
      data.totalPotential = getTotalPotential(
        data.totalAverageWeightRatings,
        data.numberOfRents,
        data.recentlyActive
      );

      setUsers((prevUsers) =>
        sortUsersByPotential([...prevUsers, { ...data }])
      );
      setDialogue(false);

      setMessage('User added successfully');
      setIsSnackbarOpen(true);
    } catch (error) {
      setMessage('Failed to add new user');
      setIsSnackbarOpen(true);
    } finally {
      setFetching(false);
    }
  };

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
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <UserCards idToken={idToken} users={users} setUsers={setUsers} />
        </Box>

        <AddDialogue
          openDialogue={dialogue}
          onClose={onDialogueClose}
          onSubmit={handleAddUser}
        />

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
          color: 'primary',
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={fetching || status == 'loading'}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ProtectedRoute>
  );
}
