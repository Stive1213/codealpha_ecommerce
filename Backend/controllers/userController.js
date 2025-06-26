const db = require('../db/database');

const registerUser = (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).jason({error: 'All fields are required'});

    }
    const sql = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
    const params = [name, email, password];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({error:err.message});
        }

        res.status(201).json({
            message: 'user created successfully ',
            userId: this.lastID
        });
    });

};

module.exports = {registerUser};