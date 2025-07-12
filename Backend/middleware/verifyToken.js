const jwt = require('jsonwebtoken');
const User = require('../models/User');

app.get('/api/getUserByToken', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, 'yourSecretKey');
    const user = await User.findById(decoded.id).select('-password'); // no password
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
