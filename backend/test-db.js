import pool from './db.js';

async function testDatabase() {
    try {
        console.log("Testing database connection and tables...");
        
        // Test connection
        const connectionTest = await pool.query('SELECT NOW()');
        console.log("✅ Database connection OK:", connectionTest.rows[0]);
        
        // Check tables exist
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name IN ('items', 'thumbnails', 'infos', 'orders')
        `);
        
        console.log("✅ Tables found:", tables.rows.map(r => r.table_name));
        
        // Check data in items table
        const itemsCount = await pool.query('SELECT COUNT(*) as count FROM items');
        console.log(`✅ Items table has ${itemsCount.rows[0].count} records`);
        
        // Show sample data
        const sampleItems = await pool.query('SELECT item_id, name, category FROM items LIMIT 3');
        console.log("✅ Sample items:", sampleItems.rows);
        
        // Check column names
        const itemColumns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'items'
        `);
        
        console.log("✅ Items table columns:");
        itemColumns.rows.forEach(col => {
            console.log(`  - ${col.column_name} (${col.data_type})`);
        });
        
    } catch (error) {
        console.error("❌ Database test failed:", error.message);
    } finally {
        pool.end();
    }
}

testDatabase();