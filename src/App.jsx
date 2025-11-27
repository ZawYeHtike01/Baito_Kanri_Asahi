import { useState } from 'react'
import { createContext } from 'react'
import { useContext } from 'react'
import { CssBaseline } from '@mui/material';
import Login from './Pages/Login';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Template from './Template';


const AppContext=createContext();

const router = createBrowserRouter([
	{
		path: "/",
		element: <Template />,
		children: [
			{
				path: "/login",
				element: <Login />,
			},
		],
	},
]);

export function useApp(){
  return useContext(AppContext);
}

function App() {
  const [auth, setAuth] = useState(false);
  return (
    <AppContext.Provider value={{auth,setAuth}}>
      <RouterProvider router={router} />
      <CssBaseline/>
    </AppContext.Provider>
  )
}

export default App
