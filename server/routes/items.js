const router = require('express').Router();
const Item = require('../models/item.model');
const auth = require('../middleware/auth'); // Import our auth middleware
const Category = require('../models/category.model');

// @route   POST /api/items
// @desc    Create a new rental item
// @access  Private
router.post('/', auth, async (req, res) => { // 'auth' is our middleware
  try {
    const { itemName, description, rentalPrice, category } = req.body;

    const newItem = new Item({
      itemName,
      description,
      rentalPrice,
      category,
      owner: req.user.id // We get this from the auth middleware
    });

    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/items
// @desc    Get all rental items
// @access  Public
router.get('/', async (req, res) => {
  try {
    // .populate() will fetch the details of the owner and category
    // instead of just showing their IDs. It's like a JOIN in SQL.
    const items = await Item.find().populate('owner', 'name').populate('category', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/items/search
// @desc    Search for items by name, description, or category name
// @access  Public
router.get('/search', async (req, res) => {
  try {
    console.log("Search backend hit");
    const { q } = req.query;
    console.log("Search query:", q);
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Step 1: Find categories that match the search term
    console.log("Searching for categories...");
    const categories = await Category.find({
      name: { $regex: q.trim(), $options: 'i' }
    }).select('_id');
    console.log("Found categories:", categories);

    const categoryIds = categories.map(cat => cat._id);
    console.log("Category IDs:", categoryIds);

    // Step 2: Search Items
    const searchCriteria = {
      $or: [
        { itemName: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { category: { $in: categoryIds } }
      ]
    };
    console.log("Before Item.find()");

    const items = await Item.find(searchCriteria)
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    console.log("Found items:", items);
    res.json(items);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Server error during search',
      error: error.message 
    });
  }
});

// @route   GET /api/items/:id
// @desc    Get a single item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name')
      .populate('category', 'name');
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check if the user owns the item
    if (item.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Optional: Prevent deletion if item is currently rented
    if (item.availabilityStatus === 'Rented') {
        return res.status(400).json({ msg: 'Cannot delete an item that is currently rented.' });
    }

    await item.deleteOne();
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;