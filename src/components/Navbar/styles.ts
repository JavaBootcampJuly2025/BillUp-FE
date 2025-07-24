import {SxProps} from "@mui/material";

export const LinkStyles: SxProps = {
    color: "#000",
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
        backgroundColor: "#000",
        transition: "width 0.3s ease-in-out",
    },
    "&:hover::after": {
        width: "100%",
    },
};