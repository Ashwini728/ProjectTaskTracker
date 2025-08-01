import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const KanbanBoard = () => {
  const [kanbanData, setKanbanData] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': [],
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const fetchKanbanData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/tasks/kanban');
      setKanbanData(res.data);
    } catch (err) {
      console.error('Error fetching kanban data:', err);
      toast.error('Failed to load kanban board');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'danger';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  const TaskCard = ({ task }) => (
    <div className="mb-3">
      <Card
        className="shadow-sm task-card"
        style={{
          cursor: 'pointer',
          border: isOverdue(task.dueDate) ? '2px solid #dc3545' : '1px solid #444',
        }}
        onClick={() => {
          setSelectedTask(task);
          setShowModal(true);
        }}
      >
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="h6 mb-0">{task.title}</Card.Title>
            <Badge bg={getPriorityColor(task.priority)} className="ms-2">
              {task.priority}
            </Badge>
          </div>

          {task.description && (
            <Card.Text className="small text-light mb-2" style={{ fontSize: '0.85rem' }}>
              {task.description.length > 60
                ? `${task.description.substring(0, 60)}...`
                : task.description}
            </Card.Text>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-light">{task.assignedTo?.name || 'Unassigned'}</small>
            <small className={isOverdue(task.dueDate) ? 'text-danger fw-bold' : 'text-light'}>
              {formatDate(task.dueDate)}
            </small>
          </div>

          {task.project?.title && (
            <Badge bg="light" text="dark" className="mt-2">
              {task.project.title}
            </Badge>
          )}
        </Card.Body>
      </Card>
    </div>
  );

  const Column = ({ title, tasks }) => (
    <div className="col-md-4 mb-4">
      <Card className="h-100 bg-dark text-light column-card">
        <Card.Header className="bg-primary text-white text-center">
          <h5 className="mb-0">{title} ({tasks.length})</h5>
        </Card.Header>
        <Card.Body style={{ minHeight: '500px' }}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </Card.Body>
      </Card>
    </div>
  );

  return (
    <div className="kanban-board container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-light">Kanban Board</h3>
        <Button variant="outline-light" onClick={fetchKanbanData}>
          Refresh
        </Button>
      </div>

      <div className="row">
        <Column title="To Do" tasks={kanbanData['To Do']} />
        <Column title="In Progress" tasks={kanbanData['In Progress']} />
        <Column title="Done" tasks={kanbanData['Done']} />
      </div>

      {/* Task Detail Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        contentClassName="bg-dark text-light"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{selectedTask?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <div className="mb-3">
                <strong>Priority:</strong>{' '}
                <Badge bg={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
              </div>
              <div className="mb-3">
                <strong>Status:</strong> {selectedTask.status}
              </div>
              <div className="mb-3">
                <strong>Assigned To:</strong>{' '}
                {selectedTask.assignedTo?.name || 'Unassigned'}
              </div>
              <div className="mb-3">
                <strong>Project:</strong>{' '}
                {selectedTask.project?.title || 'No project'}
              </div>
              <div className="mb-3">
                <strong>Due Date:</strong> {formatDate(selectedTask.dueDate)}
              </div>
              {selectedTask.description && (
                <div className="mb-3">
                  <strong>Description:</strong>
                  <p className="mt-2">{selectedTask.description}</p>
                </div>
              )}
              {selectedTask.comments && selectedTask.comments.length > 0 && (
                <div className="mb-3">
                  <strong>Comments:</strong>
                  <ul className="mt-2">
                    {selectedTask.comments.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🔽 Internal Dark Theme Styles */}
      <style jsx="true">{`
        .kanban-board {
          background-color: #8591c707;
          min-height: 100vh;
          padding: 2rem;
        }
        .task-card {
          background-color: #d9e0e72c;
          color: #ffffff;
        }
        .task-card:hover {
          transform: translateY(-4px);
          transition: transform 0.2s ease-in-out;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
        }
        .column-card {
          border: 1px solid #444;
        }
        .modal-content {
          background-color: #1c1c1c !important;
        }
        .modal-header, .modal-body, .modal-footer {
          border-color: #333;
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;
