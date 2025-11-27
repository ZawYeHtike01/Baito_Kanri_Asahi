import { Box, Container, Snackbar } from "@mui/material";

import { Outlet } from "react-router-dom";

// import { useApp } from "./ThemedApp";

export default function Template(){
    return(
        <Box>
			<Container
				maxWidth="sm"
				sx={{ mt: 4 }}>
				<Outlet />
			</Container>
		</Box>
    )
}