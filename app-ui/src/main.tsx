import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/App';
import Login from './pages/LoginComponent';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  defer
} from "react-router-dom";
import {
  RecoilRoot,
} from 'recoil';
import { ProtectedLayout, AdminLayout } from './components/Layouts/ProtectedLayout';
import { AuthProviderLayout } from './components/Layouts/AuthProviderLayout';
import Axios from 'axios';
import HomeLayout from './components/Layouts/HomeLayout';
import PageNotFound from './pages/404NotFound';
import AdminPortal from './pages/AdminPortal/AdminPortal';

// Setting up the router using createBrowserRouter and specifying the routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthProviderLayout/>}
      // Checking if user is authenticated using Axios
      loader = {() => {
        const response = Axios.get(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/get-user", {
          withCredentials: true,
        });
        return defer({ response });
      }}
      // Rendering 404 page if there's an error
      errorElement={<PageNotFound/>}
    >
      <Route element={<HomeLayout/>} >
        <Route path ="/" element={<Login/>} />
      </Route>
      <Route element={<ProtectedLayout/>} >
        <Route path = "/map" element = {<App />}/>
      </Route>
      <Route element={<AdminLayout/>} >
          <Route path ="/adminportal" element = {<AdminPortal />} />
        </Route>
    </Route>
  )
);

// Rendering the application with the router and global state management using Recoil
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router = {router}/>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
