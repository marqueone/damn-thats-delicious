const mongoose = require("mongoose");
const slug = require("slugs");

mongoose.Promise = global.Promise;

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: "Enter a store name",
	},
	slug: String,
	description: {
		type: String,
		trim: true,
	},
	tags: [String],
	location: { 
		type: { 
			type: String,
			default: "Point"
		},
		coordinates: [{
			type: Number,
			required: "Coordinates are Required"
		}],
		address: { 
			type: String,
			required: "Address is required"
		}
	},
	created: {type: Date, default: Date.now },
});

storeSchema.pre("save", function(next){
    if(!this.isModified("name")){
        return next();
    }

    this.slug = slug(this.name);
    next();
});

module.exports = mongoose.model("Store", storeSchema);
