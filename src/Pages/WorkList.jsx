import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  TextField,
  List,
  ListItem,
  Modal,
  Fab,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Update as UpdateIcon,
  HistoryToggleOff as TimeIcon,
  EventNote as CalendarIcon,
  WarningAmberRounded as WarningIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db, auth } from "../Firebase";
import { useApp } from "../App";
import { getHourDifference } from "./Data";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 340,
  bgcolor: "background.paper",
  boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
  p: 4,
  borderRadius: "24px",
};

export default function WorkList() {
  const {
    selectedDate,
    JapanseHolidays,
    monthCache,
    setMonthCache,
    setGlobalMsg,
  } = useApp();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [y, m] = selectedDate.split("-");
  const monthKey = `${y}-${m}`;
  const todayShifts = monthCache[monthKey]?.[selectedDate] || {};
  const filteredHoliday = JapanseHolidays.filter(
    (i) => i.date === selectedDate
  );

  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [work, setWork] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [rest, setRest] = useState(dayjs());
  const [salary, setSalary] = useState(0);
  const [deleteInfo, setDeleteInfo] = useState({ date: "", name: "" });

  const updateItem = async () => {
    const ref = doc(db, "shifts", user.uid, "workshifts", selectedDate);
    const data = {
      start: startTime.format("HH:mm"),
      end: endTime.format("HH:mm"),
      rest: rest.format("HH:mm"),
      salary: salary,
    };

    await updateDoc(ref, { [work]: data });

    setMonthCache((prev) => ({
      ...prev,
      [monthKey]: {
        ...(prev[monthKey] || {}),
        [selectedDate]: {
          ...(prev[monthKey]?.[selectedDate] || {}),
          [work]: data,
        },
      },
    }));
  };

  const deleteItem = async (date, name) => {
    const [yy, mm] = date.split("-");
    const key = `${yy}-${mm}`;
    const ref = doc(db, "shifts", user.uid, "workshifts", date);

    await updateDoc(ref, { [name]: deleteField() });

    setMonthCache((prev) => {
      if (!prev[key]?.[date]) return prev;
      const newMonth = { ...prev[key] };
      const newDay = { ...newMonth[date] };
      delete newDay[name];
      if (Object.keys(newDay).length === 0) delete newMonth[date];
      else newMonth[date] = newDay;
      return { ...prev, [key]: newMonth };
    });
  };

  return (
    <Box
      sx={{
        width: { xs: "95%", sm: "450px", md: "400px" },
        maxHeight: { xs: "calc(100vh - 56px)", md: 650 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        mt: "70px",
        mx: "auto",
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
          <CircularProgress size={60} thickness={5} sx={{ color: "#1976D2" }} />
        </Box>
      )}

      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <CalendarIcon color="primary" /> {selectedDate}
        </Typography>
        {filteredHoliday.length > 0 && (
          <Typography
            variant="caption"
            sx={{ color: "#ff5252", fontWeight: "bold" }}
          >
            {filteredHoliday[0].localName}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 2,
          py: 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.keys(todayShifts).map((key) => {
            const item = todayShifts[key];
            return (
              <ListItem
                key={key}
                sx={{
                  bgcolor: "rgba(25, 118, 210, 0.05)",
                  border: "1px solid rgba(25, 118, 210, 0.1)",
                  borderRadius: "16px",
                  px: 2.5,
                  py: 1.5,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.12)" },
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteInfo({ date: selectedDate, name: key });
                      setDeleteModal(true);
                    }}
                    sx={{
                      color: "rgba(0,0,0,0.3)",
                      "&:hover": { color: "#ff5252" },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Box
                  sx={{ flexGrow: 1 }}
                  onClick={() => {
                    setWork(key);
                    setStartTime(
                      item.start ? dayjs(item.start, "HH:mm") : dayjs()
                    );
                    setEndTime(item.end ? dayjs(item.end, "HH:mm") : dayjs());
                    setRest(
                      dayjs(item.rest, "HH:mm")
                    );
                    setSalary(Number(item.salary || 0));
                    setUpdateModal(true);
                  }}
                >
                  <Typography fontWeight="700" sx={{ color: "#1a237e" }}>
                    {key}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#1976D2",
                      fontWeight: 600,
                    }}
                  >
                    <TimeIcon sx={{ fontSize: 16 }} /> {item.start} - {item.end}
                    <Box component="span" sx={{ ml: 1, opacity: 0.6 }}>
                      ({getHourDifference(item.start, item.end, item.rest)})
                    </Box>
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          boxShadow: "0 8px 16px rgba(25,118,210,0.4)",
        }}
        onClick={() => navigate("/home/worklist/addwork")}
      >
        <AddIcon />
      </Fab>

      <Modal open={updateModal} onClose={() => setUpdateModal(false)}>
        <Box sx={modalStyle}>
          <Typography
            variant="h6"
            fontWeight="800"
            mb={3}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <UpdateIcon color="primary" /> Edit Shift
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Workplace"
              value={work}
              fullWidth
              variant="filled"
              InputProps={{ readOnly: true }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TimePicker
                  label="Start"
                  value={startTime}
                  onChange={(v) => setStartTime(v)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <TimePicker
                  label="End"
                  value={endTime}
                  onChange={(v) => setEndTime(v)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
              <TimePicker
                label="Rest"
                ampm={false}
                views={["hours", "minutes"]}
                format="HH:mm"
                value={rest}
                onChange={(v) => {
                  setRest(v);
                }}
                minTime={dayjs().startOf("day")}
                maxTime={dayjs().startOf("day").add(5, "hour")}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
              <Button
                fullWidth
                variant="text"
                onClick={() => setUpdateModal(false)}
                sx={{ color: "text.secondary" }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await updateItem();
                    setGlobalMsg("Updated Successfully");
                    setUpdateModal(false);
                  } finally {
                    setLoading(false);
                  }
                }}
                sx={{ borderRadius: "12px", fontWeight: "bold" }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
        <Box sx={{ ...modalStyle, textAlign: "center" }}>
          <WarningIcon sx={{ fontSize: 50, color: "#ff5252", mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Remove Shift?
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            Are you sure you want to delete <b>{deleteInfo.name}</b> on{" "}
            {deleteInfo.date}?
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setDeleteModal(false)}
              sx={{ borderRadius: "12px" }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={async () => {
                setLoading(true);
                try {
                  await deleteItem(deleteInfo.date, deleteInfo.name);
                  setGlobalMsg("Deleted Successfully");
                  setDeleteModal(false);
                } finally {
                  setLoading(false);
                }
              }}
              sx={{ borderRadius: "12px", fontWeight: "bold" }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
