const router = require('express').Router();
const Item = require('../models/item.model');
const auth = require('../middleware/auth'); // Import our auth middleware

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


// ... in routes/items.js, after the GET by ID route

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