import {
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,Button
} from "@mui/material";
import Modal from "@mui/material/Modal";
import {
  Home as HomeIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  PersonAdd as RegisterIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

import { useApp } from "../App";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { useState } from "react";

export default function AppDrawer() {
  const navigate = useNavigate();
  const { showDrawer, setShowDrawer } = useApp();
  const { setisAuth, setGlobalMsg, userData } = useApp();
  const [deleteModal,setDeleteModal]=useState(false);
  return (
    <div>
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
        <Box
          sx={{
            mb: 6,
            width: 300,
            height: 140,
            bgcolor: "banner",
            position: "relative",
          }}
        >
          <Box
            sx={{
              gap: 2,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              position: "absolute",
              left: 20,
              bottom: -30,
            }}
          >
            <Avatar  sx={{
                width: 94,
                height: 94,
                color: "white",
				fontSize: "40px",
				backgroundColor: "#9fa8da",
              }} 
			>{userData?.userNameKatakana?.[0] || "U"}</Avatar>
            <Box>
              <Typography sx={{ fontWeight: "bold" }}>
                {userData.userNameKatakana}
              </Typography>
              <Divider></Divider>
              <Typography variant="body1" component={"p"}>
                {userData.studentNo}
              </Typography>
            </Box>
          </Box>
        </Box>
        <List>
          <ListItem>
            <ListItemButton
              onClick={() => {
                navigate("/home");
                setShowDrawer(false);
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton
              onClick={() => {
                navigate("/profile");
                setShowDrawer(false);
              }}
            >
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={ () => {
                setDeleteModal(true);
              }}
            >
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
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
          <Typography>Are you sure to Logout?</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setDeleteModal(false)}>Close</Button>
            <Button
              
              variant="contained"
              onClick={async () => {
                await signOut(auth);
                navigate("/");
                setisAuth(false);
                setShowDrawer(false);
                setGlobalMsg("Logout Successfully");
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
