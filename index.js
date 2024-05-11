const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        res.render('index', {files: files});
    })
});

app.post('/create', (req, res)=>{
    if(req.body.title != ""){
        const name = req.body.title;
        let i=name.length-1;
        for(; i>=0 && name[i] === ' '; i--);
        let title = "";
        for(let j=0; j<=i; j++){
            title += name[j];
        }
        if(title!=""){
            fs.writeFile(`./files/${title.split(' ').join('_')}.txt`, `${req.body.details}`,(err)=> {
                // console.log('file created......');
            });
        }
    }
    res.redirect('/');
})

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8' ,(err, filedata) => {
        res.render('show', {filename: req.params.filename, filedata: filedata});
    });
})

app.get('/edit/:filename', (req, res) => {
    res.render('edit', {filename: req.params.filename});
})

app.post('/edit', (req, res) => {
    if(req.body.new != ""){
        const name = req.body.new;
        let i=name.length-1;
        for(; i>=0 && name[i] === ' '; i--);
        let newName = "";
        for(let j=0; j<=i; j++){
            newName += name[j];
        }
        fs.rename(`./files/${req.body.prev.split(' ').join('_')}.txt`, `./files/${newName.split(' ').join('_')}.txt`, (err) => {
            // console.log('file name edited....');
        });
    }
    res.redirect('/');
});

app.listen(3000, () => {
    // console.log(' / running.....')
});