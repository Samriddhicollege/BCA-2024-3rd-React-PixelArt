import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Drawer from './components/layout/Drawer';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import GalleryPage from './pages/GalleryPage';

function App() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'row', width: '100%', minHeight: '100vh' }}>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
      <Drawer />
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
