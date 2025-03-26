'use client';

import { UpdateButton } from '@repo/ui/button';

import {
  selectStatus,
  updateUserAsync,
} from '../lib/features/user/userUpdateSlice';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { UpdateUserPayload } from '../lib/features/user/userUpdateAPI';
import ProtectedRoute from '../components/protectedRoute';

export default function Home() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const userValue: UpdateUserPayload = {
    id: 'iQWqAB5p6a8dUeDmhoFMO',
    token: '',
    user: {
      name: 'string',
      email: '',
      age: 0,
      address: '',
      numberOfRents: 0,
      recentlyActive: 0,
      totalAverageWeightRatings: 0,
      totalPotential: 0,
    },
  };

  return (
    <ProtectedRoute>
      <UpdateButton
        onclick={() => dispatch(updateUserAsync(userValue))}
        disabled={status == 'loading'}
      >
        Update
      </UpdateButton>
    </ProtectedRoute>
  );
}
