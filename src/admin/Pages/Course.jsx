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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { doc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { useApp } from "../../App";

export default function Course() {
  const { course, setCourse, setGlobalMsg } = useApp();

  const [year, setYear] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editYear, setEditYear] = useState(null);
  const [editedCourses, setEditedCourses] = useState({});
  const [deleteItem, setDelteItem] = useState({});

  useEffect(() => {
    async function fetchCourse() {
      const ref = collection(db, "course");
      const snap = await getDocs(ref);
      const data = {};
      snap.forEach((d) => (data[d.id] = d.data()));
      setCourse(data);
    }
    fetchCourse();
  }, [setCourse]);

  const handleAdd = async () => {
    if (!year || !courseName) return;

    const yearValue = year.year();
    const existing = course[yearValue] || {};
    const nextIndex = Object.keys(existing).length + 1;

    const newData = {
      ...existing,
      [nextIndex]: courseName,
    };

    await setDoc(doc(db, "course", String(yearValue)), newData, {
      merge: true,
    });

    setCourse((prev) => ({
      ...prev,
      [yearValue]: newData,
    }));

    setCourseName("");
  };
  const handleDeleteCourse = async (year, courseKey) => {
    await updateDoc(doc(db, "course", year), {
      [courseKey]: deleteField(),
    });

    setCourse((prev) => {
      const copy = { ...prev };
      delete copy[year][courseKey];
      if (Object.keys(copy[year]).length === 0) {
        delete copy[year];
        deleteDoc(doc(db, "course", year));
      }
      return copy;
    });
    setDelteItem({});
    setDeleteModal(false);
    setGlobalMsg("Deleted Successfully!")
  };

  const handleSave = async (year) => {
    await setDoc(doc(db, "course", year), editedCourses);
    setCourse((prev) => ({
      ...prev,
      [year]: editedCourses,
    }));

    setEditYear(null);
    setEditedCourses({});
    setGlobalMsg("Updated Successfully!");
  };

  const handleCancel = () => {
    setEditYear(null);
    setEditedCourses({});
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
      <Box p={3}>
        <Typography variant="h5" mb={2}>
          Course Management
        </Typography>

        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year"]}
              label="Year"
              value={year}
              onChange={(v) => setYear(v)}
              slotProps={{ textField: { sx: { minWidth: 120 } } }}
            />
          </LocalizationProvider>

          <TextField
            label="Course name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            disabled={!year || !courseName}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Stack>
      </Box>

      <Box sx={{ px: 3,maxHeight:"495px",overflow:"auto",minHeight:"495px"}}>
        <Stack spacing={2}>
          {Object.entries(course)
            .sort(([a], [b]) => b - a)
            .map(([year, courses]) => (
              <Card
                key={year}
                sx={{
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography fontWeight={700}>{year} 年</Typography>

                    {editYear === year ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          color="success"
                          startIcon={<SaveOutlinedIcon />}
                          onClick={() => handleSave(year)}
                        >
                          Save
                        </Button>
                        <Button
                          color="error"
                          startIcon={<CloseOutlinedIcon />}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    ) : (
                      <Button
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => {
                          setEditYear(year);
                          setEditedCourses({ ...courses });
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>

                  <Stack spacing={1}>
                    {Object.entries(courses).map(([key, value], index) => (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.6)",
                        }}
                      >
                        {editYear === year ? (
                          <>
                            <TextField
                              size="small"
                              value={editedCourses[key]}
                              onChange={(e) =>
                                setEditedCourses((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                              fullWidth
                            />
                          </>
                        ) : (
                          <>
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                <Typography fontWeight={500}>
                                  {index + 1}】{value}
                                </Typography>
                              </Box>
                              <Box>
                                <Button
                                  color="error"
                                  onClick={() => {
                                    setDelteItem({ year, key,value });
                                    setDeleteModal(true);
                                  }}
                                >
                                  <DeleteOutlinedIcon />
                                </Button>
                              </Box>
                            </Box>
                          </>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Box>
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
          <Typography>Are you sure to Delete {deleteItem.value} ?</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                handleDeleteCourse(deleteItem.year,deleteItem.key);
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
