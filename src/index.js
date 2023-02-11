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
import { ProtectedLayout } from './components/Layouts/ProtectedLayout';
import { AuthProviderLayout } from './components/Layouts/AuthProviderLayout';
import Axios from 'axios';
import HomeLayout from './components/Layouts/HomeLayout';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthProviderLayout/>}
      loader = {() => {
        const response = Axios.get("http://localhost:5000/api/get-user", {
          withCredentials: true,
        });
        return defer({ response });
      }}
    >
      <Route element={<HomeLayout/>} >
        <Route path ="/" element={<Login/>} />
      </Route>
      <Route element={<ProtectedLayout/>} >
        <Route path = "/map" element = {<App />}/>
      </Route>
    </Route>
  )
);
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router = {router}/>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
