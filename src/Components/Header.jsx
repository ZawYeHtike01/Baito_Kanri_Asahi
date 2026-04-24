import { AppBar, Toolbar, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useApp } from "../App";
import logo from "../assets/logo.png";

export default function Header() {
  const { setShowDrawer, workname, work, setWork } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isShift = location.pathname.startsWith("/shiftdata");
  const isStudent = location.pathname.startsWith("/student");
  const isCourse = location.pathname.startsWith("/course");
  const isLimit = location.pathname.startsWith("/checklimit");
  const isStudentDayData =
    location.pathname.startsWith("/shiftdata/") ||
    location.pathname.startsWith("/home/worklist") ||
    location.pathname.startsWith("/student/");
  return (
    <AppBar>
      <Toolbar>
        {isStudentDayData ? (
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
        <Typography sx={{ flexGrow: 1, ml: 2 }}>
          {isShift
            ? "Student's Shift Data"
            : isStudent
              ? "Student's Data"
              : isCourse
                ? "Course"
                : isLimit
                  ? "Weekly Limit"
                  : "Baito Kanri"}
        </Typography>
        {location.pathname==="/home" && (<Box sx={{ minWidth: 100 }}>
          <FormControl fullWidth>
            {/* <InputLabel sx={{color:'white'}} id="demo-simple-select-label">Work</InputLabel> */}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Work"
              onChange={(e)=>{setWork(e.target.value)}}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                color:"white"
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {workname.map((e)=>(
                <MenuItem key={e.id || e.work} value={e.work}>
                  {e.work}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>)}
        
      </Toolbar>
    </AppBar>
  );
}
