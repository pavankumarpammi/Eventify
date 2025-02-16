const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['public', 'organizer', 'admin'],
        default: 'public'
    },
    isOrganizerVerified: {
        type: Boolean,
        default: false
    },
    organizerDetails: {
        companyName: String,
        description: String,
        documents: [String],
        verificationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    profileImage: {
        type: String,
        default: 'default-profile.png'
    }
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Create admin user if not exists
const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: '123456',
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

createAdminUser();

module.exports = User; 