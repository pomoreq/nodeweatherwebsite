const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')



const app = express()
// define paths for express config
const publicDirectory = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//setup handlebars enginge and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)
//setup static directory
app.use(express.static(publicDirectory))

app.get('', (req, res) => {
    res.render('index', {
        title:'Weather app',
        name: 'Tomek'
    })
})

app.get('/about', (req, res ) => {
    res.render('about', {
        title:'About me',
        name: 'Tomek'
    })
})

app.get('/help', (req, res ) => {
    res.render('help', {
        message: 'help message',
        title: 'Help',
        name:'Tomek Pomorski'
    })
})

app.get('/weather', (req, res ) => {

    if (!req.query.address) {
        return res.send({
            error: 'please provide a address'
        })
    }


    geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }


        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }


            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

    

    
    
})




app.get('/help/*', (req, res) => {
    res.render('404page', {
        title: '404',
        name: 'Tomek Pomorski',
        errorMessage: 'Article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404page', {
        title: '404',
        name: 'Tomek Pomorski',
        errorMessage: 'page not found'
    })
})

// app.com
// app.com/help 
// app.com/about


app.listen(3000, () => {
    console.log('server is up on port 3000')
})