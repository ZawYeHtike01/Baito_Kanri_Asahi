import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { useApp } from "../../App";
export default function Course() {
  const { course, setCourse } = useApp();
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

  console.log(course);
  return (
    <Box
      sx={{
        marginTop: { xs: "55px", sm: "55px", md: "70px" },
        width: { xs: "100%", sm: "100%", md: "40%" },
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        height: "100vh",
        maxHeight: "600px",
      }}
    >
      <Box p={3}>
        <Typography variant="h5" mb={2}>
          Course Management
        </Typography>

        <Stack direction="row" spacing={2} mb={3}>
          <TextField
            label="Course name"
            value="Hello"
            //   onChange={(e) => setCourseName(e.target.value)}
          />
          <Button variant="contained">Add</Button>
        </Stack>

        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography>Hello</Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
