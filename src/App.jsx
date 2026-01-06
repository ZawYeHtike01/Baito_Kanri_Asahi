import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { CssBaseline } from "@mui/material";
import Login from "./Pages/Login";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Template from "./Template";
import ProtectedRoute from "./ProtoctedRouted";
import Home from "./Pages/Home";
import WorkList from "./Pages/WorkList";
import GetJapaneseHolidays from "./Pages/Data";
import { useEffect } from "react";
import AddWork from "./Pages/AddWork";
import SignUp from "./Pages/SignUp";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./Firebase";
import { auth } from "./Firebase";
import Profile from "./Pages/Profile";
import LandingPage from "./Pages/LandingPage";
import CheckWeek from "./Pages/CheckWeek";
import WorkSpace from "./Pages/WorkSpace";
import AdminHome from "./admin/Pages/AdminHome";
import AdminRoute from "./AdminProctedRouted";
const AppContext = createContext();

const routes = [
  {
    path: "/",
    element: <Template />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/worklist",
        element: (
          <ProtectedRoute>
            <WorkList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/worklist/addwork",
        element: (
          <ProtectedRoute>
            <AddWork />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkweek",
        element: (
          <ProtectedRoute>
            <CheckWeek />
          </ProtectedRoute>
        ),
      },
      {
        path: "/workspace",
        element: (
          <ProtectedRoute>
            <WorkSpace />
          </ProtectedRoute>
        ),
      },
      {
        path: "/adminhome",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
    ],
  },
];
const router = createHashRouter(routes);

export function useApp() {
  return useContext(AppContext);
}

function App() {
  const [isauth, setisAuth] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [globalMsg, setGlobalMsg] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [JapanseHolidays, setJapaneseHolidays] = useState([]);
  const [userData, setUserData] = useState();
  const [workname, setWorkName] = useState([]);
  const [monthCache, setMonthCache] = useState({});
  const [total, setTotal] = useState();
  const [checkHour, setCheckHour] = useState({});
  const [course, setCourse] = useState({});
  const [admin, setAdmin] = useState(false);
  const [student,setStudent]=useState({});
  const [shift,setShift]=useState({});
  const [time,setTime]=useState({});
  useEffect(() => {
    async function fetchHolidays() {
      const year = currentDate.getFullYear();
      const holidays = await GetJapaneseHolidays(year);
      setJapaneseHolidays(holidays);
    }
    fetchHolidays();
  }, [currentDate]);
  useEffect(() => {
    async function fetchWorks() {
      const user = auth.currentUser;
      if (!user) return;
      const worksRef = collection(db, "worksname", user.uid, "works");
      const snap = await getDocs(worksRef);
      const list = snap.docs.map((doc) => ({
        work: doc.id,
        ...doc.data(),
      }));
      setWorkName(list);
    }

    fetchWorks();
  }, [isauth]);

  useEffect(() => {}, [course, workname]);
  return (
    <AppContext.Provider
      value={{
        admin,
        setAdmin,
        course,
        setCourse,
        checkHour,
        setCheckHour,
        total,
        setTotal,
        monthCache,
        setMonthCache,
        workname,
        setWorkName,
        userData,
        setUserData,
        currentDate,
        setCurrentDate,
        JapanseHolidays,
        setJapaneseHolidays,
        isauth,
        setisAuth,
        showDrawer,
        setShowDrawer,
        globalMsg,
        setGlobalMsg,
        selectedDate,
        setSelectedDate,
      }}
    >
      <RouterProvider router={router} />
      <CssBaseline />
    </AppContext.Provider>
  );
}

export default App;
