import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  TextField,
  List,
  ListItem,
  Modal,
  Fab,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Update as UpdateIcon,
  HistoryToggleOff as TimeIcon,
  EventNote as CalendarIcon,
  WarningAmberRounded as WarningIcon,
} from "@mui/icons-material";

import { useApp } from "../../App";
import { getHourDifference } from "../../Pages/Data";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation } from "react-router-dom";

dayjs.extend(customParseFormat);

export default function StudentWorkList() {
  const { selectedDate, JapanseHolidays, monthCache } = useApp();
  const { state } = useLocation();
  const [y, m] = selectedDate.split("-");
  const monthKey = `${y}-${m}`;
  const todayShifts =
    monthCache[state.userId]?.[monthKey]?.[selectedDate] || {};
  const filteredHoliday = JapanseHolidays.filter(
    (i) => i.date === selectedDate
  );
  return (
    <Box
      sx={{
        width: { xs: "95%", sm: "450px", md: "400px" },
        maxHeight: { xs: "calc(100vh - 56px)", md: 650 },
        position: "relative",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "28px",
        display: "flex",
        flexDirection: "column",
        mt: "70px",
        mx: "auto",
        overflow: "hidden",
      }}
    >

      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <CalendarIcon color="primary" /> {selectedDate}
        </Typography>
        {filteredHoliday.length > 0 && (
          <Typography
            variant="caption"
            sx={{ color: "#ff5252", fontWeight: "bold" }}
          >
            {filteredHoliday[0].localName}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 2,
          py: 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.keys(todayShifts).map((key) => {
            const item = todayShifts[key];
            return (
              <ListItem
                key={key}
                sx={{
                  bgcolor: "rgba(25, 118, 210, 0.05)",
                  border: "1px solid rgba(25, 118, 210, 0.1)",
                  borderRadius: "16px",
                  px: 2.5,
                  py: 1.5,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.12)" },
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight="700" sx={{ color: "#1a237e" }}>
                    {key}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#1976D2",
                      fontWeight: 600,
                    }}
                  >
                    <TimeIcon sx={{ fontSize: 16 }} /> {item.start} - {item.end}
                    <Box component="span" sx={{ ml: 1, opacity: 0.6 }}>
                      ({getHourDifference(item.start, item.end, item.rest)})
                    </Box>
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
