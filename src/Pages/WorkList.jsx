import { Box,Typography,IconButton } from "@mui/material"
import { useApp } from "../App"
import { ArrowBack } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {List,ListItem,ListItemText,ListItemIcon} from "@mui/material";

export default function WorkList(){
        const {selectedDate,JapanseHolidays}=useApp()
        const navigate=useNavigate();
        const schedules = [
            { name: "Kura", time: "22:00-23:00" },
            { name: "Work", time: "18:00-22:00" },
            { name: "Meeting", time: "14:00-15:30" },
            { name: "Kura", time: "22:00-23:00" },
            
            ];
        const filteredHoliday = JapanseHolidays.filter(i => i.date === selectedDate);
        return(
        <Box sx={{
                width: {xs:"90%",sm:"50%",md:"35%"},
                height:550,
                position:"relative",
                border:"1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                borderRadius:5,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                marginTop: {xs:"70px",sm:"70px",md:"70px"},
        }}>
            <Box sx={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                mt:2,

            }}>
                
                <Typography sx={{ flexGrow: 1,textAlign:'center' }}>{selectedDate || "No date selected"}</Typography>
                
            </Box>
            <Box>
                <Typography sx={{textAlign:'center'}}>{filteredHoliday.length > 0 ? filteredHoliday[0].localName : ""}</Typography>
            </Box>
            <Box sx={{width:{xs:"90%",sm:"90%",md:"75%"},overflow:"auto"}}>
                <List
                    sx={{
                        width: "100%",
                        mt: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5
                    }}
                    >
                    {schedules.map((item, index) => (
                        <ListItem
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 3,
                            py: 1.5,
                            background: "#1976D2",
                            borderRadius: "12px",
                            transition: "0.3s",color:"white",
                            "&:hover": {
                            opacity:0.8,cursor:"pointer",
                            transform: "translateY(-2px)",
                            }
                        }}
                        >
                        <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: "16px" }}>
                            {item.name}
                            </Typography>
                            <Typography sx={{ fontSize: "13px", color: "#ccc" }}>
                            {item.time}
                            </Typography>
                        </Box>

                        <IconButton
                            edge="end"
                            aria-label="delete"
                            sx={{
                            color: "#fff",
                            transition: "0.3s",
                            "&:hover": { color: "#ff4d4f" },
                            }}
                        >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
                
                
            </Box>
            <IconButton sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                        bgcolor: "primary.dark",
                    },
                    position:"absolute",
                    bottom:16,
                    right:16,
            }}><AddIcon/></IconButton>
        </Box>
        )
}