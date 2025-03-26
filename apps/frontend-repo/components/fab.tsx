import { Box, Fab, Typography } from "@mui/material";

interface props {
  onClick: () => void;
}

export default function FloatingAddButton({ onClick }: props) {
  return (
    <Box position={"absolute"} right={30} bottom={30}>
      <Fab color="primary" aria-label="add" onClick={onClick}>
        <Typography variant="h5">+</Typography>
      </Fab>
    </Box>
  );
}
