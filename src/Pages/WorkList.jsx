import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db, auth } from "../Firebase";
import { useApp } from "../App";
import { getHourDifference } from "./Data";
import Modal from "@mui/material/Modal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

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
  const [rest, setRest] = useState(dayjs().hour(0).minute(0));
  const [salary, setSalary] = useState(0);

  const [deleteInfo, setDeleteInfo] = useState({
    date: "",
    name: "",
  });

  const updateItem = async () => {
    const ref = doc(db, "shifts", user.uid, "workshifts", selectedDate);

    await updateDoc(ref, {
      [work]: {
        start: startTime.format("HH:mm"),
        end: endTime.format("HH:mm"),
        rest: rest.minute(),
        salary: salary,
      },
    });

    setMonthCache((prev) => ({
      ...prev,
      [monthKey]: {
        ...(prev[monthKey] || {}),
        [selectedDate]: {
          ...(prev[monthKey]?.[selectedDate] || {}),
          [work]: {
            start: startTime.format("HH:mm"),
            end: endTime.format("HH:mm"),
            rest: rest.minute(),
            salary: salary,
          },
        },
      },
    }));
  };

  const deleteItem = async (date, name) => {
    const [yy, mm] = date.split("-");
    const key = `${yy}-${mm}`;
    const ref = doc(db, "shifts", user.uid, "workshifts", date);

    await updateDoc(ref, {
      [name]: deleteField(),
    });

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
        width: { xs: "90%", sm: "50%", md: "30%" },
        height: 600,
        position: "relative",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: "70px",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backdropFilter: "blur(6px)",
            bgcolor: "rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <CircularProgress size={70} />
        </Box>
      )}

      <Typography mt={2}>{selectedDate}</Typography>
      <Typography>
        {filteredHoliday.length ? filteredHoliday[0].localName : ""}
      </Typography>

      <Box sx={{ width: "90%", overflow: "auto" }}>
        <List
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          {Object.keys(todayShifts).map((key) => {
            const item = todayShifts[key];
            return (
              <ListItem
                key={key}
                sx={{
                  bgcolor: "#1976D2",
                  color: "#fff",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{ flexGrow: 1, cursor: "pointer" }}
                  onClick={() => {
                    setWork(key);
                    setStartTime(
                      item.start ? dayjs(item.start, "HH:mm") : dayjs()
                    );
                    setEndTime(item.end ? dayjs(item.end, "HH:mm") : dayjs());
                    setRest(
                      dayjs()
                        .hour(0)
                        .minute(item.rest || 0)
                    );
                    setSalary(Number(item.salary || 0));
                    setUpdateModal(true);
                  }}
                >
                  <Typography fontWeight={600}>{key}</Typography>
                  <Typography fontSize={13}>
                    {item.start}-{item.end} (
                    {getHourDifference(item.start, item.end, item.rest)})
                  </Typography>
                </Box>

                <IconButton
                  sx={{ color: "#fff" }}
                  onClick={() => {
                    setDeleteInfo({ date: selectedDate, name: key });
                    setDeleteModal(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <IconButton
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          bgcolor: "primary.main",
          color: "#fff",
          "&:hover": { bgcolor: "primary.dark" },
        }}
        onClick={() => navigate("/home/worklist/addwork")}
      >
        <AddIcon />
      </IconButton>

      <Modal open={updateModal} onClose={() => setUpdateModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            width: 300,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField value={work} InputProps={{ readOnly: true }} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(v) => setStartTime(v)}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(v) => setEndTime(v)}
              />
              <TimePicker
                label="Rest (minutes)"
                views={["minutes"]}
                value={rest}
                onChange={(v) => setRest(v)}
              />
            </LocalizationProvider>
          </Box>

          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setUpdateModal(false)}>Close</Button>
            <Button
              variant="contained"
              color="success"
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
            >
              Update
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            width: 300,
          }}
        >
          <Typography>Are you sure to delete {deleteInfo.name}?</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setDeleteModal(false)}>Close</Button>
            <Button
              color="error"
              variant="contained"
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
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
