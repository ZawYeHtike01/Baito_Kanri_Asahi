import { Box, Grid, Card, CardActionArea, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TimerIcon from "@mui/icons-material/Timer";
import EventBusyIcon from "@mui/icons-material/EventBusy";

const pages = [
  {
    title: "Students",
    desc: "Manage student data",
    icon: <SchoolIcon fontSize="large" />,
    path: "/student",
  },
  {
    title: "Courses",
    desc: "Year & course management",
    icon: <ClassIcon fontSize="large" />,
    path: "/course",
  },
  {
    title: "Shifts",
    desc: "Student shift schedules",
    icon: <ScheduleIcon fontSize="large" />,
    path: "/shiftdata",
  },
  {
    title: "Weekly Limits",
    desc: "Work hour limits",
    icon: <TimerIcon fontSize="large" />,
    path: "/checklimit",
  },
];

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mt: { xs: "55px", md: "70px" },
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={3} color="#000000ff">
        Admin Dashboard
      </Typography>

      <Grid container spacing={2}>
        {pages.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.title}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <CardActionArea
                onClick={() => navigate(p.path)}
                sx={{
                  p: 3,
                  height: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#000000ff",
                  transition: "0.3s",
                  "&:hover": {
                    background: "rgba(255,255,255,0.15)",
                  },
                }}
              >
                {p.icon}
                <Typography fontWeight={700} mt={1}>
                  {p.title}
                </Typography>
                <Typography variant="body2" color="gray">
                  {p.desc}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
