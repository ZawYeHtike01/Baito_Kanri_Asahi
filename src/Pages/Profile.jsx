import { Box, Typography, Avatar, Divider } from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useApp } from "../App";

export default function Profile() {
  const { userData } = useApp();

  return (
    <Box
      sx={{
        width: { xs: "95%", md: "32%" },
        mx: "auto",
        mt: { xs: "60px", md: "80px" },
        borderRadius: "24px",
        height: "100vh",
        minHeight:"700px",
        maxHeight: "800px",
        overflow:"hidden",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
    >
      <Box
        sx={{
          height: "160px",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        <Avatar
          sx={{
            width: 96,
            height: 96,
            position: "absolute",
            bottom: -48,
            left: "50%",
            transform: "translateX(-50%)",
            border: "4px solid white",
            backgroundColor: "#9fa8da",
            fontSize: "36px",
          }}
        >
          {userData?.userName?.[0] || "U"}
        </Avatar>
      </Box>

      
      <Box sx={{ px: 3, pt: 7, pb: 4 }}>
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "18px",
            mb: 3,
          }}
        >
          Profile
        </Typography>
        <InfoRow
          icon={<BadgeOutlinedIcon />}
          label="Student No"
          value={userData?.studentNo || "-"}
        />
        <Divider sx={{ my: 2 }} />
        <InfoRow
          icon={<PersonOutlineIcon />}
          label="Name"
          value={userData?.userName || "-"}
        />
        <Divider sx={{ my: 2 }} />
        <InfoRow
          icon={<PersonOutlineIcon />}
          label="Katakana Name"
          value={userData?.userNameKatakana || "-"}
        />
        <Divider sx={{ my: 2 }} />
        <InfoRow
        icon={<HistoryEduOutlinedIcon />}
          label="School Year"
          value={userData?.schoolYear || "-"}
        />
         <Divider sx={{ my: 2 }} />
        <InfoRow
        icon={<HistoryEduOutlinedIcon />}
          label="Major"
          value={userData?.major || "-"}
        />
        <Divider sx={{ my: 2 }} />
        <InfoRow
        icon={<EmailOutlinedIcon />}
          label="Email"
          value={userData?.email || "-"}
        />
      </Box>
    </Box>
  );
}

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        background: "rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: "12px", color: "#777" }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);
