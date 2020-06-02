// =============================
// Port
//==============================

process.env.PORT = process.env.PORT || 3000;

// =============================
// ENVIROMENT
//==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
// Data Base
//==============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;