import { SxProps } from "@mui/material";

export const HomePageContainerStyles: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  backgroundColor: "white",
  color: "black",
  textAlign: "center",
  fontSize: "18px",
  padding: "20px",
};

export const MainTextStyles: SxProps = {
  fontWeight: "bold",
  letterSpacing: "2px",
  marginBottom: "10px",
  fontSize: "36px",
  textTransform: "uppercase",
  color: "black",
};

export const SubTextStyles: SxProps = {
  marginBottom: "20px",
  fontSize: "18px",
  maxWidth: "600px",
};

export const LoginPageButtonStyles: SxProps = {
  backgroundColor: "#000",
  color: "white",
  "&:hover": {
    backgroundColor: "#333",
  },
  marginBottom: "15px",
  padding: "10px 30px",
  textTransform: "none",
};
