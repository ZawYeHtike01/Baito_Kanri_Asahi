import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { useApp } from "../App";
import logo from "../assets/logo.png";

export default function SignUp() {
  const navigate = useNavigate();
  const { setGlobalMsg, course, setCourse } = useApp();

  const nameRef = useRef();
  const katakanaRef = useRef();
  const stunoRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [schoolyear, setSchoolyear] = useState("");
  const [major, setMajor] = useState("");
  const [loading, setLoading] = useState(false);

  const studentNoRegex = /^[A-Z]\d{5}$/;

  const [errors, setErrors] = useState({
    name: false,
    katakana: false,
    stuno: false,
    email: false,
    major: false,
    password: false,
    confirmPassword: false,
    schoolyear: false,
  });

  useEffect(() => {
    async function fetchCourse() {
      const ref = collection(db, "course");
      const snap = await getDocs(ref);
      const data = {};
      snap.forEach((d) => (data[d.id] = d.data()));
      setCourse(data);
    }
    fetchCourse();
  }, [setCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {
      name: !nameRef.current.value,
      katakana: !/^[ァ-ンヴー・ー\s]+$/.test(katakanaRef.current.value),
      stuno:
        !stunoRef.current.value || !studentNoRegex.test(stunoRef.current.value),
      email: !emailRef.current.value,
      password: !passwordRef.current.value,
      confirmPassword:
        passwordRef.current.value !== confirmPasswordRef.current.value ||
        !confirmPasswordRef.current.value,
      schoolyear: !schoolyear,
      major: !major,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      setLoading(false);
      return;
    }

    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );

      await setDoc(
        doc(db, "users", userData.user.uid),
        {
          userName: nameRef.current.value,
          userNameKatakana: katakanaRef.current.value,
          email: emailRef.current.value,
          studentNo: stunoRef.current.value,
          schoolYear: schoolyear,
          major,
          role:"student",
        },
        { merge: true }
      );

      setGlobalMsg("Sign Up Successfully");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErrors((prev) => ({ ...prev, email: true }));
        setGlobalMsg("This email is already in use");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: { xs: "95%", sm: "50%", md: "27%" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        
        marginTop: { xs: "55px", sm: "55px", md: "70px" },
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
          width: { xs: "90%", sm: 420 },
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
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All fields are required
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Name"
            inputRef={nameRef}
            error={errors.name}
            helperText={errors.name && "Please enter your name"}
            fullWidth
          />

          <TextField
            label="Katakana"
            inputRef={katakanaRef}
            error={errors.katakana}
            helperText={errors.katakana && "Must be Katakana"}
            inputProps={{ lang: "ja" }}
            onBlur={(e) => {
              e.target.value = e.target.value.replace(
                /[\u3041-\u3096]/g,
                (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60)
              );
            }}
            fullWidth
          />

          <FormControl fullWidth error={errors.schoolyear}>
            <InputLabel>Enrollment Year</InputLabel>
            <Select
              value={schoolyear}
              label="Enrollment Year"
              onChange={(e) => {
                setSchoolyear(e.target.value);
                setMajor("");
              }}
            >
              <MenuItem value="">
                <em>Select year</em>
              </MenuItem>
              {Object.keys(course).map((k) => (
                <MenuItem key={k} value={k}>
                  {k}
                </MenuItem>
              ))}
            </Select>
            {errors.schoolyear && (
              <Typography variant="caption" color="error">
                Please select year
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={errors.major}>
            <InputLabel>Major</InputLabel>
            <Select
              value={major}
              label="Major"
              onChange={(e) => setMajor(e.target.value)}
            >
              <MenuItem value="">
                <em>Select major</em>
              </MenuItem>
              {Object.values(course[schoolyear] || {}).map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.major && (
              <Typography variant="caption" color="error">
                Please select major
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Student No"
            inputRef={stunoRef}
            error={errors.stuno}
            helperText={errors.stuno && "Format: G25016"}
            fullWidth
          />

          <TextField
            label="Email"
            inputRef={emailRef}
            error={errors.email}
            helperText={errors.email && "Invalid email"}
            fullWidth
          />

          <TextField
            label="Password"
            inputRef={passwordRef}
            type={showPassword ? "text" : "password"}
            error={errors.password}
            helperText={errors.password && "Please enter password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <TextField
            label="Confirm Password"
            inputRef={confirmPasswordRef}
            type={showPassword ? "text" : "password"}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword && "Passwords do not match"}
            fullWidth
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
            Create Account
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
        >
          Already have an account?{" "}
          <Link to="/" style={{ fontWeight: 600 }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
