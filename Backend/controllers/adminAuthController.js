const generateAdminToken = require('../utils/generateAdminToken');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      res.json({
        success: true,
        token: generateAdminToken('admin'),
        admin: {
          email: adminEmail,
          role: 'admin',
        },
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid admin credentials',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = {
  loginAdmin,
};
