const mongoose = require("mongoose");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

const Store = mongoose.model("Store");
const multerOptions = { 
    storage: multer.memoryStorage(),
    fileFilter: (request, file, next) => { 
        const isPhoto = file.mimetype.startsWith("image/");
        if(isPhoto) { 
            next(null, true);
        } else {
            next({ message: "Invalid file type" });
        }
    }
};

exports.addStore = (request, response) => { 
    response.render("editStore", { title: "Add Store" });
};

exports.upload = multer(multerOptions).single("photo");
exports.resize = async (request, response, next) => {
    if(!request.file) { 
        return next();
    }

    const extention = request.file.mimetype.split("/")[1];
    request.body.photo = `${uuid.v4()}.${extention}`;

    const photo = await jimp.read(request.file.buffer);
    await photo.resize(800, jimp.AUTO);

    await photo.write(`./public/uploads/${request.body.photo}`);
    next();
};

exports.createStore = async (request, response) => {
    const store = await (new Store(request.body)).save();

    request.flash("success", `Successfully created ${store.name}. Care to a review`);
    response.redirect(`/store/${store.slug}`);
}; 

exports.getStores = async (request, response) => {
    const stores = await Store.find();
    response.render("stores", { title: "Stores", stores });
};

exports.editStore = async (request, response) => {
    const store = await Store.findOne({ _id: request.params.id});
    
    response.render("editstore", { title: `Edit ${store.name}`, store});
};

exports.updateStore = async (request, response) => {
    //-- ensure that there is a default point type
    request.body.location.type = "Point";
    
    const store = await Store.findOneAndUpdate({ _id: request.params.id}, request.body, { new: true, runValidators: true}).exec();

    request.flash("success", `Successfully updated <strong>${store.name}</strong> <a href="/stores/${store.slug}">View Store</a>`);

    response.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (request, response, next ) => {
    const store = await Store.findOne({ slug: request.params.slug});
    if(!store) { return next()}

    response.render("store", { title: store.name, store });
};