const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mailchimp = require('@mailchimp/mailchimp_marketing');
const client = require('@mailchimp/mailchimp_marketing');
const https = require('node:https');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us8.api.mailchimp.com/3.0/lists/147bc0b357';
    var options = {
        method: 'POST',
        auth: 'helderMChimp:8cfb8f2b7eb7ad8a01582a3be3858db5-us8',
    };
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
            // res.send('There was a error');
        }

        response.on('data', (d) => {
            console.log(JSON.parse(d));
        });
        console.log('statusCode:', res.statusCode);
    });

    request.write(jsonData);
    request.end();
    console.log(firstName, lastName, email);
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('The server is listening on port 3000');
});
