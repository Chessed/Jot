const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const dbPass = encodeURI("M0r3chips!");

const uri = "mongodb+srv://Chess:"+dbPass+"@cluster0.hutuy.mongodb.net/jot_db?retryWrites=true&w=majority";

//middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( client => {
        const collection = client.db("jot_db").collection("notes");
        console.log('Connected to database');
        
        //Get notes from database
        app.get('/', (req, res) => {
            collection.find().toArray()
                .then(results =>{
                    res.render('index.ejs', {notes: results});
                });
        });

        //Add notes to database
        app.post('/addNotes',(req, res) =>{
            collection.insertOne(req.body)
            .then(result => {
                console.log(result);
            })
            .catch(error => console.error(error))
        });
        //Edit button action
        app.put('/addNotes', (req,res) => {
            console.log(req.body);
        });

        //Delete note
        app.get('/removeNotes/:id', (req, res)  => {
            collection.findOneAndDelete({ _id: req.params.id })
        });
    })
    .catch(console.error)

app.listen(3000, () => {
    console.log('Listening at port 3000');
});