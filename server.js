// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const MoviesDB = require('./modules/moviesDB.js');
app.use(express.static(__dirname + '/public')); // Serve static files


const db = new MoviesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.use(cors());                      // Enable CORS
app.use(express.json());              // Parse JSON bodies


app.get('/', (req, res) => {
    res.json({message: "API Listening"});
});


app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body)
        .then(movie => res.status(201).json(movie))
        .catch(err => res.status(500).json({error: err.message}));
});


app.get('/api/movies', (req, res) => {
    const { page, perPage, title } = req.query;
    db.getAllMovies(page, perPage, title)
        .then(movies => res.json(movies))
        .catch(err => res.status(500).json({error: err.message}));
});


app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
        .then(movie => {
            if (movie) {
                res.json(movie);
            } else {
                res.status(404).json({error: 'Movie not found'});
            }
        })
        .catch(err => res.status(500).json({error: err.message}));
});

app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id)
        .then(result => {
            if (result.modifiedCount === 0) {
                res.status(404).json({error: 'Movie not found'});
            } else {
                res.status(204).send();
            }
        })
        .catch(err => res.status(500).json({error: err.message}));
});


app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id)
        .then(result => {
            if (result.deletedCount === 0) {
                res.status(404).json({error: 'Movie not found'});
            } else {
                res.status(204).send();
            }
        })
        .catch(err => res.status(500).json({error: err.message}));
});


db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on: ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1); 
    });
