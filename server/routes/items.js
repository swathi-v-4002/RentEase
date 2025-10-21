const router = require('express').Router();
const Item = require('../models/item.model');
const auth = require('../middleware/auth'); // Import our auth middleware
const authOptional = require('../middleware/authOptional');
const Category = require('../models/category.model');
const upload = require('../config/cloudinary');
const Rental = require('../models/rental.model');
// @route   POST /api/items
// @desc    Create a new rental item
// @access  Private
//
// <-- 2. ADD THE UPLOAD MIDDLEWARE
router.post('/', auth, upload.single('itemImage'), async (req, res) => {
  try {
    const { itemName, description, rentalPrice, category } = req.body;

    // <-- 3. GET THE FILE URL FROM CLOUDINARY
    const imageUrl = req.file.path;

    if (!imageUrl) {
      return res.status(400).json({ msg: 'Image upload failed.' });
    }

    const newItem = new Item({
      itemName,
      description,
      rentalPrice,
      category,
      imageUrl, // <-- 4. ADD IT TO THE NEW ITEM
      owner: req.user.id
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
router.get('/',authOptional ,async (req, res) => {
  try {
    let query = { availabilityStatus: 'Available' };
    if(req.user && req.user.id){
      query.owner = { $ne: req.user.id }; // Exclude items owned by the requester
    }
    const items = await Item.find(query).populate('owner', 'name').populate('category', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// @route   GET /api/items/search
// @desc    Search for items by name, description, or category name
// @access  Public (filters out user's own items if logged in)
router.get('/search', authOptional, async (req, res) => { // <-- 1. Add authOptional
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Step 1: Find categories that match the search term
    const categories = await Category.find({
      name: { $regex: q.trim(), $options: 'i' }
    }).select('_id');

    const categoryIds = categories.map(cat => cat._id);

    // Step 2: Build Search Criteria
    const searchCriteria = {
      // Original search logic
      $or: [
        { itemName: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { category: { $in: categoryIds } }
      ],
      // 2. Add new condition: MUST be 'Available'
      availabilityStatus: 'Available'
    };

    // 3. Add new condition: Exclude items owned by the requester (if logged in)
    if (req.user && req.user.id) {
      searchCriteria.owner = { $ne: req.user.id };
    }

    // Step 3: Find items matching all criteria
    const items = await Item.find(searchCriteria)
      .populate('owner', 'name') // Added owner populate for consistency
      .populate('category', 'name')
      .sort({ createdAt: -1 });
      
    res.json(items);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Server error during search',
      error: error.message 
    });
  }
});

router.get('/myitems', auth, async (req, res) => {
  try {
    // This route now *only* finds your items.
    const items = await Item.find({ owner: req.user.id })
                          .populate('category', 'name')
                          .sort({ createdAt: -1 });
    
    res.json(items); // Just send the items

  } catch (err) {
    console.error('Error in /myitems:', err);
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