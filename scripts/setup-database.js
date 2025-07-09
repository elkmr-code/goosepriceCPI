const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'goose_cpi.db');
const csvPath = path.join(__dirname, '..', '家禽交易行情(養鵝協會近期鵝價).csv');

// Create database and tables
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Create table for goose price data
    db.run(`
        CREATE TABLE IF NOT EXISTS goose_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            hatching_quantity INTEGER,
            chick_quantity INTEGER,
            chick_reference_price REAL,
            meat_goose_average_price REAL,
            year INTEGER,
            month INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Clear existing data
    db.run('DELETE FROM goose_prices');

    console.log('正在導入CSV數據...');

    // Import CSV data
    let recordCount = 0;
    fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
            try {
                // Handle BOM in column names - the first column might have a BOM character
                const dateKey = Object.keys(row).find(key => key.includes('日期'));
                const hatchingKey = Object.keys(row).find(key => key.includes('入孵數量'));
                const chickKey = Object.keys(row).find(key => key.includes('出雛數量'));
                const chickPriceKey = Object.keys(row).find(key => key.includes('雛鵝參考價格'));
                const meatPriceKey = Object.keys(row).find(key => key.includes('肉鵝平均價格'));

                // Clean and parse the data
                const date = row[dateKey];
                const hatchingQtyStr = row[hatchingKey] || '';
                const chickQtyStr = row[chickKey] || '';
                const chickPriceStr = row[chickPriceKey] || '';
                const meatPriceStr = row[meatPriceKey] || '';

                // Convert Chinese commas to regular numbers
                const hatchingQty = parseInt(hatchingQtyStr.replace(/，/g, '').replace(/,/g, '')) || 0;
                const chickQty = parseInt(chickQtyStr.replace(/，/g, '').replace(/,/g, '')) || 0;
                const chickPrice = parseFloat(chickPriceStr) || 0;
                const meatPrice = parseFloat(meatPriceStr) || 0;

                // Extract year and month for filtering
                const dateObj = new Date(date);
                const year = dateObj.getFullYear();
                const month = dateObj.getMonth() + 1;

                if (date && !isNaN(year) && year > 2000 && year < 2030) {
                    recordCount++;
                    db.run(`
                        INSERT INTO goose_prices 
                        (date, hatching_quantity, chick_quantity, chick_reference_price, meat_goose_average_price, year, month)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [date, hatchingQty, chickQty, chickPrice, meatPrice, year, month], function(err) {
                        if (err) {
                            console.error('Insert error:', err);
                        }
                    });
                }
            } catch (error) {
                console.log('跳過無效記錄:', error.message);
            }
        })
        .on('end', () => {
            console.log('CSV數據導入完成！');
            console.log(`處理了 ${recordCount} 筆記錄`);

            // Create CPI calculation view
            db.run(`
                CREATE VIEW IF NOT EXISTS goose_cpi AS
                SELECT 
                    date,
                    year,
                    month,
                    chick_reference_price,
                    meat_goose_average_price,
                    ROUND(
                        (chick_reference_price / (
                            SELECT AVG(chick_reference_price) 
                            FROM goose_prices 
                            WHERE year = (SELECT MIN(year) FROM goose_prices)
                              AND chick_reference_price > 0
                        )) * 100, 2
                    ) AS chick_cpi,
                    ROUND(
                        (meat_goose_average_price / (
                            SELECT AVG(meat_goose_average_price) 
                            FROM goose_prices 
                            WHERE year = (SELECT MIN(year) FROM goose_prices)
                              AND meat_goose_average_price > 0
                        )) * 100, 2
                    ) AS meat_cpi
                FROM goose_prices
                WHERE chick_reference_price > 0 AND meat_goose_average_price > 0
                ORDER BY date DESC
            `);

            console.log('CPI計算視圖已創建！');

            // Show some statistics
            db.get('SELECT COUNT(*) as total FROM goose_prices', (err, row) => {
                if (!err) {
                    console.log(`成功導入 ${row.total} 筆記錄`);
                }
                db.close();
            });
        })
        .on('error', (error) => {
            console.error('CSV解析錯誤:', error);
            db.close();
        });
});
