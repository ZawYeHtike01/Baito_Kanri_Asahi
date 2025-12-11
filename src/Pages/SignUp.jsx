import { CircularProgress,Alert, Box, Button, TextField, Typography,InputAdornment,IconButton, major } from "@mui/material";
import { useApp } from "../App";
import { useNavigate,Link } from "react-router-dom";
import logo from '../assets/logo.png';
import { useState } from "react";
import { Visibility,VisibilityOff } from "@mui/icons-material";
import { useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db,auth } from "../Firebase";
import { setDoc,doc } from "firebase/firestore";
export default function SignUp(){
	const [showPassword,setShowPassword]=useState(false);
	const navigate=useNavigate();
	const{setGlobalMsg}=useApp();
	const emailRef=useRef();
	const passwordRef=useRef();
    const confirmpasswordRef=useRef();
    const nameRef=useRef();
    const katakanaRef=useRef();
    const stunoRef=useRef();
    const majorRef=useRef();
    const [schoolyear,setSchoolyear]=useState();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
    name: false,
    katakana: false,
    stuno:false,
    email: false,
    major:false,
    password: false,
    confirmPassword: false,
    schoolyear:false,
    });
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
            {loading && (
                            <Box sx={{
                                position: "fixed",
                                width: "100%",
                                height: "100%",
                                background: "rgba(255, 255, 255, 0.4)",
                                backdropFilter: "blur(6px)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 2000
                            }}>
                                <CircularProgress size={70} />
                            </Box>
                        )}
            <Box
				component="img"
				src={logo}
				alt="Logo"
				sx={{ width: 120, mb: 2 }}
			/>
            <Typography variant="h3">Sign Up</Typography>
            <Alert severity="warning"
				sx={{ mt: 2 }}>
                All fields required
            </Alert>
            <form style={{width:"75%"}} onSubmit={async(e) => {
					e.preventDefault();
					setLoading(true);
					const newErrors = {
                        name: !nameRef.current.value,
                        katakana: !/^[ァ-ンヴー・ー\s]+$/.test(katakanaRef.current.value),
                        email: !emailRef.current.value,
                        major:!majorRef.current.value,
                        password: !passwordRef.current.value,
                        stuno:!stunoRef.current.value,
                        schoolyear:!schoolyear,
                        confirmPassword:
                        (passwordRef.current.value !== confirmpasswordRef.current.value) || !confirmpasswordRef.current.value,
                    };	
                    setErrors(newErrors);
                    const hasError=Object.values(newErrors).some(Boolean);
                    if(hasError) {
                        setLoading(false);
                        return;}
                    try{
                        const userData= await createUserWithEmailAndPassword(auth,emailRef.current.value,passwordRef.current.value);
                        const user=userData.user;
                        const userRef=doc(db,'users',user.uid);
                        await setDoc(userRef,{
                            userName:nameRef.current.value,
                            userNameKatakana:katakanaRef.current.value,
                            email: emailRef.current.value,
                            major:majorRef.current.value,
                            studentNo:stunoRef.current.value,
                            schoolYear:schoolyear.year(),
                        },{merge:true})
                        setGlobalMsg("Sign Up Successfully");
                       navigate("/");
                    }catch(f){
                        if(f.code==="auth/email-already-in-use"){
                           setErrors((prev) => ({ ...prev, email: true }));
                           const hasError=Object.values(errors).some(Boolean);
                           if(hasError) {setGlobalMsg("This Email is already used")
                            return;}
                        return;
                        }
                        console.log(f.message);
                        
                    }finally{
                        setLoading(false);
                    }
				}}>
                <Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 2,
						mt: 2,
						width:"100%",
					}}>
                    <TextField id="outlined-basic" inputRef={nameRef} label="Name" variant="outlined"
						fullWidth error={errors.name}
					/>
                    <TextField id="outlined-basic" inputRef={katakanaRef} label="Katakana" variant="outlined"
						fullWidth error={errors.katakana}
                        inputProps={{ lang: "ja" }}
                       onBlur={(e) => {
                        const converted = e.target.value.replace(/[\u3041-\u3096]/g, ch =>
                            String.fromCharCode(ch.charCodeAt(0) + 0x60)
                        );
                        e.target.value = converted;
                        }}

					/>
                    <TextField id="outlined-basic" inputRef={stunoRef} label="Student No" variant="outlined"
						fullWidth error={errors.stuno}
					/>
					<TextField inputRef={emailRef} id="outlined-basic" label="Email" variant="outlined"
						fullWidth error={errors.email}
					/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        views={["year"]}
                        label="Enrollment Year"
                        value={schoolyear}
                        minDate={dayjs().subtract(3,"year")}
                        maxDate={dayjs().add(1, "year")}
                        onChange={(newValue) => setSchoolyear(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: errors.schoolyear,
                                helperText: errors.schoolyear
                                ? "Please select enrollment year"
                                : "",
                            },
                        }}
                    />
                    </LocalizationProvider>
                    <TextField id="outlined-basic" inputRef={majorRef} label="Major" variant="outlined"
						fullWidth error={errors.major}
					/>
					<TextField inputRef={passwordRef}
					type={showPassword ? "text" : "password"}
					id="outlined-basic" label="Password" variant="outlined"
					fullWidth error={errors.password}
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
                    <TextField inputRef={confirmpasswordRef}
					type={showPassword ? "text" : "password"}
					id="outlined-basic" label="Confirm Password" variant="outlined"
					fullWidth error={errors.confirmPassword}
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
						Register
					</Button>
				</Box>
            </form>
            <Typography sx={{ mt: 2, textAlign: "center" }}>
                Already have an account?
                <Link to="/">Login</Link>
            </Typography>
        </Box>
    )
}
