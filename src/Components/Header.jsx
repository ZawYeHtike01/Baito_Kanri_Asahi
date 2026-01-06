import { AppBar, Toolbar, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useApp } from "../App";
import logo from "../assets/logo.png";

export default function Header() {
  const { setShowDrawer } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isStudentDayData =
  location.pathname.startsWith("/shiftdata/") || location.pathname.startsWith("/home/worklist") || location.pathname.startsWith("/student/");
  return (
    <AppBar>
      <Toolbar>
        {isStudentDayData  ? (
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
          >
            <BackIcon></BackIcon>
          </IconButton>
        ) : (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setShowDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box component="img" src={logo} alt="Logo" sx={{ width: 50 }} />
        <Typography sx={{ flexGrow: 1, ml: 2 }}>Baito_Kanri_Asahi</Typography>
      </Toolbar>
    </AppBar>
  );
}
