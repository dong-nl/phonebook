const express = require('express');
const cors = require('cors');

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

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
];

app.get('/api/persons',(request,response) => {
	response.json(persons);
})

app.get('/api/info',(request,response) => {
	const now = new Date();	
	response.end(`<p>PhoneBook has info for ${persons.length} people</p><p>${now.toLocaleString()}</P>`)
})

app.get('/api/persons/:id',(request,response) => {
	const id = Number(request.params.id);
	const person = persons.find(p => p.id === id);

	if(!person)
		return response.status(404).end();
	
	response.json(person);
})

app.delete('/api/persons/:id',(request,response) => {
	const id = Number(request.params.id);
	persons = persons.filter(p => p.id !== id);

	response.status(204).end();
})

const generateID = () => {
	const maxID = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;

	return maxID + 1;
}

app.post('/api/persons',(request,res) => {
	const body = request.body;

	if(!body.name || !body.number){
		return res.status(400).json({
			error:'name or number missing'
		});
	}

	if(persons.find(p => p.name === body.name)){
		return res.status(400).json({
			error:'name must be unique'
		});
	}

	const person = {
		id:generateID(),
		name:body.name,
		number:body.number
	}

	persons = persons.concat(person);

	res.json(person);
})

// const unknowPoint = (req,res) => {	
// 	res.status(404).send({error:'unknow endpoint'});
// }

// app.use(unknowPoint);

const PORT = 3001;
app.listen(PORT,() => {
	console.log('Server is running on 3001...');
})