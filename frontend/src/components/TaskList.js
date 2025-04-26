import TaskItem from "./TaskItem"
import "./TaskList.css"

const TaskList = ({ tasks, deleteTask, toggleComplete }) => {
  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks found. Add a task to get started!</p>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} deleteTask={deleteTask} toggleComplete={toggleComplete} />
      ))}
    </div>
  )
}

export default TaskList
