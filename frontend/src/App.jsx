import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Studentdash from "./pages/dashboard/Studentdash";
import Facultydash from "./pages/dashboard/Facultydash";
import NotFound from "./pages/NotFound";
import { Authprovider } from "./context/AuthContext";

const App = () => {
  return (
    <Authprovider>
      <BrowserRouter>
        <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<Studentdash />}/>
          <Route path="/faculty-dashboard" element={<Facultydash/>}/>
          <Route path="/admin-dashboard" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </Authprovider>
  );
};

export default App;
