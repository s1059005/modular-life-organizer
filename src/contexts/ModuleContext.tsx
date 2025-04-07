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

// Interface for world clock
export interface WorldClock {
  id: string;
  city: string;
  timezone: string;
  label?: string;
  createdAt: Date;
}

// Interface for vocabulary item
export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  example: string;
  notes?: string;
  lastReviewed?: Date;
  createdAt: Date;
  masteryLevel: number; // 0-5, 0 = not mastered, 5 = fully mastered
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

  // World clock state
  worldClocks: WorldClock[];
  addWorldClock: (city: string, timezone: string, label?: string) => void;
  deleteWorldClock: (id: string) => void;

  // Vocabulary state
  vocabularyItems: VocabularyItem[];
  addVocabularyItem: (word: string, definition: string, example: string, notes?: string) => void;
  updateVocabularyItem: (id: string, updates: Partial<Omit<VocabularyItem, 'id' | 'createdAt'>>) => void;
  deleteVocabularyItem: (id: string) => void;
  updateMasteryLevel: (id: string, masteryLevel: number) => void;
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

  // World clock state
  const [worldClocks, setWorldClocks] = useState<WorldClock[]>(() => {
    const storedClocks = loadFromStorage<WorldClock[]>("worldClocks", []);
    return storedClocks.map(clock => ({
      ...clock,
      createdAt: new Date(clock.createdAt)
    }));
  });

  // Vocabulary state
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>(() => {
    const storedVocabulary = loadFromStorage<VocabularyItem[]>("vocabulary", []);
    return storedVocabulary.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      lastReviewed: item.lastReviewed ? new Date(item.lastReviewed) : undefined
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

  useEffect(() => {
    localStorage.setItem("worldClocks", JSON.stringify(worldClocks));
  }, [worldClocks]);

  useEffect(() => {
    localStorage.setItem("vocabulary", JSON.stringify(vocabularyItems));
  }, [vocabularyItems]);

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

  // World clock functions
  const addWorldClock = (city: string, timezone: string, label?: string) => {
    const newClock: WorldClock = {
      id: Date.now().toString(),
      city,
      timezone,
      label,
      createdAt: new Date()
    };
    setWorldClocks([...worldClocks, newClock]);
  };

  const deleteWorldClock = (id: string) => {
    setWorldClocks(worldClocks.filter(clock => clock.id !== id));
  };

  // Vocabulary functions
  const addVocabularyItem = (word: string, definition: string, example: string, notes?: string) => {
    const newItem: VocabularyItem = {
      id: Date.now().toString(),
      word,
      definition,
      example,
      notes,
      createdAt: new Date(),
      masteryLevel: 0
    };
    setVocabularyItems([newItem, ...vocabularyItems]);
  };

  const updateVocabularyItem = (id: string, updates: Partial<Omit<VocabularyItem, 'id' | 'createdAt'>>) => {
    setVocabularyItems(vocabularyItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteVocabularyItem = (id: string) => {
    setVocabularyItems(vocabularyItems.filter(item => item.id !== id));
  };

  const updateMasteryLevel = (id: string, masteryLevel: number) => {
    setVocabularyItems(vocabularyItems.map(item => 
      item.id === id ? { 
        ...item, 
        masteryLevel, 
        lastReviewed: new Date() 
      } : item
    ));
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
    deleteCountdown,
    worldClocks,
    addWorldClock,
    deleteWorldClock,
    vocabularyItems,
    addVocabularyItem,
    updateVocabularyItem,
    deleteVocabularyItem,
    updateMasteryLevel
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
};
