import {
  CircularProgress,
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useApp } from "../App";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRef } from "react";
import { db } from "../Firebase";
import { getDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";

export default function Login() {
  const { setisAuth, setUserData } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setGlobalMsg } = useApp();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  return (
    <Box
      sx={{
        width: { xs: "85%", sm: "50%", md: "27%" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        margin: "auto",
        paddingBottom: 5,
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "fixed",
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <CircularProgress size={70} />
        </Box>
      )}
      <Box component="img" src={logo} alt="Logo" sx={{ width: 120, mb: 2 }} />
      <Typography variant="h3">Login</Typography>
      <Alert severity="warning" sx={{ mt: 2 }}>
        All fields required
      </Alert>
      <form
        style={{ width: "75%" }}
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const newError = {
            email: !emailRef.current.value,
            password: !passwordRef.current.value,
          };
          setErrors(newError);
          const hasError = Object.values(newError).some(Boolean);
          if (hasError) {
            setGlobalMsg("Please Fill Email And Password");
            setLoading(false);
            return;
          }
          try {
            await signInWithEmailAndPassword(
              auth,
              emailRef.current.value,
              passwordRef.current.value
            );
            const user = auth.currentUser;
            const userref = doc(db, "users", user.uid);
            const getdata = await getDoc(userref);
            setUserData(getdata.data());
            navigate("/home");
            setGlobalMsg("Login Successfully");
            setisAuth(true);
          } catch (e) {
            if (
              e.code === "auth/user-not-found" ||
              e.code === "auth/wrong-password" ||
              e.code === "auth/invalid-credential"
            ) {
              setErrors(() => ({ email: true, password: true }));
              const hasError = Object.values(errors).some(Boolean);
              if (hasError) {
                setGlobalMsg("Email and Password is Wrong");
                return;
              }
            }
          } finally {
            setLoading(false);
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            width: "100%",
          }}
        >
          <TextField
            inputRef={emailRef}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            fullWidth
            error={errors.email}
          />
          <TextField
            inputRef={passwordRef}
            error={errors.password}
            type={showPassword ? "text" : "password"}
            id="outlined-basic"
            label="Password"
            variant="outlined"
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
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
      </form>
      <Typography sx={{ mt: 2, textAlign: "center" }}>
        Don't have an account?
        <Link to="/signup">Register</Link>
      </Typography>
    </Box>
  );
}
