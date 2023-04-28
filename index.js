require('dotenv').config()
const express = require('express');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(cors());

const requestLogger = (req,res,next) => {
	console.log('Method:',req.method);
	console.log('Path:',req.path);
	console.log('Body:',req.body);
	console.log('---');
	next();
}

app.use(requestLogger);
app.use(express.static('build'));

// let persons = [
//     { 
//       id: 1,
//       name: "Arto Hellas", 
//       number: "040-123456"
//     },
//     { 
//       id: 2,
//       name: "Ada Lovelace", 
//       number: "39-44-5323523"
//     },
//     { 
//       id: 3,
//       name: "Dan Abramov", 
//       number: "12-43-234345"
//     },
//     { 
//       id: 4,
//       name: "Mary Poppendieck", 
//       number: "39-23-6423122"
//     }
// ];

app.get('/api/persons',(request,response) => {
	Person.find({}).then(result => {
		response.json(result);
	})	
})

app.get('/api/info',(request,response) => {
	const now = new Date();
	Person.find({}).then(result => {
		response.end(`<p>PhoneBook has info for ${result ? result.length : 0} people</p><p>${now.toLocaleString()}</P>`)		
	})		
})

app.get('/api/persons/:id',(request,response,next) => {	
	Person.findById(request.params.id)
		.then(result => {
			if(result)			
				response.json(result)
			else
				response.status(404).end()
		})	
		.catch(error => next(error))	
})

app.delete('/api/persons/:id',(request,response,next) => {	
	Person.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
	
})

// const generateID = () => {
// 	const maxID = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;

// 	return maxID + 1;
// }

app.put('/api/persons/:id',(req,rsp,next) => {
	const body = req.body

	const person = {
		name:body.name,
		number:body.number
	}

	Person.findByIdAndUpdate(req.params.id,person,{new:true,runValidators:true,context:'query'})
		.then(result => {
			rsp.json(result)
		})
		.catch(error => next(error))
})

app.post('/api/persons',(request,res,next) => {
	const body = request.body;

	// if(!body.name || !body.number){
	// 	return res.status(400).json({
	// 		error:'name or number missing'
	// 	});
	// }

	// if(persons.find(p => p.name === body.name)){
	// 	return res.status(400).json({
	// 		error:'name must be unique'
	// 	});
	// }

	const person = new Person({		
		name:body.name,
		number:body.number
	})

	person.save().then(result => {
		res.json(result);
	})
	.catch(error => next(error))	
})

// const unknowPoint = (req,res) => {	
// 	res.status(404).send({error:'unknow endpoint'});
// }

// app.use(unknowPoint);

const errorMiddle = (error,request,response,next) => {
	console.log(error.message)

	if(error.name === 'CastError'){
		return response.status(400).send('malformatted id')
	}else if(error.name === 'ValidationError'){
		return response.status(400).json({error:error.message})
	}

	next(error)
}

app.use(errorMiddle)

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
	console.log('Server is running on 3001...');
})