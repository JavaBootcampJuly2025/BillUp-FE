import { SxProps } from "@mui/material";

export const LinkStyles: SxProps = {
    color: "#fff",
    textDecoration: "none",
    textTransform: "none",
    position: "relative",
    marginLeft: "1rem",
    fontSize: "1rem",
    "&::after": {
        content: "''",
        position: "absolute",
        left: 0,
        bottom: 0,
        height: "2px",
        width: "0%",
        backgroundColor: "#fff",
        transition: "width 0.3s ease-in-out",
    },
    "&:hover::after": {
        width: "100%",
    },
};

export const CompanyNameStyles: SxProps = {
    color: "#fff",
    textDecoration: "none",
    textTransform: "none",
    fontWeight: 500,
    fontSize: "1.2rem",
};
