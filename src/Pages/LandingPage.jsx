import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import {
  AccountBalanceWallet,
  AccessTime,
  QueryStats,
  CloudDone,
  Storage,
  Language,
  ArrowForward,
  Computer,
} from "@mui/icons-material";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getIdTokenResult } from "firebase/auth";
import { useApp } from "../App";
import { auth, db } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const FeatureCard = ({ icon, title, desc }) => (
  <Card
    sx={{
      p: 4,
      height: "100%",
      bgcolor: "rgba(25, 118, 210, 0.04)",
      border: "1px solid rgba(25, 118, 210, 0.1)",
      borderRadius: 4,
      transition: "0.3s",
      "&:hover": {
        transform: "translateY(-10px)",
        border: "1px solid #1976d2",
      },
    }}
  >
    <Box sx={{ color: "#1976d2", mb: 2 }}>{icon}</Box>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {desc}
    </Typography>
  </Card>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { setisAuth, setUserData, setAdmin, setGlobalMsg } = useApp();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setisAuth(false);
        setUserData(null);
        setAdmin(false);
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
    });

    return () => unsub();
  }, []);
  return (
    <Box sx={{ bgcolor: "#fff", color: "#1a202c" }}>
      <Box
        sx={{
          pt: { xs: 10, md: 15 },
          pb: 10,
          textAlign: "center",
        }}
      >
        <Box component="img" src={logo} sx={{ width: 90, mb: 1 }} />
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ color: "#1976d2", fontWeight: "bold", letterSpacing: 2 }}
          >
            留学生・学生のためのバイト管理アプリ
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mt: 2,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "4rem" },
              color: "#0d47a1",
            }}
          >
            給料計算を、
            <br />
            <span style={{ color: "#1976d2" }}>もっとスマートに、正確に。</span>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 5, fontWeight: 400, px: { xs: 2, md: 0 } }}
          >
            シフト管理から、目標金額の進捗確認まで。
            <br />
            BaitoKanriはブルーの直感的な操作であなたの努力をサポートします。
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              onClick={() => navigate("/login")}
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#1976d2",
                px: 6,
                py: 2,
                borderRadius: 2,
                fontSize: "1.1rem",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              無料で始める
            </Button>
            {/* <Button
              variant="outlined"
              size="large"
              sx={{
                px: 6,
                py: 2,
                borderRadius: 2,
                borderColor: "#1976d2",
                color: "#1976d2",
              }}
            >
              使い方を見る
            </Button> */}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          System Architecture
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: "center", bgcolor: "#f8fafc" }}
            >
              <Computer color="primary" />
              <Typography variant="subtitle2" fontWeight="bold">
                Frontend
              </Typography>
              <Typography variant="caption">React / MUI / Bootstrap</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: "center", bgcolor: "#f8fafc" }}
            >
              <CloudDone color="primary" />
              <Typography variant="subtitle2" fontWeight="bold">
                Cloud Backend
              </Typography>
              <Typography variant="caption">
                Firebase Auth / Functions
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: "center", bgcolor: "#f8fafc" }}
            >
              <Storage color="primary" />
              <Typography variant="subtitle2" fontWeight="bold">
                Database
              </Typography>
              <Typography variant="caption">SQL Logic / Firestore</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<AccountBalanceWallet fontSize="large" />}
              title="給料自動計算"
              desc="深夜手当や交通費も詳細に設定可能。入力した瞬間に予想月収が確定します。"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<AccessTime fontSize="large" />}
              title="直感的なシフト管理"
              desc="ブルーを基調とした見やすいカレンダーで、バイトの予定を一括管理。"
            />
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#f1f5f9", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4, fontWeight: "bold", letterSpacing: 1 }}
          >
            POWERED BY MODERN TECH
          </Typography>
          <Stack
            direction="row"
            spacing={6}
            justifyContent="center"
            alignItems="center"
            sx={{ opacity: 0.6, flexWrap: "wrap", gap: 2 }}
          >
            <Typography variant="h5" fontWeight="900" color="#1976d2">
              REACT
            </Typography>
            <Typography variant="h5" fontWeight="900" color="#0d47a1">
              FIREBASE
            </Typography>
            <Typography variant="h5" fontWeight="900" color="#1976d2">
              MUI
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="md" sx={{ py: 15, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="#0d47a1">
          さあ、スマートなバイト生活を始めましょう。
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          安心・安全なデータ管理を実現。
        </Typography>
        <Button
          onClick={() => navigate("/login")}
          variant="contained"
          size="large"
          sx={{
            bgcolor: "#1976d2",
            px: 10,
            py: 2,
            borderRadius: 2,
            boxShadow: "0 4px 14px 0 rgba(25,118,210,0.39)",
          }}
        >
          今すぐログイン
        </Button>
      </Container>
      <Box sx={{ bgcolor: "#0d47a1", py: 3, mt: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "rgba(255,255,255,0.8)" }}
          >
            © {new Date().getFullYear()} BaitoKanri. All rights reserved. <br />
            Designed & Developed by{" "}
            <strong
              style={{ cursor: "pointer", textDecoration: "none" }}
              onClick={() => window.open("https://zawyehtike.site", "_blank")}
            >
              Zaw Ye Htike
            </strong>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
