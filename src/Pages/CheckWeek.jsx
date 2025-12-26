import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import dayjs from "dayjs";
import { useApp } from "../App";
import { getHourDifference } from "./Data";

export default function CheckWeek() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [time, setTime] = useState("0.0 hours");
  const [sal, setSal] = useState("0 ￥");

  const { monthCache } = useApp();

  const check = () => {
    if (!start || !end || start.isAfter(end)) return;

    let totalMinutes = 0;
    let totalSalary = 0;
    let current = dayjs(start);

    while (current.isSame(end) || current.isBefore(end)) {
      const monthKey = current.format("YYYY-MM");
      const dateKey = current.format("YYYY-MM-DD");

      const dayData = monthCache?.[monthKey]?.[dateKey];
      if (dayData) {
        Object.values(dayData).forEach((job) => {
          if (!job.start || !job.end) return;

          const minutes = getHourDifference(
            job.start,
            job.end,
            job.rest
          );

          totalMinutes += minutes;
          totalSalary += minutes * job.salary;
        });
      }

      current = current.add(1, "day");
    }

    setTime(`${(totalMinutes).toFixed(1)} hours`);
    setSal(`${Math.round(totalSalary).toLocaleString()} ￥`);
  };

  const clear = () => {
    setStart(null);
    setEnd(null);
    setTime("0.0 hours");
    setSal("0 ￥");
  };

  return (
    <Box
      sx={{
        width: { xs: "92%", sm: "55%", md: "360px" },
        height: 420,
        mt: "80px",
        p: 3,
        borderRadius: 4,
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" textAlign="center" fontWeight="bold">
        Check Your Work Time
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <DatePicker
            label="From"
            value={start}
            onChange={setStart}
          />
          <DatePicker
            label="To"
            value={end}
            onChange={setEnd}
          />
        </Box>
      </LocalizationProvider>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!start || !end || start.isAfter(end)}
          onClick={check}
        >
          Check
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={clear}
        >
          Clear
        </Button>
      </Box>
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          background: "rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="gray">
          Total Hours
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {time}
        </Typography>

        <Typography variant="body2" color="gray">
          Total Salary
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {sal}
        </Typography>
      </Box>
    </Box>
  );
}
