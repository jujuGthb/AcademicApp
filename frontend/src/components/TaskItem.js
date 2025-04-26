"use client"
import "./TaskItem.css"

const TaskItem = ({ task, deleteTask, toggleComplete }) => {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <p className="task-date">Created: {new Date(task.createdAt).toLocaleString()}</p>
      </div>
      <div className="task-actions">
        <button
          onClick={() => toggleComplete(task._id)}
          className={`btn ${task.completed ? "btn-incomplete" : "btn-complete"}`}
        >
          {task.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onClick={() => deleteTask(task._id)} className="btn btn-delete">
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskItem
