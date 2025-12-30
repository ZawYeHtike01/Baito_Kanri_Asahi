import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import {
  AddBusinessRounded as WorkIcon,
  TimerOutlined as TimeIcon,
  RestartAltRounded as ClearIcon,
  ArrowBackIosNewRounded as BackIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../Firebase";
import { useApp } from "../App";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "24px",
  boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
  p: 4,
  width: 320,
};

export default function AddWork() {
  const navigate = useNavigate();
  const workNameRef = useRef();
  const salaryRef = useRef();

  const { selectedDate, setMonthCache, workname, setWorkName, setGlobalMsg } =
    useApp();

  const [work, setWork] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [rest, setRest] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({ work: false, start: false, end: false });

  const workAdd = async () => {
    if (!workNameRef.current.value || !salaryRef.current.value) {
      setGlobalMsg("Please fill all fields");
      return;
    }
    const user = auth.currentUser;
    setLoading(true);
    try {
      const worksRef = doc(
        db,
        "worksname",
        user.uid,
        "works",
        workNameRef.current.value
      );
      await setDoc(worksRef, { salary: Number(salaryRef.current.value) });

      setWorkName((prev) => [
        ...prev,
        {
          work: workNameRef.current.value,
          salary: Number(salaryRef.current.value),
        },
      ]);

      setGlobalMsg("New Workspace Added");
      setOpenModal(false);
      setWork(workNameRef.current.value);
    } catch (e) {
      setGlobalMsg("Error adding workspace");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    const newError = { work: !work, start: !startTime, end: !endTime };
    setError(newError);
    if (Object.values(newError).some(Boolean)) {
      setGlobalMsg("Please Fill All Fields");
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      const workShiftRef = doc(
        db,
        "shifts",
        user.uid,
        "workshifts",
        selectedDate
      );
      const docSnap = await getDoc(workShiftRef);

      let shift = docSnap.exists() ? docSnap.data() : {};
      let uniqueName = work;
      let count = 1;
      while (shift[uniqueName]) {
        uniqueName = `${work}_${count++}`;
      }

      const workInfo = workname.find((i) => i.work === work);
      shift[uniqueName] = {
        start: startTime.format("HH:mm"),
        end: endTime.format("HH:mm"),
        rest: rest.hour() * 60 + rest.minute(),
        salary: workInfo.salary,
      };

      await setDoc(workShiftRef, shift, { merge: true });

      setMonthCache((prev) => {
        const [y, m] = selectedDate.split("-");
        const key = `${y}-${m}`;
        return {
          ...prev,
          [key]: { ...(prev[key] || {}), [selectedDate]: shift },
        };
      });

      setGlobalMsg("Shift Saved Successfully");
      navigate("/home");
    } catch (e) {
      setGlobalMsg("Error saving shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: { xs: "95%", sm: "450px", md: "400px" },
          height: 540,
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          borderRadius: "28px",
          display: "flex",
          flexDirection: "column",
          mt: "70px",
          mx: "auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(8px)",
              bgcolor: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <CircularProgress size={60} thickness={5} />
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="800"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Add Shift
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 4 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Recording shift for: <b>{selectedDate}</b>
          </Typography>

          <FormControl>
            <InputLabel>work</InputLabel>
            <Select
              error={error.work}
              value={work}
              label="Work"
              onChange={(e) => {
                if (e.target.value === "others") setOpenModal(true);
                else setWork(e.target.value);
              }}
              sx={{ borderRadius: "12px" }}
            >
              {workname.map((e) => (
                <MenuItem key={e.id || e.work} value={e.work}>
                  {e.work}
                </MenuItem>
              ))}
              <MenuItem
                value="others"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                + Add New Place
              </MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(v) => setStartTime(v)}
              slotProps={{
                textField: { fullWidth: true, variant: "outlined" },
              }}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(v) => setEndTime(v)}
              slotProps={{
                textField: { fullWidth: true, variant: "outlined" },
              }}
            />
          </Box>

          <TimePicker
            label="Rest (minutes)"
            views={["minutes"]}
            value={rest}
            onChange={(v) => setRest(v)}
            slotProps={{ textField: { fullWidth: true } }}
          />

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}
          >
            <Button
              onClick={addItem}
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: "14px",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 8px 20px rgba(25,118,210,0.3)",
              }}
            >
              Save Shift
            </Button>
            <Button
              onClick={() => {
                setWork("");
                setStartTime(null);
                setEndTime(null);
                setRest(null);
              }}
              variant="text"
              startIcon={<ClearIcon />}
              fullWidth
              sx={{ color: "text.secondary" }}
            >
              Reset Form
            </Button>
          </Box>
        </Box>


        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setWork("");
          }}
        >
          <Box sx={modalStyle}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <WorkIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" fontWeight="bold">
                New Workplace
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                inputRef={workNameRef}
                label="Company Name"
                variant="outlined"
                fullWidth
                autoFocus
              />
              <TextField
                inputRef={salaryRef}
                type="number"
                label="Hourly Rate (¥)"
                variant="outlined"
                fullWidth
              />
              <Button
                onClick={workAdd}
                variant="contained"
                fullWidth
                sx={{ borderRadius: "12px", py: 1.5 }}
              >
                Add to List
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
}
