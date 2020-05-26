// =====================================
// Port (Puerto)
// =====================================
process.env.PORT = process.env.PORT || 3000

// =====================================
// Entorno (Enviroment)
// =====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =====================================
// Expires Token (fecha de vencimiento)
//  seg * min * horas * day
// =====================================

process.env.EXPIRES_TOKEN = 60 * 60 * 24 * 30

// =====================================
// Seed authentication (key)
// =====================================

process.env.SEED = process.env.SEED || 'key_secret_development_test'

// =====================================
//  Database (conection)
// =====================================

let urlDB

if (process.env.NODE_ENV === 'dev') {
    // [local - develoment]
    urlDB = 'mongodb://localhost:27017/cafe'

} else {
    // [remote - production]
    urlDB = process.env.MONGO_URI

}

process.env.URLDB = urlDB