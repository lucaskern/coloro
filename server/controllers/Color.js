const models = require('../models');
const Color = models.Color;

const colorPage = (req, res) => {
    Color.ColorModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'An error occured'
            });
        }

        return res.render('app', {
            csrfToken: req.csrfToken(),
            colors: docs
        });
    });
};

const makeColor = (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({
            error: 'Color name required',
        });
    }

    const colorData = {
        name: req.body.name,
        owner: req.session.account._id,
    };

    const newColor = new Color.ColorModel(colorData);

    const colorPromise = newColor.save();

    colorPromise.then(() => res.json({
        redirect: '/colors'
    }));

    colorPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({
                error: 'Color already exists'
            });
        }

        return res.status(400).json({
            error: 'An error occured'
        });
    });

    return colorPromise;
};

const getColors = (request, response) => {
    const req = request;
    const res = response;

    return Color.ColorModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'An error occured'
            });
        }

        return res.json({
            colors: docs
        });
    });
}

module.exports.colorPage = colorPage;
module.exports.makeColor = makeColor;
module.exports.getColors = getColors;
