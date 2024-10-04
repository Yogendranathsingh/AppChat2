import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import router from './Routes/Index.jsx';
import { RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './Redux/Store.js';

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
);