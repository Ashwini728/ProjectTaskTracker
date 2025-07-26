import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup, Spinner, Badge } from 'react-bootstrap';
import { FiDownload, FiUser, FiClock, FiFileText } from 'react-icons/fi';

const AllUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/uploads/recent')
      .then((res) => {
        setUploads(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching uploads:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="upload-container mt-5">
      <style>{`
        .upload-container {
          background-color: #f5f7fa02;
          padding: 30px;
          border-radius: 12px;
        }
        .upload-card {
          border: none;
          border-radius: 16px;
          background-color: #f1e1e1d2;
          box-shadow: 0 0 10px rgba(0,0,0,0.08);
        }
        .upload-title {
          text-align: center;
          font-weight: 600;
          margin-bottom: 30px;
          font-size: 24px;
          color: #cdd2d8ff;
        }
        .list-group-item {
          background-color: transparent;
          border: none;
          border-bottom: 1px solid #eee;
          padding: 20px 10px;
        }
        .file-info {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 17px;
        }
        .upload-meta {
          margin-top: 8px;
          color: #0b0d0fff;
          font-size: 14px;
        }
        .upload-meta span {
          margin-right: 16px;
        }
        .btn-download {
          border: 1px solid #0d6efd;
          color: #0d6efd;
          transition: all 0.3s ease-in-out;
          font-size: 14px;
        }
        .btn-download:hover {
          background-color: #0d6efd;
          color: #fff;
        }
        .badge {
          font-size: 12px;
        }
        @media (max-width: 768px) {
          .file-info {
            font-size: 15px;
          }
          .upload-meta {
            font-size: 13px;
          }
        }
      `}</style>

      <h3 className="upload-title">Uploaded Files</h3>

      <Card className="upload-card">
        <Card.Body>
          {uploads.length === 0 ? (
            <p className="text-center text-muted">No files uploaded yet.</p>
          ) : (
            <ListGroup variant="flush">
              {uploads.map((upload, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-start flex-wrap"
                >
                  <div className="flex-grow-1">
                    <div className="file-info">
                      <FiFileText />
                      {upload.fileName}
                    </div>

                    <div className="upload-meta">
                      <span>
                        <FiUser className="me-1" />
                        Uploaded by:{" "}
                        <Badge bg="light" text="dark">
                          {upload.uploadedBy || "Unknown"}
                        </Badge>
                      </span>

                      <span>
                        Task:{" "}
                        <Badge bg="info" className="text-white">
                          {upload.taskTitle || "Untitled Task"}
                        </Badge>
                      </span>

                      <span>
                        <FiClock className="me-1" />
                        {new Date(upload.uploadedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <a
                      href={upload.fileUrl}
                      download
                      className="btn btn-sm btn-download"
                    >
                      <FiDownload className="me-1" />
                      Download
                    </a>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllUploads;
