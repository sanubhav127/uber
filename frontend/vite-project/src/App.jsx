import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from "../pages/HomePage"
import UserLogin from '../pages/UserLogin'
import UserSignup from '../pages/UserSignup'
import CapLogin from '../pages/capLogin'
import CapSignup from '../pages/CapSignup'
import { Toaster } from 'react-hot-toast'
import Home from '../pages/Home'
import CapHome from '../pages/CapHome'
import CabSelectPage from '../pages/CabSelectPage'
import { AnimatePresence, motion } from "framer-motion";
import RideConfirmPage from '../pages/RideConfirmPage'

const App = () => {
  const location = useLocation();

  return (
   <div>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <HomePage />
              </motion.div>
            }
          />
          <Route
            path="/home"
            element={
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/cabSelect"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <CabSelectPage />
              </motion.div>
            }
          />
          <Route
            path="/rideConfirm"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <RideConfirmPage />
              </motion.div>
            }
          />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/captain-login" element={<CapLogin />} />
          <Route path="/captain-signup" element={<CapSignup />} />
          <Route path="/caphome" element={<CapHome />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </div>
  );
};

export default App
