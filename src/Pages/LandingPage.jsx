import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo.png";
export default function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "BaitoKanri | バイト管理アプリ";

    const metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    metaDesc.content =
      "BaitoKanri はアルバイトのシフト管理、勤務時間、給料計算を簡単に行えるWebアプリです。学生向け。";
    document.head.appendChild(metaDesc);

    return () => {
      document.head.removeChild(metaDesc);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="BaitoKanri Logo"
        sx={{ width: 120, mb: 2 }}
      />
      <Typography variant="h2" gutterBottom>
        アルバイト管理をもっと簡単に
      </Typography>

      <Typography sx={{ maxWidth: 600, mb: 4 }}>
        BaitoKanri は、アルバイトのシフト管理・勤務時間の記録・
        給料計算を一括で行えるWebアプリです。
        日本でアルバイトをしている学生向けに設計されています。
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => navigate("/login")}>
          ログイン
        </Button>
        <Button variant="outlined" onClick={() => navigate("/signup")}>
          新規登録
        </Button>
      </Box>
    </Box>
  );
}
