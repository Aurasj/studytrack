import TaskItem from "./TaskItem";

//lista cu toate task urile
export default function TaskList({ tasks, onDelete, onStatusChange, onStart, onPause }) {
  return (
    <div>
      {/* Daca nu ai niciun task */}
      {tasks.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-300 py-6">
          Nu ai activitati inca.
        </p>
      )}

      {/* mapare fiecare task -> taskitem */}
      {tasks.map(task => (
        <TaskItem 
          key={task.id}  //cheie React
          task={task} //date task
          onDelete={onDelete} //sterge task
          onStatusChange={onStatusChange} //schimba task(completed,umcoming...)
          onStart={onStart} 
          onPause={onPause}
        />
      ))}
    </div>
  );
}
