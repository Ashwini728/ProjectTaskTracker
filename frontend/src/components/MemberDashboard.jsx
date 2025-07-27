import React from 'react';
import MyTasks from './MyTasks';
import TaskProgressChart from './TaskProgressChart';
import FileUpload from './FileUpload';
import ChatWidget from './ChatWidget'; // ✅ Import ChatWidget

const MemberDashboard = ({ userId }) => {
  return (
    <div className="container mt-4" style={{ backgroundColor: 'transparent' }}>
     <h3 className="text-center text-white mb-4">Team Member Dashboard</h3>


      <div className="mb-5">
        <MyTasks userId={userId} />
      </div>

      {/* <div className="mb-5">
        <TaskProgressChart userId={userId} />
      </div> */}

      <div className="mb-5">
        <FileUpload userId={userId} />
      </div>

      {/* ✅ Floating Chat Widget */}
      <ChatWidget userId={userId} role="member" />


    </div>
  );
};

export default MemberDashboard;
