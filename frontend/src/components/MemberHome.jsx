import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img7 from '../assets/img7.png';
import img8 from '../assets/img8.png';
import img9 from '../assets/img9.png';
import ChatWidget from './ChatWidget';
import ChatBot from './Chatbot';

const MemberHome = ({ userId }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser || {});

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/tasks/user/${storedUser._id}`);
        const tasks = res.data;
        const completed = tasks.filter((t) => t.status === 'Completed').length;
        const pending = tasks.filter((t) => t.status !== 'Completed').length;
        setTaskStats({ total: tasks.length, completed, pending });
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    if (storedUser?._id) fetchTasks();
  }, []);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const cards = [
    {
      title: 'My Tasks',
      image: img7,
      path: '/mytasks',
    },
    {
      title: 'Uploads',
      image: img9,
      path: '/uploads',
    },
    {
      title: 'Task Progress',
      image: img8,
      path: '/progress',
    },
  ];

  return (
    <div className="container position-relative" style={{background:'transparent'}}>
      <h3 className="text-center mb-3"> Welcome, {user.name || 'Team Member'}!</h3>
      <p className="text-center text-muted">{today}</p>

      {/* Task Summary */}
      <Row className="mb-4 text-center">
        <Col md={4}>
          <Alert variant="primary">
            <strong>{taskStats.total}</strong> Total Tasks
          </Alert>
        </Col>
        <Col md={4}>
          <Alert variant="success">
            <strong>{taskStats.completed}</strong> Completed
          </Alert>
        </Col>
        <Col md={4}>
          <Alert variant="warning">
            <strong>{taskStats.pending}</strong> Pending
          </Alert>
        </Col>
      </Row>

      {/* Quick Access Cards */}
      <h5 className="text-center mb-3">Quick Access</h5>
      <Row className="justify-content-center">
        {cards.map((card, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card
              className="h-100 shadow card-hover"
              style={{ cursor: 'pointer', borderRadius: '1rem' }}
              onClick={() => navigate(card.path)}
            >
              <Card.Img
                variant="top"
                src={card.image}
                style={{
                  height: '250px',
                  objectFit: 'contain',
                  padding: '1.5rem',
                }}
              />
              <Card.Body className="text-center">
                <Card.Title className="mb-3 fs-4">{card.title}</Card.Title>
                <Button variant="primary">Go to {card.title}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quote */}
      <div className="text-center mt-5">
        <blockquote className="blockquote">
          <p className="mb-0">
            "Productivity is never an accident. It is always the result of commitment, planning, and focused effort."
          </p>
          <footer className="blockquote-footer mt-2">Paul J. Meyer</footer>
        </blockquote>
      </div>

      {/* Floating Chat Widget */}
      <ChatBot userId={userId} role="member" />

      <style jsx="true">{`
        .card-hover:hover {
          transform: translateY(-5px);
          transition: transform 0.2s ease-in-out;
        }
        /* Widget Floating Button Fix */
        .chat-widget-icon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          cursor: pointer;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .chat-box-container {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 320px;
          max-height: 500px;
          z-index: 1000;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          background: white;
          border-radius: 1rem;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MemberHome;
