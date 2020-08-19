var express = require('express');
var router = express.Router();

const data = require('../models/data')


// _______________________  READ (METHOD:GET) ________________________________

router.get('/', function (req, res, next) {
    let response = []

    data.find()
        .then(data => {
            response = data.map(item => {
                return {
                    _id: item._id,
                    letter: item.letter,
                    frequency: item.frequency
                }
            })
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json(err)
        })

})





// _______________________  ADD (METHOD:POST) _______________________ 

router.post('/', function (req, res, next) {
    let { letter,
        frequency } = req.body

    let response = {
        succes: false,
        message: "",
        data: {}
    }

    const Data = new data({
        letter: letter,
        frequency: frequency
    })

    Data.save()
        .then(result => {
            response.succes = true
            response.message = "data sudah ditambahkan"
            response.data._id = result._id
            response.data.letter = result.letter
            response.data.frequency = result.frequency
            res.status(201).json(response)
        })
        .catch(err => {
            res.status(500).json(response)
        })
})



// _______________________  BROWSE (METHOD:POST) _______________________ 

router.post('/search', function (req, res, next) {
    let { letter, frequency } = req.body
    let reg = new RegExp(letter, 'i');
    let response = []
    let filter = {}

    if (letter && frequency) {
        filter.letter = { $regex: reg };
        filter.frequency = frequency;
    } else if (letter) {
        filter.letter = { $regex: reg };
    } else if (frequency) {
        filter.frequency = frequency;
    }

    data.find(filter)
        .then(data => {
            response = data.map(item => {
                return {
                    _id: item._id,
                    letter: item.letter,
                    frequency: item.frequency
                }
            })
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(401).json(err)
        })

});


// _______________________  EDIT (METHOD:PUT) _______________________ 
router.put('/:id', function (req, res, next) {
    let id = req.params.id

    let { letter, frequency } = req.body

    let response = {
        succes: false,
        message: "",
        data: {}
    }

    data.findByIdAndUpdate(id, { letter, frequency }, {new: true})
        .then(data => {
            response.succes = true
            response.message = "data sudah diupdate"
            response.data._id = data._id
            response.data.letter = data.letter
            response.data.frequency = data.frequency
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "update failed"
            res.status(500).json(response)
        })
})

// _______________________ DELETE (METHOD:DELETE) _______________________ 
router.delete('/:id', function (req, res, next) {
    let id = req.params.id

    let response = {
        succes: false,
        message: "",
        data: {}
    }

    data.findByIdAndRemove(id)
        .then(data => {
            response.succes = true
            response.message = "data sudah dihapus"
            response.data._id = data._id
            response.data.letter = data.letter
            response.data.frequency = data.frequency
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "delete failed"
            res.status(500).json(response)
        })
})


// _______________________ FIND (METHOD:GET) _______________________ 
router.get('/:id', function (req, res, next) {
    let id = req.params.id

    let response = {
        succes: false,
        message: "",
        data: {}
    }

    data.findById(id)
        .then(data => {
            response.succes = true
            response.message = "data ditemukan"
            response.data._id = data._id
            response.data.letter = data.letter
            response.data.frequency = data.frequency
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "data tidak ditemukan"
            res.status(500).json(response)
        })
})


module.exports = router;
