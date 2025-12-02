import { Box,Typography,IconButton } from "@mui/material"
import { useApp } from "../App"
import { ArrowBack } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export default function WorkList(){
        const {selectedDate}=useApp()
        const navigate=useNavigate();
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
                <Typography sx={{textAlign:'center'}}>Public Holidays</Typography>
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