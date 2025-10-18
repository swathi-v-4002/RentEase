const router = require('express').Router();
const auth = require('../middleware/auth');
const Rental = require('../models/rental.model');
const Payment = require('../models/payment.model');
const Item = require('../models/item.model');

// @route   POST api/rentals
// @desc    Create a new rental
// @access  Private
router.post('/', auth, async (req, res) => {
  const { itemId, totalCost } = req.body; // Simplified for this example
  const renterId = req.user.id;

  try {
    const item = await Item.findById(itemId);
    if (!item || item.availabilityStatus === 'Rented') {
      return res.status(400).json({ msg: 'Item is not available for rent.' });
    }

    // 1. Create the Rental
    const newRental = new Rental({
      item: itemId,
      renter: renterId,
      totalCost: totalCost,
    });
    const rental = await newRental.save();

    // 2. Create the associated Payment
    const newPayment = new Payment({
      rental: rental._id,
      amount: totalCost,
    });
    await newPayment.save();

    // 3. Update the Item's status
    item.availabilityStatus = 'Rented';
    await item.save();

    res.status(201).json({ msg: 'Rental successful!', rental });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rentals/myrentals
// @desc    Get all rentals for the logged-in user
// @access  Private
router.get('/myrentals', auth, async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user.id })
      .populate({
        path: 'item',
        select: 'itemName rentalPrice' // Only get the fields we need
      });
    res.json(rentals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/rentals/:id
// @desc    Delete a rental (cancel/un-rent)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ msg: 'Rental not found' });
    }
    // Make sure the user cancelling is the one who rented it
    if (rental.renter.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // 1. Set the item back to 'Available'
    await Item.findByIdAndUpdate(rental.item, { availabilityStatus: 'Available' });
    
    // 2. Delete the associated payment
    await Payment.findOneAndDelete({ rental: rental._id });

    // 3. Delete the rental itself
    await rental.deleteOne();

    res.json({ msg: 'Rental successfully cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rentals/myrentals
// ...
router.get('/myrentals', auth, async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user.id })
      .populate({
        path: 'item',
        select: 'itemName' // We just need the name
      })
      .select('item totalCost createdAt rentalStatus'); // Ensure rentalStatus is selected

    res.json(rentals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;