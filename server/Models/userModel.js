// Import required modules
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please, tell us your username!'],
        },
        email: {
            type: String,
            required: [true, 'Please, provide your email !'],
            unique: true,
            lowercase: true,
            validator: [validator.default.isEmail, 'Please, provide a valid email address!']
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

// Middleware لتشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to check if password was changed after token was issued
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
};

// Method to create password reset token
userSchema.method.createPasswordResetToken =function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // valid for 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// Create User model from schema
const User = mongoose.model('User', userSchema);

// Export User model
module.exports = User;
