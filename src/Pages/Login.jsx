import { Alert, Box, Button, TextField, Typography,InputAdornment,IconButton } from "@mui/material";
import { useApp } from "../App";
import { useNavigate,Link } from "react-router-dom";
import logo from '../assets/logo.png';
import { useState } from "react";
import { Visibility,VisibilityOff } from "@mui/icons-material";

export default function Login(){
    const {setAuth}=useApp();
	const [showPassword,setShowPassword]=useState(false);
	const navigate=useNavigate();
	const{setGlobalMsg}=useApp();
    return(
        <Box  sx={{
                width: {xs:"85%",sm:"50%",md:"27%"},         
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", 
				borderRadius:5,
				margin:'auto', 
				paddingBottom:5,
				background: "rgba(255, 255, 255, 0.2)",  
				backdropFilter: "blur(10px)",             
				border: "1px solid rgba(255, 255, 255, 0.3)",
				boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
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
            <form style={{width:"75%"}} onSubmit={e => {
					e.preventDefault();
					setAuth(true);
					navigate("/home");
					setGlobalMsg("Login Successfully");	
				}}>
                <Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 2,
						mt: 2,
						width:"100%",
					}}>
					<TextField id="outlined-basic" label="Email" variant="outlined"
						fullWidth
					/>
					<TextField
					type={showPassword ? "text" : "password"}
					id="outlined-basic" label="Password" variant="outlined"
					fullWidth
					InputProps={{
						endAdornment: (
						<InputAdornment position="end">
							<IconButton
							onClick={() => setShowPassword(!showPassword)}
							edge="end"
							>
							{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
						),
					}}
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
                Don't have an account?
                <Link to="/">Register</Link>
            </Typography>
        </Box>
    )
}
