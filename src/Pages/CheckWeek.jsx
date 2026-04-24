import { Box, Typography, Button } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import dayjs from "dayjs";
import { useApp } from "../App";
import { getHourDifference } from "./Data";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function CheckWeek() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [time, setTime] = useState("0.0 hours");
  const [sal, setSal] = useState("0 ￥");
  const [www, setWww] = useState("all");

  const { monthCache, workname } = useApp();

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
        const jobs = www === "all" ? Object.values(dayData) : [dayData?.[www]];
        jobs.forEach((job) => {
          if (!job?.start || !job?.end) return;

          const hours = getHourDifference(job.start, job.end, job.rest);

          totalMinutes += hours;
          totalSalary += hours * job.salary;
        });
      }

      current = current.add(1, "day");
    }

    setTime(`${totalMinutes.toFixed(1)} hours`);
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
        maxHeight: { xs: "calc(100vh - 56px)", md: 650 },
        mt: "80px",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <Typography variant="h6" textAlign="center" fontWeight="bold">
        Check Your Work Time
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <DatePicker label="From" value={start} onChange={setStart} />
          <DatePicker label="To" value={end} onChange={setEnd} />
          <Box sx={{ minWidth: 100 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Work</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Work"
                onChange={(e) => {
                  setWww(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                {workname.map((e) => (
                  <MenuItem key={e.id || e.work} value={e.work}>
                    {e.work}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
        <Button variant="outlined" fullWidth onClick={clear}>
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
