let express = require(`express`);
let app = express();
let port = 3000;
let mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/watchReader').
  catch(error => handleError(error));


app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

// Раздача статики
app.use(express.static(`public`));

app.use(express.urlencoded({ extended: true }));

// Настройка handlebars
const hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');

let schema = new mongoose.Schema({
    title: String,
    text: String
});

let Text = mongoose.model('text', schema);

app.post(`/create`, async function (req, res) {
    let { text, title } = req.body;

    let newText = new Text({
        title: title,
        text: text
    })

    await newText.save();

    res.redirect(`back`)
});

app.post(`/getTextRequest`, async function (req, res) {
    let { title } = req.body;

    let text = await Text.findOne({title: title});

    res.render(`reader`, {text: text.text});
});

app.get(`/getText`, async function (req, res){
    res.render('getText')
});

app.get(`/loadText`, async function (req, res){
    res.render('loadText')
});

app.get(`/`, async function (req, res){
    res.render('getText')
});