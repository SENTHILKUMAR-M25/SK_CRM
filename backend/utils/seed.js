const { sequelize } = require('../config/db');
const { User } = require('../models');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected for seeding');

    await sequelize.sync();
    console.log('Tables synced');

    const existingAdmin = await User.findOne({ where: { email: 'admin@crm.com' } });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@crm.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created: admin@crm.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    await sequelize.close();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAdmin();
