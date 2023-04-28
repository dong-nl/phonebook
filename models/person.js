const mongoose = require('mongoose')

mongoose.set('strictQuery',true)

const url = process.env.MONGODB_URI

console.log('connecting to ',url)
mongoose.connect(url)
	.then(result => {
		console.log('connected to mongodb')
	})
	.catch(error => {
		console.log('error connecting to mongodb:',error.message)
	})

const personSchema = new mongoose.Schema({
	name:{
		type:String,
		minLength:5,
		required:true
	},
	number:{
		type:String,
		validate:{
			validator: v => {
				return /\d{4}-\d{8}/.test(v)
			},
			message: props => `${props.value} is not a valid phone number`
		},
		required:true
	}
})

personSchema.set('toJSON',{
	transform:(document,returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('People',personSchema)