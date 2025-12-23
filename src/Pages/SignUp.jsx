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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../Firebase";
import { setDoc, doc } from "firebase/firestore";
import { getDocs, collection } from "firebase/firestore";
import { useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setGlobalMsg, course, setCourse } = useApp();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmpasswordRef = useRef();
  const nameRef = useRef();
  const katakanaRef = useRef();
  const stunoRef = useRef();
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
    async function getCourse() {
      const ref = collection(db, "course");
      const snap = await getDocs(ref);
      const data = {};
      snap.forEach((d) => (data[d.id] = d.data()));
      setCourse(data);
    }
    getCourse();
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
      <Box component="img" src={logo} alt="Logo" sx={{ width: 120, mb: 2 }} />
      <Typography variant="h3">Sign Up</Typography>
      <Alert severity="warning" sx={{ mt: 2 }}>
        All fields required
      </Alert>
      <form
        style={{ width: "75%" }}
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const newErrors = {
            name: !nameRef.current.value,
            katakana: !/^[ァ-ンヴー・ー\s]+$/.test(katakanaRef.current.value),
            email: !emailRef.current.value,
            major: !major,
            password: !passwordRef.current.value,
            stuno: !stunoRef.current.value || !studentNoRegex.test(stunoRef.current.value),
            schoolyear: !schoolyear,
            confirmPassword:
              passwordRef.current.value !== confirmpasswordRef.current.value ||
              !confirmpasswordRef.current.value,
          };
          setErrors(newErrors);
          const hasError = Object.values(newErrors).some(Boolean);
          if (hasError) {
            setLoading(false);
            return;
          }
          try {
            const userData = await createUserWithEmailAndPassword(
              auth,
              emailRef.current.value,
              passwordRef.current.value
            );
            const user = userData.user;
            const userRef = doc(db, "users", user.uid);
            await setDoc(
              userRef,
              {
                userName: nameRef.current.value,
                userNameKatakana: katakanaRef.current.value,
                email: emailRef.current.value,
                major: major,
                studentNo: stunoRef.current.value,
                schoolYear: schoolyear,
              },
              { merge: true }
            );
            setGlobalMsg("Sign Up Successfully");
            navigate("/");
          } catch (f) {
            if (f.code === "auth/email-already-in-use") {
              setErrors((prev) => ({ ...prev, email: true }));
              const hasError = Object.values(errors).some(Boolean);
              if (hasError) {
                setGlobalMsg("This Email is already used");
                return;
              }
              return;
            }
            console.log(f.message);
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
            id="outlined-basic"
            inputRef={nameRef}
            label="Name"
            variant="outlined"
            fullWidth
            error={errors.name}
            helperText={errors.name ? "Please fill the name" : ""}
          />
          <TextField
            id="outlined-basic"
            inputRef={katakanaRef}
            label="Katakana"
            variant="outlined"
            fullWidth
            error={errors.katakana}
            inputProps={{ lang: "ja" }}
             helperText={errors.katakana ? "Must be Katakana" : ""}
            onBlur={(e) => {
              const converted = e.target.value.replace(
                /[\u3041-\u3096]/g,
                (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60)
              );
              e.target.value = converted;
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="Year">Enrollment Year</InputLabel>
            <Select
              error={errors.schoolyear}
              labelId="work-label"
              value={schoolyear}
               helperText={errors.schoolyear ? "Please Choose Year" : ""}
              label="Work"
              onChange={(e) => {
                setSchoolyear(e.target.value);
                setMajor("");
              }}
            >
              <MenuItem value="">
                <em>Select year</em>
              </MenuItem>
              {Object.keys(course).map((k) => {
                return (
                  <MenuItem key={k} value={k}>
                    {k}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="major">Major</InputLabel>
            <Select
              error={errors.major}
              labelId="major"
              value={major}
            helperText={errors.major ? "Please Choose Major" : ""}
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
          </FormControl>
          <TextField
            id="outlined-basic"
            inputRef={stunoRef}
            label="Student No"
            variant="outlined"
            fullWidth
            error={errors.stuno}
             helperText={errors.stuno ? "Format Eg: G25016" : ""}
          />
          <TextField
            inputRef={emailRef}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            fullWidth
            error={errors.email}
             helperText={errors.email ? "Please fill the Email" : ""}
          />
          <TextField
            inputRef={passwordRef}
            type={showPassword ? "text" : "password"}
            id="outlined-basic"
            label="Password"
            variant="outlined"
            fullWidth
            error={errors.password}
             helperText={errors.password ? "Please fill the Password" : ""}
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
          <TextField
            inputRef={confirmpasswordRef}
            type={showPassword ? "text" : "password"}
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            error={errors.confirmPassword}
             helperText={errors.confirmPassword ? "Password and Confirm Password are must be same" : ""}
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
            Register
          </Button>
        </Box>
      </form>
      <Typography sx={{ mt: 2, textAlign: "center" }}>
        Already have an account?
        <Link to="/">Login</Link>
      </Typography>
    </Box>
  );
}
