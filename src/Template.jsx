import { Box, Container, Snackbar } from "@mui/material";

import { Outlet } from "react-router-dom";

import { useApp } from "./App";
import Header from "./Components/Header";
import AppDrawer from "./Components/AppDrawer";

export default function Template(){
	const {auth}=useApp();
	const { globalMsg, setGlobalMsg } = useApp();
    return(
        <Box sx={{width:"100%",height:"100vh" }}>
			
			<Container 
				maxWidth="sm"
				sx={{height:"100%",display:"flex",justifyContent:"center",alignItems:"top",flexDirection:"column" }}>
					{auth && (
				<>
					<Header/>
					<AppDrawer/>
				</>
			)}
				<Outlet />
			</Container>
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