const express = require('express');
const appRouter = require('./routes/index');

const app = express();
const router = express.Router();
app.use(express.json());
app.use('/', router);
router.use('/', appRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
