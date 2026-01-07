import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../../App";

const columns = [
  { field: "id", headerName: "No", width: 70 },
  { field: "studentNo", headerName: "StudentNo", width: 120 },
  { field: "userName", headerName: "Name", width: 200 },
  { field: "userNameKatakana", headerName: "Katakana", width: 200 },
  { field: "schoolYear", headerName: "School Year", width: 150 },
  { field: "major", headerName: "Major", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
];

export default function Student() {
  const navigate = useNavigate();
  const { student, studentGridState, setStudentGridState } = useApp();

  return (
    <Box
      sx={{
        marginTop: { xs: "55px", sm: "55px", md: "70px" },
        width: { xs: "100%", sm: "100%", md: "90%" },
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        height: "100vh",
        maxHeight: "600px",
        px: 2,
      }}
    >
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
