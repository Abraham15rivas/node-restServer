// ========================
// Port
// ========================
process.env.PORT = process.env.PORT || 3000

// ========================
// Entorno (Enviroment)
// ========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ========================
//  Database (conection)
// ========================

let urlDB

if (process.env.NODE_ENV === 'dev') {
    // [local - develoment]
    urlDB = 'mongodb://localhost:27017/cafe'

} else {
    // [remote - production]
    urlDB = 'mongodb+srv://abi:@pytKjJ7$9pD_3H@cluster0-cauv9.mongodb.net/cafe'

}

process.env.URLDB = urlDB