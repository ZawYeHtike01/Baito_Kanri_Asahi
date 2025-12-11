import { useState } from 'react'
import { createContext } from 'react'
import { useContext } from 'react'
import { CssBaseline } from '@mui/material';
import Login from './Pages/Login';
import { RouterProvider,createHashRouter } from "react-router-dom";
import Template from './Template';
import ProtectedRoute from './ProtoctedRouted';
import Home from './Pages/Home';
import WorkList from './Pages/WorkList';
import GetJapaneseHolidays from './Pages/Data';
import { useEffect } from 'react';
import AddWork from './Pages/AddWork';
import SignUp from './Pages/SignUp';
const AppContext=createContext();

const routes = [
  {
    path: "/",
    element: <Template />,
    children: [
      {
        path: "/",
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
        path:"/home/worklist/addwork",
        element:(
          <ProtectedRoute>
            <AddWork/>
          </ProtectedRoute>
        )
      },{
        path:"/signup",
        element:(
            <SignUp/>
        )
      }
    ],
  },
];
const router = createHashRouter(routes);

export function useApp(){
  return useContext(AppContext);
}

function App() {
  const [auth, setAuth] = useState(false);
  const [showDrawer,setShowDrawer]=useState(false);
  const [globalMsg, setGlobalMsg ]=useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [JapanseHolidays,setJapaneseHolidays]=useState([]);
  const [userData,setUserData]=useState();
  useEffect(() => {
       async function fetchHolidays() {
      const year = currentDate.getFullYear();
        const holidays = await GetJapaneseHolidays(year);
        setJapaneseHolidays(holidays);
      }
      fetchHolidays();
  }, [currentDate]);
  
  return (
    <AppContext.Provider value={{userData,setUserData,currentDate, setCurrentDate,JapanseHolidays,setJapaneseHolidays,auth,setAuth,showDrawer,setShowDrawer,globalMsg, setGlobalMsg,selectedDate, setSelectedDate}}>
     
		<RouterProvider router={router} />
	  
      <CssBaseline/>
    </AppContext.Provider>
  )
}

export default App
