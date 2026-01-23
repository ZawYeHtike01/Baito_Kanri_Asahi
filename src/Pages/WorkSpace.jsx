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
  Fade,
  InputAdornment,
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  EditNote as EditIcon,
  PaymentsOutlined as SalaryIcon,
  WorkOutline as WorkIcon,
  WarningAmberRounded as WarningIcon,
} from "@mui/icons-material";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../Firebase";
import { useApp } from "../App";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  bgcolor: "background.paper",
  boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
  p: 4,
  borderRadius: "24px",
};

export default function WorkSpace() {
  const { setGlobalMsg, workname, setWorkName } = useApp();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [deleteInfo, setDeleteInfo] = useState("");
  const [update, setUpdate] = useState({
    work: "",
    salary: "",
  });

  const deleteItem = async (name) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "worksname", user.uid, "works", name));
      const filtered = workname.filter((i) => i.work !== name);
      setWorkName(filtered);
      setGlobalMsg("Deleted Successfully");
    } catch (e) {
      console.error(e.message);
      setGlobalMsg("Error deleting item");
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  const updateItem = async () => {
    setLoading(true);
    try {
      await updateDoc(
        doc(db, "worksname", user.uid, "works", update.work),
        {
          salary: Number(update.salary),
        }
      );

      setWorkName((prev) =>
        prev.map((item) =>
          item.work === update.work
            ? { ...item, salary: Number(update.salary) }
            : item
        )
      );

      setGlobalMsg("Update Successfully");
      setUpdateModal(false);
    } catch (e) {
      console.error(e.message);
      setGlobalMsg("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "95%", sm: "450px", md: "400px" },
        maxHeight: { xs: "calc(100vh - 56px)", md: 650 },
        position: "relative",
        // background: "rgba(255, 255, 255, 0.02)",
        // backdropFilter: "blur(15px)",
        // border: "1px solid rgba(255, 255, 255, 0.1)",
        // boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        // borderRadius: "28px",
        display: "flex",
        flexDirection: "column",
        mt: "70px",
        mx: "auto",
        overflow: "hidden"
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
          <CircularProgress size={64} />
        </Box>
      )}

      <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <WorkIcon color="primary" /> Work Space
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.7 }}>
          Manage your work rates
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, py: 2, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 10 } }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {workname.map((key) => (
            <ListItem
              key={key.work}
              sx={{
                bgcolor: "rgba(25, 118, 210, 0.05)",
                border: "1px solid rgba(25, 118, 210, 0.1)",
                borderRadius: "16px",
                px: 3,
                py: 2,
                transition: "all 0.2s ease",
                cursor: "pointer",
                 "&:hover": { bgcolor: "rgba(25, 118, 210, 0.12)" }
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteInfo(key.work);
                    setDeleteModal(true);
                  }}
                  sx={{ color: "rgba(0, 0, 0, 0.4)", "&:hover": { color: "#ff5252" } }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Box
                onClick={() => {
                  setUpdateModal(true);
                  setUpdate({ work: key.work, salary: key.salary });
                }}
                sx={{ flexGrow: 1 }}
              >
                <Typography fontWeight="700" sx={{ color: "#2e539eff" }}>{key.work}</Typography>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#1976D2", fontWeight: 600 }}>
                   <SalaryIcon sx={{ fontSize: 16 }} /> ¥{key.salary} / hr
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Modal open={updateModal} onClose={() => setUpdateModal(false)} closeAfterTransition>
        <Fade in={updateModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" fontWeight="800" mb={3} textAlign="center">
              Update Salary
            </Typography>
          
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Workplace" 
                value={update.work} 
                fullWidth 
                InputProps={{ readOnly: true }} 
                variant="filled"
              />
              <TextField
                label="Hourly Salary"
                type="number"
                fullWidth
                value={update.salary}
                onChange={(e) => setUpdate((prev) => ({ ...prev, salary: e.target.value }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                }}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                 <Button fullWidth onClick={() => setUpdateModal(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                 <Button fullWidth variant="contained" onClick={updateItem} sx={{ borderRadius: '12px', fontWeight: 'bold' }}>Update</Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
        <Fade in={deleteModal}>
          <Box sx={{ ...modalStyle, textAlign: 'center' }}>
            <WarningIcon sx={{ fontSize: 50, color: '#ff5252', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold">Remove Workplace?</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Are you sure you want to delete <b>{deleteInfo}</b>? This action cannot be undone.
            </Typography>
            <Box mt={4} sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth onClick={() => setDeleteModal(false)} variant="outlined" sx={{ borderRadius: '12px' }}>Cancel</Button>
              <Button
                fullWidth
                color="error"
                variant="contained"
                sx={{ borderRadius: '12px', fontWeight: 'bold' }}
                onClick={() => deleteItem(deleteInfo)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}