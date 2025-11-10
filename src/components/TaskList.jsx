import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onStatusChange, onStart, onPause }) {
  return (
    <div>
      {tasks.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-300 py-6">
          Nu ai activități încă.
        </p>
      )}

      {tasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onStart={onStart}
          onPause={onPause}
        />
      ))}
    </div>
  );
}
