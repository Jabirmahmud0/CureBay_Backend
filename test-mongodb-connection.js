const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay';

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String (masked):', mongoUri.includes('@') 
    ? mongoUri.split('@')[0].split('://')[0] + '://***:***@' + mongoUri.split('@')[1]
    : mongoUri);
console.log('');

async function testConnection() {
    try {
        console.log('Attempting to connect...');
        
        const connectionOptions = {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        };
        
        await mongoose.connect(mongoUri, connectionOptions);
        console.log('✅ SUCCESS: Connected to MongoDB!');
        console.log('Database:', mongoose.connection.db.databaseName);
        console.log('Host:', mongoose.connection.host);
        console.log('Port:', mongoose.connection.port);
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`\n📊 Found ${collections.length} collections:`);
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });
        
        await mongoose.connection.close();
        console.log('\n✅ Connection test completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ FAILED: Connection error');
        console.error('Error:', error.message);
        console.error('Error code:', error.code);
        console.error('');
        
        if (error.code === 'ENOTFOUND') {
            console.error('🔧 DNS Resolution Failed!');
            console.error('');
            console.error('Solutions:');
            console.error('1. Test in MongoDB Compass:');
            console.error('   - Open MongoDB Compass');
            console.error('   - Paste your connection string');
            console.error('   - If it works in Compass but not here, it\'s a DNS/network issue');
            console.error('');
            console.error('2. Get Direct Connection String from Atlas:');
            console.error('   - Go to MongoDB Atlas → Your Cluster → Connect');
            console.error('   - Choose "Connect your application"');
            console.error('   - Select "Node.js" and version');
            console.error('   - Look for "Standard connection string" (not SRV)');
            console.error('   - It should look like: mongodb://... (not mongodb+srv://...)');
            console.error('');
            console.error('3. Check Network/DNS:');
            console.error('   - Run: ipconfig /flushdns (Windows)');
            console.error('   - Check if you can ping: cluster0.jzgc7yu.mongodb.net');
            console.error('   - Try using Google DNS: 8.8.8.8');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('🔧 Connection Timeout!');
            console.error('   - Check your internet connection');
            console.error('   - Verify MongoDB Atlas cluster is not paused');
            console.error('   - Check firewall settings');
        } else if (error.message.includes('authentication')) {
            console.error('🔧 Authentication Failed!');
            console.error('   - Check username and password in connection string');
            console.error('   - Verify database user exists in MongoDB Atlas');
        }
        
        process.exit(1);
    }
}

testConnection();

