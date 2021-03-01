// console.log("hello");
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// connecting to DataBase
connectDB();



app.use(express.json({ extended: false }));

// app.get('/', (req, res) => {
//   res.send("Home");
// });

app.use('/api/users', require('./routers/users'));
app.use('/api/contacts', require('./routers/contacts'));
app.use('/api/auth', require('./routers/auth'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`connected to port ${PORT}`);
});