const router = require('express').Router();
const auth = require('../middleware/auth');
const Rental = require('../models/rental.model');
const Payment = require('../models/payment.model');
const Item = require('../models/item.model');

// @route   POST api/rentals
// @desc    Request a new rental
// @access  Private
router.post('/', auth, async (req, res) => {
  const { itemId, totalCost } = req.body;
  const renterId = req.user.id;

  try {
    const item = await Item.findById(itemId);
    
    // Check if item is available
    if (!item || item.availabilityStatus !== 'Available') {
      return res.status(400).json({ msg: 'This item is not available for rent.' });
    }
    
    // Check if user is trying to rent their own item
    if (item.owner.toString() === renterId) {
      return res.status(400).json({ msg: 'You cannot rent your own item.' });
    }

    // 1. Create the Rental with 'Pending' status
    const newRental = new Rental({
      item: itemId,
      renter: renterId,
      totalCost: totalCost,
      rentalStatus: 'Pending' // Explicitly set as Pending
    });
    const rental = await newRental.save();

    // 2. DO NOT create a payment yet

    // 3. Update the Item's status to 'Pending'
    item.availabilityStatus = 'Pending';
    await item.save();

    res.status(201).json({ msg: 'Rental request submitted successfully! The owner has been notified.', rental });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/rentals/:id
// @desc    Approve or Reject a rental request
// @access  Private
router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body; // Expecting { "status": "Approved" } or { "status": "Rejected" }
  const rentalId = req.params.id;
  const ownerId = req.user.id;

  try {
    // 1. Find the rental and the item it belongs to
    const rental = await Rental.findById(rentalId).populate('item');
    if (!rental) {
      return res.status(404).json({ msg: 'Rental request not found.' });
    }

    // 2. Security Check: Is the logged-in user the OWNER of the item?
    if (rental.item.owner.toString() !== ownerId) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }
    
    // 3. Check if it's already been decided
    if (rental.rentalStatus !== 'Pending') {
      return res.status(400).json({ msg: 'This request has already been processed.' });
    }

    if (status === 'Approved') {
      // --- APPROVAL LOGIC ---
      // 1. Create the Payment
      const newPayment = new Payment({
        rental: rental._id,
        amount: rental.totalCost,
        // (paymentStatus defaults to 'Completed')
      });
      await newPayment.save();

      // 2. Update Rental status
      rental.rentalStatus = 'Approved';
      await rental.save();

      // 3. Update Item status to 'Rented'
      await Item.findByIdAndUpdate(rental.item._id, { 
        availabilityStatus: 'Rented' 
      });

      res.json({ msg: 'Rental Approved!', rental });

    } else if (status === 'Rejected') {
      // --- REJECTION LOGIC ---
      // 1. Update Rental status
      rental.rentalStatus = 'Rejected';
      await rental.save();

      // 2. Update Item status back to 'Available'
      await Item.findByIdAndUpdate(rental.item._id, { 
        availabilityStatus: 'Available' 
      });
      
      res.json({ msg: 'Rental Rejected.', rental });

    } else {
      return res.status(400).json({ msg: 'Invalid status update.' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rentals/pending-count
// @desc    Get the count of pending requests for the user's items
// @access  Private
router.get('/pending-count', auth, async (req, res) => {
  try {
    // We re-use the same logic as the pending-approvals route
    const pendingRentals = await Rental.find({ rentalStatus: 'Pending' })
      .populate({ path: 'item', select: 'owner' });

    const userOwnedPendingRentals = pendingRentals.filter(
      (rental) => rental.item.owner.toString() === req.user.id
    );

    // Just send the number
    res.json({ count: userOwnedPendingRentals.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rentals/pending-approvals
// @desc    Get all pending rental requests for items owned by the user
// @access  Private
router.get('/pending-approvals', auth, async (req, res) => {
  try {
    // 1. Find all 'Pending' rentals and get their item/renter details
    const pendingRentals = await Rental.find({ rentalStatus: 'Pending' })
      .populate({
        path: 'item', // Get item details
        select: 'itemName imageUrl rentalPrice owner'
      })
      .populate('renter', 'name email'); // Get renter details

    // 2. Filter only those where the item's owner is the logged-in user
    const userOwnedPendingRentals = pendingRentals.filter(
      (rental) => rental.item.owner.toString() === req.user.id
    );

    res.json(userOwnedPendingRentals);
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
    const rentals = await Rental.find({ 
      renter: req.user.id,
      rentalStatus: { $ne: 'Rejected' }
    })
      .populate({
        path: 'item',
        select: 'itemName imageUrl'
      })
      .select('item totalCost createdAt rentalStatus');
    res.json(rentals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rentals/item/:itemId/renter
// @desc    Get renter details for a rented item
// @access  Private
router.get('/item/:itemId/renter', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Only proceed if item is rented
    if (item.availabilityStatus !== 'Rented') {
      return res.status(400).json({ msg: 'Item is not currently rented.' });
    }

    // Find the approved rental for this item
    const rental = await Rental.findOne({
      item: item._id,
      rentalStatus: 'Approved'
    }).populate('renter', 'name email');

    if (!rental) {
      return res.status(404).json({ msg: 'Renter not found for this item.' });
    }

    res.json({
      itemId: item._id,
      renter: rental.renter
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;