import { Box, Container, Snackbar } from "@mui/material";

import { Outlet } from "react-router-dom";

import { useApp } from "./App";
import Header from "./Components/Header";
import AppDrawer from "./Components/AppDrawer";

export default function Template(){
	const {isauth}=useApp();
	const { globalMsg, setGlobalMsg } = useApp();
    return(
        <Box sx={{height:"100vh",display:"flex",flexDirection:"column" }}>
					{isauth && (
						<Box>
							<Header/>
							<AppDrawer/>
						</Box>
						
					)}
					
			<Box
				sx={{
					height: "100%",
					width: "100%",
					
					display:"flex",
					justifyContent:"center"
				}}
				>
				<Outlet />
			</Box>

			
			<Snackbar
				anchorOrigin={{
					horizontal: "center",
					vertical: "bottom",
				}}
				open={Boolean(globalMsg)}
				autoHideDuration={6000}
				onClose={() => setGlobalMsg(null)}
				message={globalMsg}
			/>
		</Box>
    )
}