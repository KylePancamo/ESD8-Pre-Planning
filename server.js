const express = require('express');
const app = express();
const PORT = 5000;

// start express server on port 5000
app.listen(5000, () => {
  console.log(`server started on http://localhost:${PORT} `);
})