const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Event = require('./models/eventModel');
const sampleEvents = require('./data/sampleEvents');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventMg', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB Connection Error:', err));

const importData = async () => {
    try {
        // Clear existing data
        await Event.deleteMany();

        // Create admin user if not exists
        const adminUser = await User.findOne({ email: 'admin@gmail.com' });
        let adminId;

        if (!adminUser) {
            const admin = await User.create({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: '123456',
                role: 'admin'
            });
            adminId = admin._id;
        } else {
            adminId = adminUser._id;
        }

        // Add admin as organizer for sample events
        const eventsWithOrganizer = sampleEvents.map(event => ({
            ...event,
            organizer: adminId
        }));

        // Import sample events
        await Event.insertMany(eventsWithOrganizer);

        console.log('Sample data imported!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Event.deleteMany();
        console.log('Data destroyed!');
        process.exit();
    } catch (error) {
        console.error('Error destroying data:', error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
} 