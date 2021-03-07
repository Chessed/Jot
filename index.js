const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const dbPass = encodeURI("1qaz2wsx");

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
            res.redirect('/');
        });

        //Delete note
        app.get('/deleteNotes/:id', (req, res)  => {
            console.log(req.params.id);
            collection.findOneAndDelete({ _id: ObjectId(req.params.id)}, (err, result) => {
                if (err) return res.send(500, err);
            })
            res.redirect('/');
        });
    })
    .catch(console.error)

app.listen(3000, () => {
    console.log('Listening at port 3000');
});