import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Badge } from 'react-bootstrap';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/projects')
      .then(res => {
        console.log("✅ Fetched projects:", res.data); // Debugging
        setProjects(res.data);
      })
      .catch(err => console.error('❌ Error fetching projects:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={styles.spinnerContainer}>
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <Container style={styles.container}>
      <h3 style={styles.title}> Project List</h3>

      {projects.length === 0 ? (
        <p className="text-muted">No projects found.</p>
      ) : (
        projects.map((project, idx) => (
          <Card key={idx} style={styles.card}>
            <h5 style={styles.projectTitle}>{project.title}</h5>

            <p style={styles.projectStatus}>
              <strong>Status: </strong>
              <Badge bg="warning" text="dark">
                {project.status || "Not specified"}
              </Badge>
            </p>

            <p style={styles.projectDescription}>{project.description}</p>
          </Card>
        ))
      )}
    </Container>
  );
};

const styles = {
  container: {
    marginTop: '40px',
    backgroundColor: 'transparent',
    color: '#f1f1f1',
    padding: '20px',
    maxWidth: '800px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '28px',
    letterSpacing: '1px',
  },
  card: {
    backgroundColor: '#1e1e2f',
    color: '#e0e0e0',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
    transition: 'transform 0.2s',
  },
  projectTitle: {
    marginBottom: '10px',
    color: '#00d9ff',
  },
  projectStatus: {
    marginBottom: '8px',
    fontWeight: '500',
  },
  projectDescription: {
    fontSize: '15px',
    color: '#ccc',
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '100px',
  },
};

export default ProjectList;
