const cheerio = require('cheerio')
const rp = require('request-promise')

const domain = 'https://2019seagames.com/'
const urlGetCountries = 'https://2019seagames.com/countries.html'

const cache = {
}

const options = {
    uri: urlGetCountries,
    transform: (body) => {
        return cheerio.load(body)
    }
}

function getCountries() {

    if (cache['countries']) {
        console.log('from cache')
        return Promise.resolve(cache['countries'])
    }

    return rp(options).then(($) => {
        const result = $('.container').find('.row')
        const countries = []

        result.each(function (i, row) {
            $row = $(row);
            $row.find('.col-md-4').each(function (i, element) {
                $element = $(element)

                name = $element.find('.country-name').text()
                code = $element.find('.country-name-abbr').text()
                image = domain + $(element).find('img').attr('src')
                yearFirstJoined = $element.find('.tooltip-firstjoined').text().match(/\d{1,4}/)

                prevTotalMedals = $element.find('.tooltip-total').text().match(/\d{1,4}/)
                gold = $element.find('.tooltip-gold').text().match(/\d+/)
                silver = $element.find('.tooltip-silver').text().match(/\d+/)
                bronze = $element.find('.tooltip-bronze').text().match(/\d+/)


                if (name) {

                    yearFirstJoined = yearFirstJoined ? parseInt(yearFirstJoined) : yearFirstJoined
                    prevTotalMedals = prevTotalMedals ? parseInt(prevTotalMedals) : prevTotalMedals
                    gold = gold ? parseInt(gold) : gold
                    silver = silver ? parseInt(silver) : silver
                    bronze = bronze ? parseInt(bronze) : bronze

                    country = { name, code, image, yearFirstJoined }
                    country['prevResult'] = {
                        year: 2017,
                        gold,
                        silver,
                        bronze,
                        total: prevTotalMedals
                    }
                    countries.push(country)
                }
            })
        })

        if (countries.length === 0) {
            throw new Error('Error fetching countries.')
        }

        cache['countries'] = countries
        return countries
    })
}

module.exports = {
    getCountries
}
