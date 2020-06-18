// =============================
// Port
// =============================

process.env.PORT = process.env.PORT || 3000;

// =============================
// Enviroment
//==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
// Data Base
// =============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

// ============================
// Token
// ============================
// 60 sec
// 60 min
// 24 hours
// 30 days heroku

process.env.TOKEN_EXPIRATION = 60 * 60 * 72 * 30;


// ============================
// Seed
// ============================

process.env.SEED = process.env.SEED || 'developing seed';

// ============================
// Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || "620555602465-ohehblo82der34a8t82k20femisg533k.apps.googleusercontent.com";