const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function verify() {
  console.log('--- DB Verification Start ---');
  console.log('URI:', process.env.MONGODB_URI ? 'FOUND' : 'MISSING');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connection: SUCCESS');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📦 Collections:', collections.map(c => c.name).join(', '));
    
    // Count orphans
    const Campaign = mongoose.model('Campaign', new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId }), 'campaigns');
    const orphanCount = await Campaign.countDocuments({ userId: { $exists: false } });
    console.log(`🔍 Orphaned campaigns found: ${orphanCount}`);
    
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`👤 Total users: ${userCount}`);

    await mongoose.disconnect();
    console.log('--- DB Verification Complete ---');
  } catch (err) {
    console.error('❌ Error during verification:', err);
    process.exit(1);
  }
}

verify();
