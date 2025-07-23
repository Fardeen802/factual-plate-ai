const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pagecontentdb';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const PageSchema = new mongoose.Schema({
  content: { type: Object, required: true },
}, { timestamps: true });

const Page = mongoose.model('Page', PageSchema);

// Create a new page
app.post('/api/pages', async (req, res) => {
  try {
    const page = new Page({ content: req.body.content });
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a page by ID
app.get('/api/pages/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a page by ID
app.put('/api/pages/:id', async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a page by ID
app.delete('/api/pages/:id', async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 