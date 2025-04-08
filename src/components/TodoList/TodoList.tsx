
import React, { useState } from 'react';
import { Check, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModuleContext, TodoItem } from '@/contexts/ModuleContext';
import { useToast } from '@/hooks/use-toast';

const TodoList = () => {
  const { todos, addTodo, toggleTodoComplete, deleteTodo } = useModuleContext();
  const [newTodoText, setNewTodoText] = useState('');
  const { toast } = useToast();

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText('');
      toast({
        title: '已新增待辦事項',
        description: newTodoText,
      });
    }
  };

  const handleToggleTodo = (id: string) => {
    toggleTodoComplete(id);
  };

  const handleDeleteTodo = (id: string, text: string) => {
    deleteTodo(id);
    toast({
      title: '已刪除待辦事項',
      description: text,
      variant: 'destructive',
    });
  };

  // Filter todos by completion status
  const completedTodos = todos.filter(todo => todo.completed);
  const incompleteTodos = todos.filter(todo => !todo.completed);

  return (
    <div>
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <Input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="新增待辦事項..."
          className="flex-1"
        />
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          新增
        </Button>
      </form>

      <div className="space-y-6">
        {incompleteTodos.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">待完成事項</h3>
            <ul className="space-y-2">
              {incompleteTodos.map(todo => (
                <TodoItemComponent
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </ul>
          </div>
        )}

        {completedTodos.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-500">已完成事項</h3>
            <ul className="space-y-2">
              {completedTodos.map(todo => (
                <TodoItemComponent
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </ul>
          </div>
        )}

        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            沒有待辦事項。新增一些事項吧！
          </div>
        )}
      </div>
    </div>
  );
};

interface TodoItemComponentProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string, text: string) => void;
}

const TodoItemComponent = ({ todo, onToggle, onDelete }: TodoItemComponentProps) => {
  return (
    <li className={`flex items-center justify-between p-3 rounded-md border 
                   ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center space-x-3">
        <button
          className={`flex-shrink-0 h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center
                     ${todo.completed ? 'bg-modulear-primary border-modulear-primary text-white' : 'bg-white'}`}
          onClick={() => onToggle(todo.id)}
          type="button"
        >
          {todo.completed && <Check className="h-4 w-4" />}
        </button>
        <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {todo.text}
        </span>
      </div>
      <button
        className="text-gray-400 hover:text-red-500 transition-colors"
        onClick={() => onDelete(todo.id, todo.text)}
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
};

export default TodoList;
