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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import { useApp } from "../App";
import logo from "../assets/logo.png";
import { db, auth } from "../Firebase";

export default function Login() {
  const { setisAuth, setUserData, setGlobalMsg } = useApp();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ログイン | BaitoKanri";

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

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

      <Box
        component="img"
        src={logo}
        alt="BaitoKanri Logo"
        sx={{ width: 120, mb: 2 }}
      />

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

          if (Object.values(newError).some(Boolean)) {
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
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            setUserData(snap.data());
            setisAuth(true);
            setGlobalMsg("Login Successfully");
            navigate("/home");
          } catch (e) {
            if (
              e.code === "auth/user-not-found" ||
              e.code === "auth/wrong-password" ||
              e.code === "auth/invalid-credential"
            ) {
              setErrors({ email: true, password: true });
              setGlobalMsg("Email and Password is Wrong");
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
            label="Email"
            fullWidth
            error={errors.email}
          />

          <TextField
            inputRef={passwordRef}
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            error={errors.password}
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
        Don&apos;t have an account?{" "}
        <Link to="/signup">Register</Link>
      </Typography>
    </Box>
  );
}
