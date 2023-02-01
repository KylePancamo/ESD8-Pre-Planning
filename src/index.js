import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/Login/LoginComponent';
import { BrowserRouter } from "react-router-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  RecoilRoot,
} from 'recoil';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "map",
    element: <App/>
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router = {router}/>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
