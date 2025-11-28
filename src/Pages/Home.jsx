import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { useApp } from "../App";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekdaysMin: ["日", "月", "火", "水", "木", "金", "土"]
});
export default function Home(){
    const{setSelectedDate}=useApp();
  return (
    <Box sx={{mt:1}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar defaultValue={dayjs()} sx={{ transform: {xs:"scale(1.3)",sm:"scale(1.4)",md:"scale(1.7)"},
                transformOrigin: "center",
                "& .MuiDayCalendar-monthContainer": {
                height: "auto",
                
                },
                "& .MuiDayCalendar-weekContainer": {
                height: "auto",
                
                },
                "& .MuiPickersDay-root": {
                border:"1px solid black",
                 borderRadius: 1,
                 
                },
                border:"1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                padding:0,
                borderRadius:3,
                "& .MuiDayCalendar-weekDayLabel:nth-of-type(7)": {
                color: "red",
                fontWeight: "bold",
                },
                "& .MuiDayCalendar-weekDayLabel:nth-of-type(1)": {
                color: "red",
                fontWeight: "bold",
                },
            }} onChange={(newValue)=>{
                const formmed=dayjs(newValue).format("YYYY-MM-DD");
                setSelectedDate(formmed);
            }}
            />
        </LocalizationProvider>
    </Box>
  );
}