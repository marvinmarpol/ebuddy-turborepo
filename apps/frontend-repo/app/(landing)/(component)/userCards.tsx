'use client';

import { useEffect, useState } from 'react';
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
  Rating,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getTotalPotential } from '@repo/helpers';
import { UpdateButton } from '@repo/ui/button';
import { sortUsersByPotential, User, userSchema } from '@repo/entities';
import {
  selectStatus,
  updateUserAsync,
} from '../../../lib/features/user/userUpdateSlice';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';

interface props {
  idToken: string;
  users: User[];
  setUsers: (users: User[]) => void;
}

export default function UserCards({ idToken, users, setUsers }: props) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('error occured');

  type FormFields = z.infer<typeof userSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      id: '',
      name: '',
      email: '',
      address: '',
      numberOfRents: 0,
      totalAverageWeightRatings: 0.0,
    },
    resolver: zodResolver(userSchema),
  });

  const handleExpandClick = (index: number, user: User) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);

    if (expandedIndex !== index) {
      setValue('id', user.id);
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('age', user.age || 0);
      setValue('numberOfRents', user.numberOfRents || 0);
      setValue(
        'totalAverageWeightRatings',
        user.totalAverageWeightRatings || 0
      );
      setValue('address', user.address || '');
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const userIndex = expandedIndex;
      if (userIndex === null) {
        return;
      }

      // recalculate total potential
      data.totalPotential = getTotalPotential(
        data.totalAverageWeightRatings,
        data.numberOfRents,
        data.recentlyActive
      );

      // Clone and update the specific user
      const updatedUsers = [...users];
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...data };

      // Update user data to the API
      await dispatch(
        updateUserAsync({
          token: idToken,
          user: updatedUsers[userIndex],
        })
      );

      // Update local state
      setUsers(sortUsersByPotential(updatedUsers));

      setMessage('User updated successfully');
      setIsSnackbarOpen(true);
    } catch (error: any) {
      setMessage('Error updating user');
      setIsSnackbarOpen(true);
    } finally {
      setExpandedIndex(null);
    }
  };

  return (
    <>
      {users?.map((item, index) => (
        <Card
          key={index}
          sx={{ width: 255, my: 3, mx: 2, alignSelf: 'flex-start' }}
        >
          <CardHeader
            avatar={<Avatar>{item.name && item.name[0].toUpperCase()}</Avatar>}
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
            <Button onClick={() => handleExpandClick(index, item)} size="small">
              {expandedIndex === index ? 'Show Less' : 'Show More'}
            </Button>
          </CardActions>
          <Collapse in={expandedIndex === index} timeout={'auto'} unmountOnExit>
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
                  {...register('email')}
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
                  {...register('name')}
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
                  {...register('age', { valueAsNumber: true })}
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
                  {...register('numberOfRents', { valueAsNumber: true })}
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
                  {...register('totalAverageWeightRatings', {
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
                  {...register('address')}
                />
                {errors.address && (
                  <Typography gutterBottom variant="body2" color="error">
                    {errors.address.message}
                  </Typography>
                )}

                <UpdateButton disabled={status == 'loading'}>
                  Update
                </UpdateButton>
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      ))}

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => {
          setIsSnackbarOpen(false);
        }}
        message={message}
      />

      <Backdrop
        sx={(theme) => ({
          color: 'primary',
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={isSubmitting || status == 'loading'}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
