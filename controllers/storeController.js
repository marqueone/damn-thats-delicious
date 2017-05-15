const mongoose = require("mongoose");
const Store = mongoose.model("Store");

// exports.homePage = (request, response) => { 
//     response.render("index");
// };

exports.addStore = (request, response) => { 
    response.render("editStore", { title: "Add Store" });
};

exports.createStore = async (request, response) => {
    const store = await (new Store(request.body)).save();

    request.flash("success", `Successfully created ${store.name}. Care to a review`);
    response.redirect(`/stores/${store.slug}`);
}; 

exports.getStores = async (request, response) => {
    const stores = await Store.find();
    response.render("stores", { title: "Stores", stores })
}

exports.editStore = async (request, response) => {
    const store = await Store.findOne({ _id: request.params.id});
    
    response.render("editstore", { title: `Edit ${store.name}`, store})
}

exports.updateStore = async (request, response) => {
    const store = await Store.findOneAndUpdate({ _id: request.params.id}, request.body, { new: true, runValidators: true}).exec();

    request.flash("success", `Successfully updated <strong>${store.name}</strong> <a href="/stores/${store.slug}">View Store</a>`);

    response.redirect(`/stores/${store._id}/edit`);
}