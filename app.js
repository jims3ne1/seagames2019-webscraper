const express = require('express')
const app = express()
const { getCountries } = require('./lib/scraper.js')

const port = 3000

app.get('/countries', async (req, res) => {
    try {
        const results = await getCountries()
        res.send(JSON.stringify(results))
    } catch (err) {
        res.sendStatus(500)
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))