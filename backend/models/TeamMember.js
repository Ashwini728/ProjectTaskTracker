const mongoose = require('mongoose');
const TeamMemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});
module.exports = mongoose.model('TeamMember', TeamMemberSchema);