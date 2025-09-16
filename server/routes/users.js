const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model'); // Import our User model
const jwt = require('jsonwebtoken'); // Make sure to require this at the top of the file with the others
// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // 2. Create a new user instance
    const newUser = new User({
      name,
      email,
      phoneNumber,
    });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.passwordHash = await bcrypt.hash(password, salt);

    // 4. Save the user to the database
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Check if password matches
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. User is valid, create JWT payload
    const payload = {
      user: {
        id: user.id // This 'id' comes from MongoDB (_id)
      }
    };

    // 4. Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back to the client
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;