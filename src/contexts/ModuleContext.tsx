
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Interface for todo item
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Interface for diary entry
export interface DiaryEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
}

// Interface for countdown timer
export interface CountdownTimer {
  id: string;
  title: string;
  targetDate: Date;
  createdAt: Date;
}

interface ModuleContextType {
  // Todo list state
  todos: TodoItem[];
  addTodo: (text: string) => void;
  toggleTodoComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  
  // Diary state
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (title: string, content: string) => void;
  updateDiaryEntry: (id: string, title: string, content: string) => void;
  deleteDiaryEntry: (id: string) => void;
  
  // Countdown timer state
  countdowns: CountdownTimer[];
  addCountdown: (title: string, targetDate: Date) => void;
  deleteCountdown: (id: string) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const useModuleContext = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModuleContext must be used within a ModuleProvider");
  }
  return context;
};

interface ModuleProviderProps {
  children: ReactNode;
}

export const ModuleProvider = ({ children }: ModuleProviderProps) => {
  // Load data from localStorage if available
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  // Todo list state
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const storedTodos = loadFromStorage<TodoItem[]>("todos", []);
    return storedTodos.map(todo => ({
      ...todo,
      createdAt: new Date(todo.createdAt)
    }));
  });

  // Diary state
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const storedEntries = loadFromStorage<DiaryEntry[]>("diaryEntries", []);
    return storedEntries.map(entry => ({
      ...entry,
      date: new Date(entry.date)
    }));
  });

  // Countdown timer state
  const [countdowns, setCountdowns] = useState<CountdownTimer[]>(() => {
    const storedCountdowns = loadFromStorage<CountdownTimer[]>("countdowns", []);
    return storedCountdowns.map(countdown => ({
      ...countdown,
      targetDate: new Date(countdown.targetDate),
      createdAt: new Date(countdown.createdAt)
    }));
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem("countdowns", JSON.stringify(countdowns));
  }, [countdowns]);

  // Todo list functions
  const addTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date()
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodoComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Diary functions
  const addDiaryEntry = (title: string, content: string) => {
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date(),
      title,
      content
    };
    setDiaryEntries([newEntry, ...diaryEntries]);
  };

  const updateDiaryEntry = (id: string, title: string, content: string) => {
    setDiaryEntries(diaryEntries.map(entry => 
      entry.id === id ? { ...entry, title, content } : entry
    ));
  };

  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries(diaryEntries.filter(entry => entry.id !== id));
  };

  // Countdown timer functions
  const addCountdown = (title: string, targetDate: Date) => {
    const newCountdown: CountdownTimer = {
      id: Date.now().toString(),
      title,
      targetDate,
      createdAt: new Date()
    };
    setCountdowns([newCountdown, ...countdowns]);
  };

  const deleteCountdown = (id: string) => {
    setCountdowns(countdowns.filter(countdown => countdown.id !== id));
  };

  const value = {
    todos,
    addTodo,
    toggleTodoComplete,
    deleteTodo,
    diaryEntries,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    countdowns,
    addCountdown,
    deleteCountdown
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
};
