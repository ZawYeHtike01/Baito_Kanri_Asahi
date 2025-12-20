import { Box, Button, TextField, CircularProgress } from "@mui/material";
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
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../Firebase";
import { useRef } from "react";
import { useApp } from "../App";
import { useNavigate } from "react-router-dom";

export default function AddWork() {
  const [work, setWork] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [rest, setRest] = useState(dayjs().hour(0).minute(0));
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const workNameRef = useRef();
  const salaryRef = useRef();
  const [loading, setLoading] = useState();
  const [error, setError] = useState({
    work: false,
    start: false,
    end: false,
    rest: false,
  });
  const { selectedDate, setMonthCache, workname, setWorkName, setGlobalMsg } =
    useApp();
  const workAdd = async () => {
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
      await setDoc(worksRef, {
        salary: Number(salaryRef.current.value),
      });
      setWorkName((prev) => [
        ...prev,
        {
          work: workNameRef.current.value,
          salary: Number(salaryRef.current.value),
        },
      ]);
      setGlobalMsg("Added Successfully");
      setOpenModal(false);
      setWork("");
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };
  const addItem = async () => {
    setLoading(true);
    const newError = {
      work: !work,
      start: !startTime,
      end: !endTime,
    };
    setError(newError);
    const hasErr = Object.values(newError).some(Boolean);
    if (hasErr) {
      setLoading(false);
      setGlobalMsg("Please Fill The Field");
      return;
    }

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
      let shift = {};
      if (docSnap.exists()) {
        shift = docSnap.data();
      }
      let uniqueName = work;
      let count = 1;
      while (shift[uniqueName]) {
        uniqueName = `${work}_${count++}`;
      }

      const salary = workname.find((i) => i.work === work);
      if (!salary) throw new Error("Work not found");
      shift[uniqueName] = {
        start: startTime.format("HH:mm"),
        end: endTime.format("HH:mm"),
        rest: rest.minute(),
        salary: salary.salary,
      };
      await setDoc(workShiftRef, shift, { merge: true });
      setMonthCache((prev) => {
        const [y, m] = selectedDate.split("-");
        const key = `${y}-${m}`;
        return {
          ...prev,
          [key]: {
            ...(prev[key] || {}),
            [selectedDate]: shift,
          },
        };
      });
      setStartTime(dayjs());
      setEndTime(dayjs());
      setRest(dayjs().hour(0).minute(0));
      setWork("");

      setGlobalMsg("Added Item Successfully");
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };
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
        {loading && (
          <Box
            sx={{
              position: "fixed",
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2000,
            }}
          >
            <CircularProgress size={70} />
          </Box>
        )}
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
              error={error.work}
              labelId="work-label"
              value={work}
              label="Work"
              onChange={(e) => {
                setWork(e.target.value);
                if (e.target.value === "others") {
                  setOpenModal(true);
                  return;
                }
              }}
            >
              {workname.map((e) => (
                <MenuItem key={e.id} value={e.work}>
                  {e.work}
                </MenuItem>
              ))}
              <MenuItem value="others">others</MenuItem>
            </Select>
          </FormControl>

          <TimePicker
            error={error.start}
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
          />

          <TimePicker
            error={error.end}
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
          />

          <TimePicker
            error={error.rest}
            label="Rest (minutes)"
            views={["minutes"]}
            value={rest}
            onChange={(newValue) => setRest(newValue)}
          />

          <Button
            onClick={async () => {
              await addItem();
              navigate("/home");
            }}
            variant="contained"
            fullWidth
          >
            Add Work
          </Button>

          <Button
            onClick={() => {
              setStartTime(dayjs());
              setEndTime(dayjs());
              setRest(dayjs().hour(0).minute(0));
              setWork("");
              setGlobalMsg("Clear Successfully");
            }}
            variant="outlined"
            fullWidth
          >
            Clear
          </Button>
        </Box>

        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setWork("");
          }}
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
            <Typography variant="h6">Add New Work</Typography>
            <TextField
              inputRef={workNameRef}
              sx={{ mt: 3 }}
              id="outlined-basic"
              label="Name"
              variant="outlined"
              fullWidth
            />
            <TextField
              inputRef={salaryRef}
              type="number"
              sx={{ mt: 3 }}
              id="outlined-basic"
              label="Salary"
              variant="outlined"
              fullWidth
            />
            <Button
              onClick={async () => {
                await workAdd();
              }}
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
              fullWidth
            >
              Add
            </Button>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
}
