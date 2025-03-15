// Import user model
const User = require('./../Models/userModel.js');

// Function to create admin user if none exists
exports.createAdmin = async () => {
  try {
    // // Count existing admin users
    // const count = await User.findOne({
    //   email: 'admin@heylead.com'
    // });
    // // If admin user already exists, return
    // if (count !== 0) {
    //   return;
    // }
    // Create admin user
    const createAdmin = await User.create({
      username: 'admin',
      email: 'admin@heylead.com',
      password: 'AdminUser123',
      creationDate: new Date().toDateString()
    });
    // Log creation of admin user
    console.log('First admin of Heylead has been created');
  } catch (err) {
    // Log and exit process if error occurs
    console.log(err);
    process.exit(1);
  }
};
