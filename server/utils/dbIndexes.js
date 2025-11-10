const Compound = require('../models/Compound');
const Paper = require('../models/Paper');
const SynthesisRoute = require('../models/SynthesisRoute');
const User = require('../models/User');

/**
 * Create database indexes for better query performance
 */
async function createIndexes() {
  try {
    console.log('Creating database indexes...');

    // Compound indexes
    await Compound.collection.createIndex({ name: 1 });
    await Compound.collection.createIndex({ category: 1 });
    await Compound.collection.createIndex({ tags: 1 });
    await Compound.collection.createIndex({ createdAt: -1 });
    await Compound.collection.createIndex({ name: 'text', description: 'text' });

    // Paper indexes
    await Paper.collection.createIndex({ title: 1 });
    await Paper.collection.createIndex({ year: -1 });
    await Paper.collection.createIndex({ authors: 1 });
    await Paper.collection.createIndex({ tags: 1 });
    await Paper.collection.createIndex({ contributor: 1 });
    await Paper.collection.createIndex({ createdAt: -1 });
    await Paper.collection.createIndex({ title: 'text', abstract: 'text' });

    // SynthesisRoute indexes
    await SynthesisRoute.collection.createIndex({ compoundId: 1 });
    await SynthesisRoute.collection.createIndex({ createdBy: 1 });
    await SynthesisRoute.collection.createIndex({ status: 1 });
    await SynthesisRoute.collection.createIndex({ createdAt: -1 });

    // User indexes (email already unique)
    await User.collection.createIndex({ role: 1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

module.exports = { createIndexes };
