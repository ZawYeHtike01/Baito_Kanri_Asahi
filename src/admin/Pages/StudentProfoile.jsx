import {
  Box,
  Typography,
  Avatar,
  Divider,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../../App";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../Firebase";

export default function StudentProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {  setStudent, setGlobalMsg } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    studentNo: state?.studentNo || "",
    userName: state?.userName || "",
    userNameKatakana: state?.userNameKatakana || "",
    schoolYear: state?.schoolYear || "",
    major: state?.major || "",
    email: state?.email || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      studentNo: state?.studentNo || "",
      userName: state?.userName || "",
      userNameKatakana: state?.userNameKatakana || "",
      schoolYear: state?.schoolYear || "",
      major: state?.major || "",
      email: state?.email || "",
    });
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", state.userId), formData);

      setStudent((prev) =>
        prev.map((s) => (s.userId === state.userId ? { ...s, ...formData } : s))
      );

      setGlobalMsg("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.log(err.message);
      setGlobalMsg("Failed to update profile.");
    }
  };

  

  return (
    <Box
      sx={{
        width: { xs: "95%", md: "32%" },
        mx: "auto",
        mt: { xs: "60px", md: "80px" },
        borderRadius: "24px",
        minHeight: "650px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        <Avatar
          sx={{
            width: 96,
            height: 96,
            position: "absolute",
            bottom: -48,
            left: "50%",
            transform: "translateX(-50%)",
            border: "4px solid white",
            backgroundColor: "#9fa8da",
            fontSize: "36px",
          }}
        >
          {formData.userName?.[0] || "U"}
        </Avatar>
      </Box>

      <Box sx={{ px: 3, pt: 7, pb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography sx={{ fontWeight: 600 }}>Student Profile</Typography>

          {!editMode ? (
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<EditOutlinedIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
              {/* <Button
                color="error"
                startIcon={<DeleteOutlinedIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button> */}
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                color="success"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSave}
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
          )}
        </Stack>

        <InfoRow
          icon={<BadgeOutlinedIcon />}
          label="Student No"
          value={formData.studentNo}
          name="studentNo"
          editMode={editMode}
          onChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />

        <InfoRow
          icon={<PersonOutlineIcon />}
          label="Name"
          value={formData.userName}
          name="userName"
          editMode={editMode}
          onChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />

        <InfoRow
          icon={<PersonOutlineIcon />}
          label="Katakana Name"
          value={formData.userNameKatakana}
          name="userNameKatakana"
          editMode={editMode}
          onChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />

        <InfoRow
          icon={<HistoryEduOutlinedIcon />}
          label="School Year"
          value={formData.schoolYear}
          name="schoolYear"
          editMode={false}
          onChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />

        <InfoRow
          icon={<HistoryEduOutlinedIcon />}
          label="Major"
          value={formData.major}
          name="major"
          editMode={false}
          onChange={handleChange}
        />
        <Divider sx={{ my: 2 }} />

        <InfoRow
          icon={<EmailOutlinedIcon />}
          label="Email"
          value={formData.email}
          name="email"
          editMode={false}
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
}

const InfoRow = ({ icon, label, value, editMode, name, onChange }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        background: "rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>

    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: "12px", color: "#777" }}>{label}</Typography>

      {editMode ? (
        <TextField
          size="small"
          fullWidth
          name={name}
          value={value}
          onChange={onChange}
        />
      ) : (
        <Typography sx={{ fontWeight: 500 }}>{value || "-"}</Typography>
      )}
    </Box>
  </Box>
);
