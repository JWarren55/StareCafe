const express = require('express');
const app = express();
const menuRoutes = require('./routes/menu');
const foodRoutes = require('./routes/food');
const feedbackRoutes = require('./routes/feedback');

app.use(express.json());
app.use('/api/menu', menuRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/comments', feedbackRoutes); // reuse for comments

app.listen(3000, () => console.log('Server running on port 3000'));                             