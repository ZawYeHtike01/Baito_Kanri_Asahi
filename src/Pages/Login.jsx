import { Alert, Box, Button, TextField, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { useApp } from "../App";
import { useNavigate,Link } from "react-router-dom";
import logo from '../assets/logo.png'


export default function Login(){
    const {auth}=useApp();
    // const navigate=useNavigate();
    return(
        <Box  sx={{
                width: "100%",         
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", 
                mt:13,       
            }}>
            <Box
				component="img"
				src={logo}
				alt="Logo"
				sx={{ width: 120, mb: 2 }}
			/>
            <Typography variant="h3">Login</Typography>
            <Alert severity="warning"
				sx={{ mt: 2 }}>
                All fields required
            </Alert>
            <form>
                <Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 2,
						mt: 2,
					}}>
					<TextField
						placeholder="Username"
						fullWidth
                        
					/>
					<TextField
						type="password"
						placeholder="Password"
						fullWidth
					/>
					<Button
						type="submit"
						variant="contained"
						fullWidth>
						Login
					</Button>
				</Box>
            </form>
            <Typography sx={{ mt: 2, textAlign: "center" }}>
                Don't have an account?{" "}
                <Link to="/">Register</Link>
            </Typography>
        </Box>
    )
}
