import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { getIdTokenResult } from "firebase/auth";
import { useApp } from "../App";
import { auth, db } from "../Firebase";
import logo from "../assets/logo.png";
import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const { setisAuth, setUserData, setGlobalMsg, setAdmin } =
    useApp();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "BaitoKanri";

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (!user) {
          setisAuth(false);
          setUserData(null);
          setAdmin(false);
          navigate("/login");
          return;
        }
        const token = await getIdTokenResult(user);
        const isAdmin = token.claims.admin === true;
        setisAuth(true);
        if (isAdmin) {
          const snap = await getDoc(doc(db, "admin", user.uid));
          setUserData(snap.data());
          setAdmin(true);
          navigate("/adminhome");
        } else {
          const snap = await getDoc(doc(db, "users", user.uid));
          setUserData(snap.data());
          setAdmin(false);
          navigate("/home");
        }
        setGlobalMsg("Login Successfully");
      } catch (error) {
        console.error("Auth state error:", error);
        setGlobalMsg("Authentication failed");
        setisAuth(false);
        setAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {
      email: !emailRef.current.value,
      password: !passwordRef.current.value,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      setGlobalMsg("Please fill email and password");
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
      const token = await getIdTokenResult(user);
      const isAdmin = token.claims.admin === true;
      setisAuth(true);
      setGlobalMsg("Login Successfully");
      if (isAdmin) {
        const snap = await getDoc(doc(db, "admin", user.uid));
        setUserData(snap.data());
        navigate("/adminhome");
        setAdmin(true);
      } else {
        const snap = await getDoc(doc(db, "users", user.uid));
        setUserData(snap.data());
        navigate("/home");
      }
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setErrors({ email: true, password: true });
        setGlobalMsg("Email or password is incorrect");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: { xs: "95%", sm: "50%", md: "27%" },
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
          }}
        >
          <CircularProgress size={64} />
        </Box>
      )}

      <Box
        sx={{
          width: { xs: "90%", sm: 400 },
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box component="img" src={logo} sx={{ width: 90, mb: 1 }} />
          <Typography variant="h4" fontWeight={700}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Email"
            inputRef={emailRef}
            error={errors.email}
            helperText={errors.email && "Please enter a valid email"}
            fullWidth
          />

          <TextField
            label="Password"
            inputRef={passwordRef}
            type={showPassword ? "text" : "password"}
            error={errors.password}
            helperText={errors.password && "Please enter your password"}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Login
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
        >
          Don&apos;t have an account?{" "}
          <Link to="/signup" style={{ fontWeight: 600 }}>
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
