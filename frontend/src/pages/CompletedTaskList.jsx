import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner } from 'react-bootstrap';

const CompletedTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/tasks')
      .then(res => {
        const completed = res.data.filter(task => task.status === 'Done');
        setTasks(completed);
      })
      .catch(err => console.error('Error fetching tasks:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-4" style={styles.container}>
      <h3 style={styles.title}>Completed Tasks</h3>
      {tasks.length === 0 ? (
        <p style={styles.noTask}>No completed tasks found.</p>
      ) : (
        tasks.map((task, idx) => (
          <Card key={idx} style={styles.card} className="shadow-sm">
            <h5 style={styles.cardTitle}>{task.title}</h5>
            <p style={styles.assigned}><strong>Assigned To:</strong> {task.assignedTo?.name || 'N/A'}</p>
            <p style={styles.description}>{task.description}</p>
          </Card>
        ))
      )}
    </Container>
  );
};

const styles = {
  container: {
    backgroundColor: 'transparent',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: '600',
    color: '#f1f4f7ff',
  },
  noTask: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#7f8c8d',
  },
  card: {
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '12px',
    backgroundColor: '#1e1e2f',
    border: '1px solid #1f1717ff',
    transition: 'transform 0.2s',
  },
  cardTitle: {
    color: '#cad4ddff',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  assigned: {
    fontSize: '0.95rem',
    color: 'white',
    marginBottom: '8px',
  },
  description: {
    color: '#b6ccceff',
    fontSize: '0.95rem',
  }
};

export default CompletedTaskList;
