import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { User, userSchema } from "@repo/entities";
import { UpdateButton } from "@repo/ui/button";

interface props {
  openDialogue: boolean;
  onClose: () => void;
  onSubmit: (data: User) => void;
}

export default function AddDialogue({
  openDialogue,
  onClose,
  onSubmit,
}: props) {
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

  const resetAndClose = () => {
    reset();
    onClose();
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
        <UpdateButton disabled={isSubmitting}>Submit</UpdateButton>
      </DialogActions>
    </Dialog>
  );
}
