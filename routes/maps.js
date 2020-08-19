var express = require('express');
var router = express.Router();

const map = require('../models/map')

//___________________________ADD MAP (METHOD:POST) ___________________________
router.post('/', function (req, res, next) {
    const { title, lat, lng } = req.body

    let response = {
        success: false,
        message: "",
        data: {}
    }

    const Map = new map({
        title: title,
        lat: lat,
        lng: lng
    })

    Map.save()
        .then(result => {
            response.success = true
            response.message = "data have been added"
            response.data._id = result._id
            response.data.title = result.title
            response.data.lat = result.lat
            response.data.lng = result.lng
            res.status(201).json(response)
        })
        .catch(err => {
            res.status(500).json(response)
        })

});


// ___________________________ READ MAP (METHOD:GET) ___________________________
router.get('/', function (req, res, next) {
    let response = []

    map.find()
        .then(data => {
            response = data.map(item => {
                return {
                    _id: item._id,
                    title: item.title,
                    lat: item.lat,
                    lng: item.lng,
                }
            })
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json(err)
        })

})

//___________________________ BROWSE MAP (METHOD:POST) ___________________________
router.post('/search', function (req, res, next) {
    let reg = new RegExp(req.body.title, 'i');
    let response = []
    let filter = {}

    if (req.body.title) {
        filter.title = { $regex: reg };
    }

    map.find(filter)
        .then(data => {
            response = data.map(item => {
                return {
                    _id: item._id,
                    title: item.title,
                    lat: item.lat,
                    lng: item.lng,
                }
            })
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(401).json(err)
        })

});

// ___________________________ EDIT MAP (METHOD:PUT) ___________________________
router.put('/:id', function (req, res, next) {
    let id = req.params.id

    let { title, lat, lng } = req.body

    let response = {
        success: false,
        message: "",
        data: {}
    }

    map.findByIdAndUpdate(id, { title, lat, lng }, {new: true})
        .then(data => {
            response.succes = true
            response.message = "data have been updated"
            response.data._id = data._id
            response.data.title = data.title
            response.data.lat = data.lat
            response.data.lng = data.lng
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "update failed"
            res.status(500).json(response)
        })
})

// ___________________________ DELETE MAP (METHOD:DELETE) ___________________________
router.delete('/:id', function (req, res, next) {
    let id = req.params.id

    let response = {
        succes: false,
        message: "",
        data: {}
    }

    map.findByIdAndRemove(id)
        .then(data => {
            response.succes = true
            response.message = "data have been deleted"
            response.data._id = data._id
            response.data.title = data.title
            response.data.lat = data.lat
            response.data.lng = data.lng
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "delete failed"
            res.status(500).json(response)
        })
})

// ___________________________ FIND (METHOD:GET) ___________________________
router.get('/:id', function (req, res, next) {
    let id = req.params.id

    let response = {
        succes: false,
        message: "",
        data: {}
    }

    map.findById(id)
        .then(data => {
            response.succes = true
            response.message = "data found"
            response.data._id = data._id
            response.data.title = data.title
            response.data.lat = data.lat
            response.data.lng = data.lng
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "data not found"
            res.status(500).json(response)
        })
})

module.exports = router;