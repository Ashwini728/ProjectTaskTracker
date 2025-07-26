import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Table } from 'react-bootstrap';
import ChatWidget from './ChatWidget';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/team');
        setTeamMembers(res.data);
      } catch (err) {
        console.error('❌ Error fetching team members:', err);
        toast.error('Failed to load team members');
      }
    };

    fetchTeam();
  }, []);

  const promoteToProjectManager = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/team/promote/${id}`);
      toast.success('✅ Successfully promoted to Project Manager');
      refreshTeam();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error promoting user');
    }
  };

  const demoteFromProjectManager = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/team/demote/${id}`);
      toast.info('🟠 User demoted to Member');
      refreshTeam();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error demoting user');
    }
  };

  const refreshTeam = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/team');
      setTeamMembers(res.data);
    } catch (err) {
      console.error('❌ Error refreshing team list:', err);
    }
  };

  const cards = [
    {
      title: 'Projects',
      image: 'https://cdn-icons-png.flaticon.com/512/1904/1904425.png',
      path: '/projects',
    },
    {
      title: 'Tasks',
      image: 'https://cdn-icons-png.flaticon.com/512/906/906343.png',
      path: '/tasks',
    },
    {
      title: 'Team Members',
      image: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
      path: '/team',
    },
  ];

  return (
    <div className="admin-dashboard">
      <h3 className="mb-4 text-center">Admin Dashboard</h3>

      <div className="row justify-content-center">
        {cards.map((card, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Card
              onClick={() => navigate(card.path)}
              className="h-100 shadow card-hover"
              style={{ cursor: 'pointer', borderRadius: '1rem' }}
            >
              <Card.Img
                variant="top"
                src={card.image}
                style={{
                  height: '230px',
                  objectFit: 'contain',
                  padding: '1.5rem',
                }}
              />
              <Card.Body className="d-flex flex-column justify-content-between text-center">
                <Card.Title className="mb-3 fs-5">{card.title}</Card.Title>
                <Button
                  variant="outline-light"
                  onClick={() => navigate(card.path)}
                >
                  Explore {card.title}
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div className="mt-5 px-3">
          <h5> Manage Project Manager Roles</h5>
          <br />
          <br />
          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member._id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>
                    {member.role === 'admin' ? (
                      <span className="text-muted">Admin</span>
                    ) : member.role === 'project_manager' ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => demoteFromProjectManager(member._id)}
                      >
                        Demote
                      </Button>
                    ) : (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => promoteToProjectManager(member._id)}
                      >
                        Promote to project manager
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <ChatWidget userId={user?._id || 'admin'} role={user?.role} />

      <style jsx="true">{`
        .admin-dashboard {
          background-color: #7f9fda07;
          color: #ffffff;
          min-height: 100vh;
          padding: 2rem;
        }

        h3, h5 {
          color: #f1f1f1;
        }

        .card-hover {
          background-color: #1e1e1e;
          color: #f0f0f0;
          transition: transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }

        .table-dark th,
        .table-dark td {
          color: #ddd;
        }

        .btn-outline-light:hover {
          color: #121212;
          background-color: #f8f9fa;
        }

        .btn-outline-danger:hover {
          background-color: #dc3545;
          color: #fff;
        }

        .btn-outline-warning:hover {
          background-color: #ffc107;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
