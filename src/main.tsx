
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ModuleProvider } from './contexts/ModuleContext';

createRoot(document.getElementById("root")!).render(
  <ModuleProvider>
    <App />
  </ModuleProvider>
);
