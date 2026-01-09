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

    setHolidayName("");
    setStartDate(null);
    setEndDate(null);
    setAddModal(false);
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
        mt: { xs: "56px", md: "72px" },
        width: { xs: "100%", sm: "90%", md: "50%", lg: "40%" },
        mx: "auto",
        background: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(12px)",
        borderRadius: { xs: 0, sm: 4 },
        border: "1px solid rgba(255,255,255,0.18)",
        maxHeight: { xs: "calc(100vh - 56px)", md: 650 },
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        p={{ xs: 2, sm: 3 }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography fontWeight={700} fontSize={{ xs: "1rem", sm: "1.25rem" }}>
          Hour Management
        </Typography>

        <IconButton color="primary" onClick={() => setAddModal(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* List */}
      <Stack
        sx={{
          px: { xs: 2, sm: 3 },
          pb: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          overflowY: "auto",
          minHeight: 400,
        }}
      >
        {checkHour.map((item) => (
          <Card
            key={item.id}
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(0,0,0,0.08)",
              height: editTarget?.id === item.id ? 220 : 80,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                // flexDirection: { xs: "column", sm: "row" },
                flexDirection:"row",
                justifyContent: "space-between",
                
              }}
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
                        disabled={editTarget.start.isAfter(editTarget.end)}
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

              {editTarget?.id !== item.id && (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setEditTarget({
                        ...item,
                        start: dayjs(item.start),
                        end: dayjs(item.end),
                      })
                    }
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Add Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: { xs: 0, sm: "50%" },
            left: { xs: 0, sm: "50%" },
            transform: { xs: "none", sm: "translate(-50%,-50%)" },
            width: { xs: "100%", sm: 360 },
            height: { xs: "100%", sm: "auto" },
            p: 3,
            borderRadius: { xs: 0, sm: 3 },
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
              <DatePicker label="Start" value={startDate} onChange={setStartDate} />
              <DatePicker label="End" value={endDate} onChange={setEndDate} />
            </LocalizationProvider>

            <Button
              variant="contained"
              disabled={
                !holidayName ||
                !startDate ||
                !endDate ||
                startDate.isAfter(endDate)
              }
              onClick={handleAdd}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Delete Modal */}
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
