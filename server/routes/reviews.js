const router = require('express').Router();
const auth = require('../middleware/auth');
const Review = require('../models/review.model');
const Rental = require('../models/rental.model');

// @route   POST api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, async (req, res) => {
  const { rentalId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    // 1. Find the rental
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ msg: 'Rental not found.' });
    }
    // 2. Check if the logged-in user is the one who rented it
    if (rental.renter.toString() !== userId) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }
    // // 3. (Optional) Check if rental is 'Completed'
    // if (rental.rentalStatus !== 'Completed') {
    //   return res.status(400).json({ msg: 'You can only review completed rentals.' });
    // }

    // 4. Check if a review for this rental already exists
    let existingReview = await Review.findOne({ rental: rentalId });
    if (existingReview) {
      return res.status(400).json({ msg: 'Review already submitted for this rental.' });
    }

    // 5. Create and save the new review
    const newReview = new Review({
      rental: rentalId,
      item: rental.item,
      user: userId,
      rating,
      comment
    });

    await newReview.save();
    res.status(201).json(newReview);

  } catch (err) {
    // This will catch the 'unique' error for the rentalId if one exists
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Review already submitted.' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reviews/item/:itemId
// @desc    Get all reviews for a specific item
// @access  Public
router.get('/item/:itemId', async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate('user', 'name') // Get the reviewer's name
      .sort({ createdAt: -1 }); // Show newest reviews first

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;