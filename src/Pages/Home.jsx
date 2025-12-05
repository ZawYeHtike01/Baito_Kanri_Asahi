import { useState } from "react";
import { useApp } from "../App";
import { useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward, Flag } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { FormartDate } from "./Data";

export default function Home() {
  
  const {setSelectedDate,JapanseHolidays,currentDate, setCurrentDate } = useApp();
  const navigate = useNavigate();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handlePrevMonth = () => {
    const newDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1
  );
  setCurrentDate(newDate);
 
  };

  const handleNextMonth = () => {
    const newDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );
  setCurrentDate(newDate);
  
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isHolidays=(date)=>{
    if(!date) return false;
    const filterDate=JapanseHolidays.filter(i=> i.date === FormartDate(date));
    if(filterDate.length>0){
      return true;
    }else return false;
  }
  const isSunday=(day)=>{
    if(day==="Sat" || day==="Sun"){
      return true;
    }else return false;
  }

  const days = getDaysInMonth(currentDate);

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "50%" },
        height: "100vh",
        maxHeight: "600px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        marginTop: {xs:"55px",sm:"55px",md:"70px"},
      }}
    >
      
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "12px 16px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f8f9fa",
        }}
      >
        <IconButton onClick={handlePrevMonth}>
          <ArrowBack />
        </IconButton>

        <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>

        <IconButton onClick={handleNextMonth}>
          <ArrowForward />
        </IconButton>
      </Box>

      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f8f9fa",
        }}
      >
        {daysOfWeek.map((day) => (
          <Box
            key={day}
            sx={{
              p: "8px 4px",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "12px",
              color: isSunday(day)? "red":"#666",
              border:"1px solid #ddd"
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

    
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "repeat(6, 1fr)",
          flex: 1,
        }}
      >
        {days.map((date, index) => (
          
          <Box
            key={index}
            onClick={() => {
              if (date) {
                const dd=FormartDate(date);
                navigate("/home/worklist");
                setSelectedDate(dd);
              }
            }}
            sx={{
              backgroundColor: "white",
              p: "4px",
              cursor: date ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              border: "1px solid #ddd",
              transition: "0.2s",
              "&:hover": date && {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            {date && ( 
              <Box sx={{ textAlign: "center",display:"flex",flexDirection:"column",alignItems:"center" }}>
                <Box
                  sx={{
                    fontSize: "14px",
                    fontWeight: isToday(date) ? "700" : "400",
                    color: isToday(date) ? "white" : isHolidays(date)? "white": "#333",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isToday(date) ? "#1976d2" : isHolidays(date)? "red" : "transparent",
                  }}
                >
                  {date.getDate()}
                </Box>

                <Typography sx={{ fontSize: "12px" }}>(18:00-22:00)</Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
