import { Box, Button,TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { useState } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

export default function AddWork() {
  const [work, setWork] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [rest, setRest] = useState(dayjs().hour(0).minute(0));
  const [openModal, setOpenModal] = useState(false);
   
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: { xs: "90%", sm: "50%", md: "27%" },
          height: 440,
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "70px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 4,
            width: "80%",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="work-label">Work</InputLabel>
            <Select
              labelId="work-label"
              value={work}
              label="Work"
              onChange={(e) => {setWork(e.target.value)
                if(e.target.value === "others"){
                    setOpenModal(true);
                }   
            }
              }
            >
              <MenuItem value="morning">Morning Shift</MenuItem>
              <MenuItem value="evening">Evening Shift</MenuItem>
              <MenuItem value="others">others</MenuItem>
            </Select>
          </FormControl>

          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
          />

          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
          />

          <TimePicker
            label="Rest (minutes)"
            views={["minutes"]}
            value={rest}
            onChange={(newValue) => setRest(newValue)}
          />

          <Button variant="contained" fullWidth>
            Add Work
          </Button>

          <Button variant="outlined" fullWidth>
            Clear
          </Button>
        </Box>

        <Modal
          open={openModal}
          onClose={() => {setOpenModal(false) 
            setWork("")}}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              width: 300,
            }}
          >
            <Typography variant="h6">
              Add New Work
            </Typography>
            <TextField sx={{mt:3}} id="outlined-basic" label="Name" variant="outlined" fullWidth/>
            <TextField type="number" sx={{mt:3}} id="outlined-basic" label="Salary" variant="outlined" fullWidth/>
            <Button sx={{mt:3}} type="submit" variant="contained"fullWidth>Add</Button>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
}
