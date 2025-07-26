import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner } from 'react-bootstrap';

const TeamList = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/team')
      .then(res => setTeam(res.data))
      .catch(err => console.error('Error fetching team:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <Container style={styles.container}>
      <h3 style={styles.heading}>Team Members</h3>
      {team.map((member, idx) => (
        <Card key={idx} style={styles.card}>
          <h5 style={styles.name}>{member.name}</h5>
          <p style={styles.email}><strong>Email:</strong> {member.email}</p>
          <p style={styles.role}><strong>Role:</strong> {member.role}</p>
        </Card>
      ))}
    </Container>
  );
};

// 🎨 Internal CSS styles for dark theme
const styles = {
  container: {
    backgroundColor: '#12121204',
    padding: '2rem',
    borderRadius: '8px',
    minHeight: '100vh',
    color: '#f1f1f1',
  },
  heading: {
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: '2rem',
    fontWeight: '600',
    fontSize: '1.8rem',
  },
  card: {
    backgroundColor: '#1e1e2f',
    color: '#ddd',
    padding: '1.5rem',
    marginBottom: '1rem',
    borderRadius: '10px',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.6)',
    border: '1px solid #2a2a2a',
  },
  name: {
    color: '#00bcd4',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  email: {
    fontSize: '0.95rem',
    marginBottom: '0.3rem',
    color: '#ccc',
  },
  role: {
    fontSize: '0.9rem',
    color: '#aaa',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#121212',
  },
};

export default TeamList;
