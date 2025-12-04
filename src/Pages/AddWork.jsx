import { Box } from "@mui/material"
export default function AddWork(){
    return (
        <Box sx={{
             width: {xs:"90%",sm:"50%",md:"27%"},
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
            Add Work Page
        </Box>
    )
}