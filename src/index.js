// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import emailjs from 'emailjs-com';


emailjs.init('FR9t1wkY_bT3iLNbS');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
