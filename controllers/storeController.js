const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index', { title: 'Home' });
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body).save());
    await store.save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    // 1. Query db for list of stores
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
    //1. Find store given ID
    const store = await Store.findOne({ _id: req.params.id });
    //2. Confirm they are owner of store
    //TODO
    //3. Render out the edit form to update store
    res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
    //Set location data to be poiunt
    req.body.location.type = 'Point';
    //Find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //returns new store instead of old one
        runValidators: true, //forces model to run required validators

    }).exec();
    //Redirect to store and flash it worked
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
};