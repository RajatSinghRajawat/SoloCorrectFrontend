import React, { createContext, useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
// import ProfilePage from './components/ProfilePage';
import { ToastContainer } from "react-toastify";
import AccountProfile from "./components/AccountProfile";
import Blogs from "./components/Blogs";
import AddBlogs from "./components/AddBlogs";
import AllBlogs from "./AllBlogs";
import Tech from "./components/Tech";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Events from "./components/Events";
import AddEvents from "./components/AddEvents";
import CityStates from "./components/CityStates";

const myData = createContext()
const App = () => {
  const [state,setState] = useState({city:"",state:""})

  return (
    <myData.Provider  value={[state,setState]}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />.
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<AccountProfile />} />
            <Route path="/tech" element={<Tech />} />
            <Route path="/blogs/:id" element={<Blogs />} />
            <Route path="/allblogs" element={<AllBlogs />} />
            <Route path="/add/blogs" element={<AddBlogs />} />
          </Route>
          <Route path="/events" element={<Events />} />
          <Route path="/add/Events" element={<AddEvents />} />

          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/city" element={<CityStates />} />
        </Routes>
      </BrowserRouter>
    </myData.Provider>
  );
};

export default App;
export {myData}
