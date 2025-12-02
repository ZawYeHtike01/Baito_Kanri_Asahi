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
	Typography,
} from "@mui/material";

import {
	Home as HomeIcon,
	Person as ProfileIcon,
	Logout as LogoutIcon,
	PersonAdd as RegisterIcon,
	Login as LoginIcon,
} from "@mui/icons-material";

import { useApp } from "../App";
import { useNavigate } from "react-router-dom";

export default function AppDrawer(){
    const navigate = useNavigate();
    const {showDrawer,setShowDrawer}=useApp();
    const {setAuth}=useApp();
    return(
        <div>
            <Drawer open={showDrawer} onClose={()=>setShowDrawer(false)}>
                <Box
					sx={{
						mb: 6,
						width: 300,
						height: 140,
						bgcolor: "banner",
						position: "relative",
					}}>
					<Box
						sx={{
							gap: 2,
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							position: "absolute",
							left: 20,
							bottom: -30,
						}}>
						<Avatar
							sx={{
								width: 94,
								height: 94,
								color: "white",
								
							}}
						/>
                        <Box>
                            <Typography sx={{ fontWeight: "bold" }}>
							    Zaw Ye Htike
						    </Typography>
                            <Divider></Divider>
                            <Typography variant="body1" component={'p'}>
                                G25016
                            </Typography>
                        </Box>
						
					</Box>
				</Box>
                <List>
					<ListItem>
						<ListItemButton onClick={() => {
							navigate("/home");
							setShowDrawer(false);
						}}>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText>Home</ListItemText>
						</ListItemButton>
					</ListItem>
					<Divider />
							<ListItem>
								<ListItemButton>
									<ListItemIcon>
										<ProfileIcon />
									</ListItemIcon>
									<ListItemText>Profile</ListItemText>
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton onClick={()=>{
                                    navigate("/");
                                    setAuth(false);
									setShowDrawer(false)
                                }}>
									<ListItemIcon>
										<LogoutIcon color="error" />
									</ListItemIcon>
									<ListItemText>Logout</ListItemText>
								</ListItemButton>
							</ListItem>
				</List>
            </Drawer>
        </div>
    )
}