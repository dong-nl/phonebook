const mongoose = require('mongoose')

const len = process.argv.length

if(len != 3 && len != 5){
	console.log('Usage:node mongo.js password <name> <number>')
	process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.ovyq4ce.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',true)
mongoose.connect(url)

const peopleSchema = new mongoose.Schema({
	name:String,
	number:String
})

const People = mongoose.model('People',peopleSchema)

if(len === 5){
	const name = process.argv[3]
	const number = process.argv[4]

	const person = new People({
		name,
		number
	})

	person.save().then(result => {
		console.log(`added ${name} ${number} to phonebook`)
		mongoose.connection.close()
	})
}else{
	People.find({}).then(result => {
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})

		mongoose.connection.close()
	})
}