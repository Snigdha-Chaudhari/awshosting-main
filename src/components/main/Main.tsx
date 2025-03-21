"use client";
import { FormEvent, useEffect, useState } from "react";

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
};

type Props = {};

const Main = (props: Props) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState<string>("");
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      priority,
      createdAt: Date.now()
    };
    
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setInput("");
  };

  const handleDelete = (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleComplete = (id: string) => {
    const newTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) {
      return;
    }
    
    const newTodos = todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editText } : todo
    );
    
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const changePriority = (id: string, newPriority: 'low' | 'medium' | 'high') => {
    const newTodos = todos.map(todo => 
      todo.id === id ? { ...todo, priority: newPriority } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const clearCompleted = () => {
    const newTodos = todos.filter(todo => !todo.completed);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300';
      case 'medium': return 'bg-yellow-100 border-yellow-300';
      case 'low': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '⚠️ High';
      case 'medium': return '⏱️ Medium';
      case 'low': return '✓ Low';
      default: return priority;
    }
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => todo.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Task Master
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col space-y-3">
            <div className="flex">
              <input
                placeholder="Add a new task..."
                className="flex-grow border border-gray-300 p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                name="todo"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white p-3 rounded-r-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
            
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Priority:</span>
                <div className="flex space-x-1">
                  <button 
                    type="button"
                    onClick={() => setPriority('low')}
                    className={`px-2 py-1 rounded text-xs ${priority === 'low' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Low
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriority('medium')}
                    className={`px-2 py-1 rounded text-xs ${priority === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Medium
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriority('high')}
                    className={`px-2 py-1 rounded text-xs ${priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">🔍</span>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilter('all')}
                className={`px-2 py-1 rounded text-xs ${filter === 'all' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('active')}
                className={`px-2 py-1 rounded text-xs ${filter === 'active' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                Active
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`px-2 py-1 rounded text-xs ${filter === 'completed' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                Completed
              </button>
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg text-sm w-full"
            />
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 rounded-lg border ${getPriorityColor(todo.priority)} ${
                  todo.completed ? "opacity-80" : ""
                } transition-all hover:shadow-md`}
              >
                {editingId === todo.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-grow p-2 border border-gray-300 rounded"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="text-blue-500 hover:text-blue-700 px-2">
                      ✓
                    </button>
                    <button onClick={cancelEdit} className="text-red-500 hover:text-red-700 px-2">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-grow">
                      <button
                        onClick={() => toggleComplete(todo.id)}
                        className={`text-gray-400 hover:text-green-500 transition-colors flex-shrink-0 w-6 h-6 flex items-center justify-center border rounded-full ${
                          todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                        }`}
                      >
                        {todo.completed ? "✓" : ""}
                      </button>
                      
                      <div className="min-w-0 flex-grow">
                        <p 
                          className={`${
                            todo.completed 
                              ? "text-gray-500 line-through" 
                              : "text-gray-800"
                          } break-all`}
                        >
                          {todo.text}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <span>{getPriorityLabel(todo.priority)}</span>
                          <span>•</span>
                          <span>{formatDate(todo.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => startEditing(todo)}
                        className="text-gray-400 hover:text-blue-500 transition-colors px-1"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors px-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              {searchTerm ? (
                <>No tasks matching "<strong>{searchTerm}</strong>"</>
              ) : filter !== 'all' ? (
                <>No {filter} tasks</>
              ) : (
                <>Your task list is empty. Add your first task above!</>
              )}
            </div>
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
            <div>
              {todos.filter(t => !t.completed).length} pending / {todos.length} total
            </div>
            {todos.some(t => t.completed) && (
              <button 
                onClick={clearCompleted}
                className="text-indigo-500 hover:text-indigo-700 text-sm"
              >
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
