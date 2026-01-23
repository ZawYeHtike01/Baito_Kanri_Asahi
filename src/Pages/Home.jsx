import { useState } from "react";
import { useApp } from "../App";
import { useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward, Flag, Weekend } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { getHourDifference } from "./Data";
import {
  Box,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
} from "@mui/material";
import { FormartDate } from "./Data";
import { db } from "../Firebase";
import { auth } from "../Firebase";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect } from "react";
import {
  collection,
  doc,
  query,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const {
    monthCache,
    setMonthCache,
    setSelectedDate,
    JapanseHolidays,
    currentDate,
    setCurrentDate,
    total,
    setTotal,
    checkHour,
    setCheckHour,
  } = useApp();
  const navigate = useNavigate();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [sal, setSal] = useState();
  const [overtw, setOvertw] = useState([]);
  const [overfw, setOverfw] = useState([]);

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
  useEffect(() => {
    const key = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const monthData = monthCache[key];
    if (!monthData) {
      setTotal(0);
      setSal(0);
      return;
    }
    let sum = 0;
    let ss = 0;
    Object.values(monthData).forEach((dayShift) => {
      Object.values(dayShift).forEach((s) => {
        const hours = getHourDifference(s.start, s.end, s.rest);
        sum += hours;
        ss += hours * s.salary;
      });
    });
    setSal(Number(ss.toFixed(0)));
    setTotal(Number(sum.toFixed(1)));
  }, [monthCache, currentDate]);
  const getItem = async () => {
    const user = auth.currentUser;
    const key = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    if (monthCache[key]) return monthCache[key];
    const firstDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-01`;
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const lastDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    try {
      const workshiftsCol = collection(
        doc(db, "shifts", user.uid),
        "workshifts"
      );
      const q = query(
        workshiftsCol,
        where(documentId(), ">=", firstDate),
        where(documentId(), "<=", lastDate)
      );
      const snap = await getDocs(q);
      const map = {};
      snap.forEach((d) => (map[d.id] = d.data()));

      setMonthCache((prep) => {
        return {
          ...prep,
          [key]: map,
        };
      });
      return map;
    } catch (e) {
      console.log(e.message);
    }
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isHolidays = (date) => {
    if (!date) return false;
    const filterDate = JapanseHolidays.filter(
      (i) => i.date === FormartDate(date)
    );
    if (filterDate.length > 0) {
      return true;
    } else return false;
  };
  const isSunday = (day) => {
    if (day === "Sat" || day === "Sun") {
      return true;
    } else return false;
  };

  const days = getDaysInMonth(currentDate);
  const formatDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const getMonthKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const getSpecialRange = (weekStart, weekEnd) => {
    if (!checkHour?.length) return null;

    for (const r of checkHour) {
      const rStart = new Date(r.start);
      const rEnd = new Date(r.end);

      if (weekStart <= rEnd && weekEnd >= rStart) {
        return {
          start: rStart,
          end: rEnd,
        };
      }
    }

    return null;
  };

  const checkOver = () => {
    if (!checkHour?.length || !monthCache) return;

    const over28 = new Set();
    const over40 = new Set();

    const year = currentDate.getFullYear();
    let cursor = new Date(`${year}-01-01`);
    const yearEnd = new Date(`${year + 1}-01-31`);
    while (cursor <= yearEnd) {
      const weekStart = new Date(cursor);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      let totalHours = 0;
      let isSpecialWeek = false;

      const range = getSpecialRange(weekStart, weekEnd);

      if (range) {
        isSpecialWeek = true;
        if (range.end < weekEnd) {
          weekEnd.setTime(range.end.getTime());
        }
        if (range.start > weekStart) {
          weekStart.setTime(range.start.getTime());
        }
      }

      for (
        let d = new Date(weekStart);
        d <= weekEnd;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = formatDate(d);
        const monthKey = getMonthKey(d);
        const dayShift = monthCache[monthKey]?.[dateStr];

        if (!dayShift) continue;

        Object.values(dayShift).forEach((job) => {
          if (!job.start || !job.end) return;
          totalHours += getHourDifference(job.start, job.end, job.rest);
        });
      }

      if (isSpecialWeek && totalHours > 40) {
        for (
          let d = new Date(weekStart);
          d <= weekEnd;
          d.setDate(d.getDate() + 1)
        ) {
          if (!overfw.some((e) => e === formatDate(d)))
            over40.add(formatDate(d));
        }
      } else if (!isSpecialWeek && totalHours > 28) {
        for (
          let d = new Date(weekStart);
          d <= weekEnd;
          d.setDate(d.getDate() + 1)
        ) {
          if (!overtw.some((e) => e === formatDate(d)))
            over28.add(formatDate(d));
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    setOvertw((prev) => [...prev, ...over28]);
    setOverfw((prev) => [...prev, ...over40]);
  };

  const getLimit = async () => {
    const q = collection(db, "time","holiday","hours");
    const snap = await getDocs(q);
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCheckHour(data || {});
  };
  useEffect(() => {
    try {
      getLimit();
      getItem();
    } catch (e) {
      console.log(e.message);
    }
  }, [currentDate]);

  useEffect(() => {
    if (!checkHour) return;
    checkOver();
  }, [checkHour, monthCache, currentDate]);

  const itOver = (date) => {
    if (!date) return false;

    const d = FormartDate(date);

    return overfw.some((e) => e === d) || overtw.some((e) => e === d);
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "50%" },
        maxHeight: { xs: "calc(100vh - 56px)", md: 650 },
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        // boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        marginTop: { xs: "55px", sm: "55px", md: "70px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "12px 16px",
          borderBottom: "1px solid #ddd",
          // backgroundColor: "#f8f9fa",
        }}
      >
        <IconButton onClick={handlePrevMonth}>
          <ArrowBack />
        </IconButton>
        <Box textAlign={"center"}>
          <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#ccc" }}>
            This Month Total Hours : {total} hours
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#ccc" }}>
            Estimate Salary : {sal} ￥
          </Typography>
        </Box>
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
              color: isSunday(day) ? "red" : "#666",
              border: "1px solid #ddd",
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
                const dd = FormartDate(date);
                navigate("/home/worklist");
                setSelectedDate(dd);
              }
            }}
            sx={{
              backgroundColor: itOver(date) ? "red" : "white",
              p: "4px",
              cursor: date ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              border: "1px solid #ddd",
              color: itOver(date) ? "white" : "black",
              transition: "0.2s",
              "&:hover": date && {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            {date &&
              (() => {
                const dd = FormartDate(date);

                const key = `${currentDate.getFullYear()}-${String(
                  currentDate.getMonth() + 1
                ).padStart(2, "0")}`;
                const shift = monthCache[key]?.[dd];

                let time = "";
                if (shift && Object.keys(shift).length > 0) {
                  const firstKey = Object.keys(shift)[0];
                  const s = shift[firstKey];
                  time = `(${s.start}-${s.end})`;
                }

                return (
                  <Box
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "14px",
                        fontWeight: isToday(date) ? "700" : "400",
                        color: isToday(date)
                          ? "white"
                          : isHolidays(date)
                          ? "white"
                          : "#333",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isToday(date)
                          ? "#1976d2"
                          : isHolidays(date)
                          ? "red"
                          : "transparent",
                      }}
                    >
                      {date.getDate()}
                    </Box>
                    <Typography sx={{ fontSize: "12px" }}>{time}</Typography>
                  </Box>
                );
              })()}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
