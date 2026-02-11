// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ExampleOne from "./pages/ExampleOne";
import ExampleTwo from "./pages/ExampleTwo";
import SongsList from "./pages/SongsList";
import EditSong from "./pages/EditSong";
import ErrorPage from "./pages/ErrorPage";
import "./index.css";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/home/exampleone" element={<ExampleOne />} />
          <Route path="/home/exampletwo" element={<ExampleTwo />} />
          <Route path="/songs" element={<SongsList />} />
          <Route path="/songs/editsong/:song_id" element={<EditSong />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
