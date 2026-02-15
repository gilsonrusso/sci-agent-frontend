import { Box, Typography } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <Typography variant="h2" component="h1">
        SciAgent OS
      </Typography>
      <Typography variant="subtitle1">Frontend Environment Ready</Typography>
    </Box>
  );
}

export default App;
