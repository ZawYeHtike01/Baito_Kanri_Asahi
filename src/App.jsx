import { useState } from 'react'
import { createContext } from 'react'
import { useContext } from 'react'
import { CssBaseline } from '@mui/material';
import Login from './Pages/Login';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Template from './Template';
import ProtectedRoute from './ProtoctedRouted';
import Home from './Pages/Home';


const AppContext=createContext();

const router = createBrowserRouter([
	{
		path: "/",
		element: <Template />,
		children: [
			{
				path: "/",
				element: <Login />,
			},
			{
				path:"/home",
				element:(
					<ProtectedRoute>
						<Home/>
					</ProtectedRoute>
				)

			}
		],
	},
]);

export function useApp(){
  return useContext(AppContext);
}

function App() {
  const [auth, setAuth] = useState(true);
  const [showDrawer,setShowDrawer]=useState(false);
  const [globalMsg, setGlobalMsg ]=useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  return (
    <AppContext.Provider value={{auth,setAuth,showDrawer,setShowDrawer,globalMsg, setGlobalMsg,selectedDate, setSelectedDate}}>
      <RouterProvider router={router} />
      <CssBaseline/>
    </AppContext.Provider>
  )
}

export default App
