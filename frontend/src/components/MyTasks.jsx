import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyTasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [commentInput, setCommentInput] = useState({});

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/tasks/user/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/api/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const addComment = async (id) => {
    const comment = commentInput[id];
    if (!comment?.trim()) return;

    try {
      const task = tasks.find(t => t._id === id);
      const updatedComments = [...(task.comments || []), comment];

      await axios.put(`http://localhost:4000/api/tasks/${id}`, { comments: updatedComments });
      setCommentInput(prev => ({ ...prev, [id]: '' }));
      fetchTasks();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Internal styles
  const styles = {
    container: {
      backgroundColor: '#96acc505',
      color: '#e0e0e0',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)'
    },
    cardHeader: {
      backgroundColor: '#1f1f1f',
      color: '#00bcd4',
      fontSize: '1.25rem',
      padding: '10px 16px',
      borderRadius: '10px 10px 0 0',
      borderBottom: '1px solid #333'
    },
    listGroupItem: {
      backgroundColor: '#1e1e1e',
      marginBottom: '10px',
      padding: '15px',
      borderRadius: '10px',
      border: '1px solid #333'
    },
    badge: {
      padding: '5px 10px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: 'bold'
    },
    formSelect: {
      backgroundColor: '#2c2c2c',
      color: '#fff',
      border: '1px solid #555'
    },
    input: {
      backgroundColor: '#8b7e7ece',
      color: '#fff',
      border: '1px solid #555',
      marginTop: '8px'
    },
    labelText: {
      color: '#ffffff',
      display: 'block',
      marginTop: '10px',
      fontWeight: '600'
    },
    smallText: {
      color: '#ffffff',
      fontSize: '0.9rem',
      display: 'block',
      marginBottom: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardHeader}>My Tasks</div>
      <div>
        {tasks.length > 0 ? (
          <ul className="list-unstyled">
            {tasks.map(task => (
              <li key={task._id} style={styles.listGroupItem}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{task.title}</strong>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor:
                        task.priority === 'Critical' ? '#e53935' :
                        task.priority === 'High' ? '#fb8c00' :
                        task.priority === 'Medium' ? '#039be5' :
                        '#757575'
                    }}
                  >
                    {task.priority}
                  </span>
                </div>

                {task.project?.title && (
                  <span style={styles.smallText}>
                    <strong>Project:</strong> {task.project.title}
                  </span>
                )}

                {task.dueDate && (
                  <span style={styles.smallText}>
                    <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}

                <label style={styles.labelText}>Status</label>
                <select
                  className="form-select mb-2"
                  style={styles.formSelect}
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>

                <label style={styles.labelText}>Comments</label>
                <ul className="mb-2 text-light ps-3">
                  {(task.comments || []).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>

                <input
                  className="form-control"
                  style={styles.input}
                  type="text"
                  placeholder="Add a comment and press Enter"
                  value={commentInput[task._id] || ''}
                  onChange={(e) => setCommentInput(prev => ({ ...prev, [task._id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addComment(task._id);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No tasks assigned.</p>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
