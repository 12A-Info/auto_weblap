import mysql from 'mysql2';

let connection = null;

try {
    connection = mysql
        .createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
        })
        .promise();
} catch (error) {
    connection = error;
}

export default connection;
