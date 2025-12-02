import { useState } from "react";
import { useApp } from "../App";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {setSelectedDate}=useApp();
  const navigate=useNavigate();
 
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

 
  const days = getDaysInMonth(currentDate);

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      maxHeight: "600px",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif",
      marginTop:"25px",
      background: "rgba(255, 255, 255, 0.2)",  
			backdropFilter: "blur(10px)",             
			border: "1px solid rgba(255, 255, 255, 0.3)",
			boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      borderRadius:"10px"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f8f9fa"
      }}>
        <button
          onClick={handlePrevMonth}
          style={{
            padding: "6px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "white",
            cursor: "pointer",
            fontSize: "14px",
            minWidth: "40px"
          }}
        >
          ←
        </button>
        <h2 style={{ 
          margin: 0, 
          fontSize: "18px", 
          fontWeight: "600",
          whiteSpace: "nowrap"
        }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          onMouseEnter={(e) => {
               e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
            
                e.currentTarget.style.backgroundColor = "white";
             
            }}
          style={{
            padding: "6px 12px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            backgroundColor: "white",
            cursor: "pointer",
            fontSize: "14px",
            minWidth: "40px",
            fontWeight:"bolder"
          }}
        >
          →
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f8f9fa"
      }}>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            style={{
              padding: "8px 4px",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "12px",
              color: "#666"
            }}
          >
            {day}
          </div>
        ))}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(6, 1fr)",
        flex: 1,
      }}>
        {days.map((date, index) => (
          <div
            key={index}
            onClick={()=>{
              navigate("/home/worklist");
              setSelectedDate(date.toISOString().split('T')[0]); 
            }}
            style={{
              backgroundColor: "white",
              padding: "4px",
              cursor: date ? "pointer" : "default",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              transition: "background-color 0.2s",
              border:"1px solid #ddd",
              minHeight: "40px",
              ...(date && {
                ":hover": {
                  backgroundColor: "#f0f0f0"
                }
              })
            }}
            onMouseEnter={(e) => {
              if (date) e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              if (date) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            {date && (
              <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: isToday(date) ? "700" : "400",
                    color: isToday(date) ? "white" : "#333",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: isToday(date) 
                      ? "#1976d2"  
                      : "transparent"
                  }}
                >
                  {date.getDate()}
                </span>
                <span style={{fontSize:"12px",textAlign:"center"}}>
                 (18:00-22:00)
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}