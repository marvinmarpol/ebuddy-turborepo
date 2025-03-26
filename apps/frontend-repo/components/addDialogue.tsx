import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { User, userSchema } from "@repo/entities";
import { useEffect } from "react";
import { UpdateButton } from "@repo/ui/button";
import {
  selectStatus,
  updateUserAsync,
} from "../lib/features/user/userUpdateSlice";
import { useAppDispatch, useAppSelector } from "../lib/hooks";

interface props {
  token: string;
  user?: User;
  openDialogue: boolean;
  onClose: () => void;
}

export default function AddDialogue({
  token,
  user,
  openDialogue,
  onClose,
}: props) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

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
      name: "",
      email: "",
      address: "",
      numberOfRents: 0,
      totalAverageWeightRatings: 0.0,
    },
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      setValue("id", user?.id);
      setValue("name", user?.name);
      setValue("email", user?.email);
      setValue("age", user?.age);
      setValue("address", user?.address);
      setValue("numberOfRents", user?.numberOfRents);
      setValue("totalAverageWeightRatings", user?.totalAverageWeightRatings);
    }
  }, [user]);

  const resetAndClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      dispatch(
        updateUserAsync({
          id: data.id || "",
          token,
          user: {
            name: data.name,
            email: data.email,
            age: data.age,
            address: data.address,
            numberOfRents: data.numberOfRents,
            totalAverageWeightRatings: data.totalAverageWeightRatings,
          },
        })
      );
    } catch (error: any) {
    } finally {
      onClose();
    }
  };

  return (
    <Dialog
      open={openDialogue}
      onClose={resetAndClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        },
      }}
    >
      <DialogContent>
        <TextField
          fullWidth
          label="ID"
          variant="outlined"
          margin="normal"
          autoComplete="off"
          disabled
          {...register("id")}
        />
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
          {...register("totalAverageWeightRatings", { valueAsNumber: true })}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={resetAndClose}>Cancel</Button>
        <UpdateButton disabled={status == "loading"}>Update</UpdateButton>
      </DialogActions>
    </Dialog>
  );
}
