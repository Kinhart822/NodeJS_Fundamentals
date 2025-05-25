let getHomePage = (req, res) => {
    // Logic
    return res.render('index.ejs', { name: 'Eric & Hoi Dan IT' })
}

module.exports = {
    getHomePage: getHomePage
}