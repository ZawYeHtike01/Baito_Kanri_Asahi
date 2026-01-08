import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Modal,
  IconButton,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import dayjs from "dayjs";

import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../Firebase";
import { useApp } from "../../App";

export default function CheckLimit() {
  const { checkHour, setCheckHour, setGlobalMsg } = useApp();

  const [addModal, setAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const [holidayName, setHolidayName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "time"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCheckHour(data);
    };
    fetchData();
  }, [setCheckHour]);

  const handleAdd = async () => {
    const payload = {
      start: startDate.format("YYYY-MM-DD"),
      end: endDate.format("YYYY-MM-DD"),
    };

    await setDoc(doc(db, "time", holidayName), payload);

    setCheckHour((prev) => [...prev, { id: holidayName, ...payload }]);
    setAddModal(false);
    setHolidayName("");
    setStartDate(null);
    setEndDate(null);
    setGlobalMsg("Added successfully!");
  };

  const handleUpdate = async () => {
    const payload = {
      start: editTarget.start.format("YYYY-MM-DD"),
      end: editTarget.end.format("YYYY-MM-DD"),
    };

    await updateDoc(doc(db, "time", editTarget.id), payload);

    setCheckHour((prev) =>
      prev.map((i) => (i.id === editTarget.id ? { ...i, ...payload } : i))
    );

    setEditTarget(null);
    setGlobalMsg("Updated successfully!");
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "time", deleteTarget.id));
    setCheckHour((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
    setGlobalMsg("Deleted successfully!");
  };

  return (
    <Box
      sx={{
        mt: { xs: "55px", md: "70px" },
        width: { xs: "100%", md: "40%" },
        mx: "auto",
        background: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(12px)",
        borderRadius: 4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        maxHeight: 650,
        overflow: "auto",
      }}
    >
      <Box p={3} display="flex" justifyContent="space-between">
        <Typography variant="h5" fontWeight={700}>
          Hour Management
        </Typography>
        <IconButton color="primary" onClick={() => setAddModal(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      <Stack
        sx={{ maxHeight: "495px", overflow: "auto",minHeight:"495px" }}
        spacing={2}
        px={3}
        pb={3}
      >
        {checkHour.map((item) => (
          <Card
            key={item.id}
            sx={{
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          >
            <CardContent
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box>
                {editTarget?.id === item.id ? (
                  <Stack spacing={1}>
                    <Typography fontWeight={700}>{item.id}</Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start"
                        value={editTarget.start}
                        onChange={(v) =>
                          setEditTarget((p) => ({ ...p, start: v }))
                        }
                      />
                      <DatePicker
                        label="End"
                        value={editTarget.end}
                        onChange={(v) =>
                          setEditTarget((p) => ({ ...p, end: v }))
                        }
                      />
                    </LocalizationProvider>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        color="success"
                        startIcon={<SaveOutlinedIcon />}
                        onClick={handleUpdate}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CloseOutlinedIcon />}
                        onClick={() => setEditTarget(null)}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <>
                    <Typography fontWeight={700}>{item.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.start} ~ {item.end}
                    </Typography>
                  </>
                )}
              </Box>
              {editTarget?.id === item.id ? (
                <></>
              ) : (
                <Stack direction="row">
                  <IconButton
                    onClick={() =>
                      setEditTarget({
                        ...item,
                        start: dayjs(item.start),
                        end: dayjs(item.end),
                      })
                    }
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Modal open={addModal} onClose={() => setAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 360,
            p: 3,
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Typography fontWeight={700} mb={2}>
            Add Holiday
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Holiday Name"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              disabled={!holidayName || !startDate || !endDate}
              onClick={handleAdd}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 320,
            p: 3,
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Typography fontWeight={700} mb={2}>
            Delete Holiday
          </Typography>
          <Typography mb={3}>{deleteTarget?.id}</Typography>

          <Stack direction="row" spacing={2}>
            <Button fullWidth onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
