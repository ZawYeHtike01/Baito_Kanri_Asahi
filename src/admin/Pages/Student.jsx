import { Box } from "@mui/material";
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

const paginationModel = { page: 0, pageSize: 10 };
export default function Student() {
  const navigate = useNavigate();
  const { student } = useApp();
  return (
    <Box
      sx={{
        marginTop: { xs: "55px", sm: "55px", md: "70px" },
        width: "80%",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        height: "100vh",
        maxHeight: "600px",
      }}
    >
      <DataGrid
        rows={student}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20]}
        onRowClick={(params) => {
          navigate(`/student/${params.row.studentNo}`, {
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
