import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import TodoListPage from "./pages/TodoListPage";
import DiaryPage from "./pages/DiaryPage";
import CountdownTimerPage from "./pages/CountdownTimerPage";
import WorldClockPage from "./pages/WorldClockPage";
import VocabularyPage from "./pages/VocabularyPage";
import BackupRestorePage from "./pages/BackupRestorePage";
import StickyNotesPage from "./pages/StickyNotesPage";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<StickyNotesPage />} />
            <Route path="stickynotes" element={<StickyNotesPage />} />
            <Route path="todo" element={<TodoListPage />} />
            <Route path="diary" element={<DiaryPage />} />
            <Route path="countdown" element={<CountdownTimerPage />} />
            <Route path="worldclock" element={<WorldClockPage />} />
            <Route path="vocabulary" element={<VocabularyPage />} />
            <Route path="backup" element={<BackupRestorePage />} />
            <Route path="password" element={<PasswordGeneratorPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
