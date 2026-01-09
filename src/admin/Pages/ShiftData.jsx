import { Box,Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  doc,
  query,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../Firebase";
import { useApp } from "../../App";
import { useNavigate } from "react-router-dom";


const columns = [
  { field: "id", headerName: "No", width: 70 },
  { field: "studentNo", headerName: "StudentNo", width: 120 },
  { field: "userName", headerName: "Name", width: 200 },
  { field: "userNameKatakana", headerName: "Katakana", width: 200 },
  {
    field: "schoolYear",
    headerName: "School Year",
    width: 150,
  },
  {
    field: "major",
    headerName: "Major",
    width: 200,
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
];


export default function ShiftData() {
  const navigate = useNavigate();
  const { student, studentGridState, setStudentGridState } = useApp();
  return (
    <Box
     sx={{
        mt: { xs: "56px", md: "72px" },
        width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
        mx: "auto",
        background: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(12px)",
        borderRadius: { xs: 0, sm: 4 },
        border: "1px solid rgba(255,255,255,0.18)",
        maxHeight: { xs: "calc(100vh - 56px)", md: 650 },
        overflow: "hidden",
        // px:3
      }}
    >
      {/* <Typography variant="h5" mb={2}>
          Student's Shift Data
        </Typography> */}
      <DataGrid
        rows={student}
        columns={columns}
        paginationModel={studentGridState.paginationModel}
        onPaginationModelChange={(m) =>
          setStudentGridState((p) => ({ ...p, paginationModel: m }))
        }
        filterModel={studentGridState.filterModel}
        onFilterModelChange={(m) =>
          setStudentGridState((p) => ({ ...p, filterModel: m }))
        }
        sortModel={studentGridState.sortModel}
        onSortModelChange={(m) =>
          setStudentGridState((p) => ({ ...p, sortModel: m }))
        }
        onRowClick={(params) => {
          navigate(`/shiftdata/${params.row.studentNo}`, {
            state: params.row,
          });
        }}
        sx={{
          border: 0,
          "&:hover": {
            cursor: "pointer",
          },
        }}
      />
    </Box>
  );
}
