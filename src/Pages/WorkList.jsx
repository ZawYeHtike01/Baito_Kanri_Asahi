import { Box,Typography,IconButton,Button,CircularProgress,TextField} from "@mui/material"
import { useApp } from "../App"
import { ArrowBack } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {List,ListItem,ListItemText,ListItemIcon} from "@mui/material";
import { doc,getDoc,setDoc,collection,getDocs,updateDoc,deleteField } from "firebase/firestore";
import { db,auth } from "../Firebase";
import { getHourDifference } from "./Data";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";


export default function WorkList(){
        const {selectedDate,JapanseHolidays,monthCache,setMonthCache,setGlobalMsg}=useApp()
        const navigate=useNavigate();
        const [y,m]=selectedDate.split("-");
        const key=`${y}-${m}`;
        const [loading,setLoading]=useState();
        const todayShifts = monthCache[key]?.[selectedDate] || {};
        const [model,setModel]=useState(false);
        const [work, setWork] = useState("");
        const [startTime, setStartTime] = useState(dayjs());
        const [endTime, setEndTime] = useState(dayjs());
        const [rest, setRest] = useState(dayjs().hour(0).minute(0));
        const [updateModel,setUpdateModel]=useState(false);
        const [salary,setSalary]=useState();
        const user=auth.currentUser;
        const filteredHoliday = JapanseHolidays.filter(i => i.date === selectedDate);
        const [modelMessage,setModelMessage]=useState({
            date:"",
            name:"",
        });

        const updateItem=async()=>{
            const [y,m]=selectedDate.split("-");
            const key=`${y}-${m}`;
            const q = doc(db, "shifts", user.uid, "workshifts", selectedDate);
            await updateDoc(q,{
                [work]:{start:startTime.format("HH:mm"),end:endTime.format("HH:mm"),rest:rest.minute(),salary:salary}
            })
            setMonthCache(prev => {
            return {
                ...prev,
                [key]: {
                ...(prev[key] || {}),
                [selectedDate]: {
                    ...(prev[key]?.[selectedDate] || {}),
                    [work]: {
                    ...(prev[key]?.[selectedDate]?.[work] || {}),
                        start: startTime.format("HH:mm"),
                        end: endTime.format("HH:mm"),
                        rest: rest.minute(),
                        salary:salary
                    }
                }
                }
            };
            });
        }
       
        const deleteItem=async(date,name)=>{
            console.log(date,name);
            const [y,m]=date.split("-");
            const key=`${y}-${m}`;
            const ref=doc(db,"shifts", user.uid, "workshifts", date)
            await updateDoc(ref,{
                [name]:deleteField()
            })

            setMonthCache(prev=>{
                if (!prev[key]?.[date]) return prev;
                const newMonth = { ...prev[key] };
                const newDay = { ...newMonth[date] };
                delete newDay[name];
                if (Object.keys(newDay).length === 0) {
                        delete newMonth[date];
                    } else {
                        newMonth[date] = newDay;
                }
                return {
                    ...prev,
                    [key]: newMonth
                };
            })
        }
        return(
        <Box sx={{
                width: {xs:"90%",sm:"50%",md:"30%"},
                height:600,
                position:"relative",
                border:"1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                borderRadius:5,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                marginTop: {xs:"70px",sm:"70px",md:"70px"},
        }}>
            {loading && (
                        <Box sx={{
                            position: "fixed",
                            width: "100%",
                            height: "100%",
                            background: "rgba(255, 255, 255, 0.4)",
                            backdropFilter: "blur(6px)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 2000
                        }}>
                            <CircularProgress size={70} />
                        </Box>
                    )}
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
            <Box sx={{width:{xs:"90%",sm:"90%",md:"85%"},overflow:"auto"}}>
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
                    {Object.keys(todayShifts).map((key, index) => {
                        const item=todayShifts[key];
                        return(
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
                        <Box sx={{flexGrow:1}} onClick={()=>{
                            setWork(key);
                            setStartTime(dayjs(item.start, "HH:mm"));
                            setEndTime(dayjs(item.end, "HH:mm"));
                            setRest(dayjs().hour(0).minute(item.rest || 0));
                            setSalary(Number(item.salary));
                            setUpdateModel(true)}}>
                            <Typography sx={{ fontWeight: 600, fontSize: "16px" }}>
                            {key}
                            </Typography>
                            <Typography sx={{ fontSize: "13px", color: "#ccc" }}>
                            {item.start}-{item.end}({getHourDifference(item.start,item.end,item.rest)})
                            </Typography>
                        </Box>
                        <IconButton onClick={()=>{setModel(true)
                            const message={
                                date:selectedDate,
                                name:key
                            }
                            setModelMessage(message)}
                        }
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
      )})}
    </List>
            </Box>
            <IconButton onClick={()=>{
                navigate("/home/worklist/addwork")}} sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                        bgcolor: "primary.dark",
                    },
                    position:"absolute",
                    bottom:16,
                    right:16,
            }}><AddIcon/></IconButton>
                    <Modal
                        open={model}
                        onClose={() => {setModel(false)}}
                        >
                        <Box
                            sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 3,
                            width: 300,
                            }}
                        >
                            <Typography variant="h6">
                            Are You Sure To Delete {modelMessage.name}
                            </Typography>
                            <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 3,
                                gap: 1,
                            }}
                            >
                            <Button
                                onClick={() => setModel(false)}
                                variant="outlined"
                            >
                                Close
                            </Button>

                            <Button
                                color="error"
                                variant="contained"
                                onClick={async()=>{
                                    setLoading(true);
                                    try{
                                       await deleteItem(modelMessage.date,modelMessage.name);
                                        setGlobalMsg("Deleted Successfully");
                                        setModel(false);
                                    }catch(e){
                                        console.log(e.message)
                                    }finally{
                                        setLoading(false)
                                    }
                                    }}
                            >
                                Delete
                            </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Modal
                        open={updateModel}
                        onClose={() => {setUpdateModel(false)}}
                        >
                        <Box
                            sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 3,
                            width: 300,
                            }}
                        >
                            <Box sx={{
                                display:"flex",
                                flexDirection:"column",
                                gap:2
                            }}>
                                <TextField
                                value={work}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                    disableUnderline: true,
                                }}
                                sx={{
                                    "& .MuiInputBase-input": {
                                    cursor: "default",
                                    },
                                }}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker 
                                        label="Start Time"
                                        value={startTime}
                                        onChange={(newValue) => setStartTime(newValue)}
                                    />

                                    <TimePicker 
                                        label="End Time"
                                        value={endTime}
                                        onChange={(newValue) => setEndTime(newValue)}
                                    />

                                    <TimePicker 
                                        label="Rest (minutes)"
                                        views={["minutes"]}
                                        value={rest}
                                        onChange={(newValue) => setRest(newValue)}
                                    />
                                </LocalizationProvider>
                            </Box>
                            
                            <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 3,
                                gap: 1,
                            }}
                            >
                            <Button
                                onClick={() => setUpdateModel(false)}
                                variant="outlined"
                            >
                                Close
                            </Button>
                            <Button
                                color="success"
                                variant="contained"
                                onClick={async()=>{
                                    setLoading(true)
                                    try{
                                        await updateItem();
                                        setUpdateModel(false);
                                        setGlobalMsg("Upadated Successfully");
                                    }catch(e){
                                        console.log(e.message);
                                    }finally{
                                        setLoading(false);
                                    }
                                }}
                            >
                                Update
                            </Button>
                            </Box>
                        </Box>
                    </Modal>
        </Box>
        )
}