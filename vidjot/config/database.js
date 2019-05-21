if(process.env.NODE_ENV === 'production'){
    module.exports = { mongoURI : 'mongodb://aqueel:aqueel123>@ds125293.mlab.com:25293/vidjot-amer'
    }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev'}
}