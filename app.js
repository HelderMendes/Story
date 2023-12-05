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

    // client.setConfig({
    //     apiKey: '8cfb8f2b7eb7ad8a01582a3be3858db5-us8',
    //     server: 'us8',
    // });

    // const run = async () => {
    //     const response = await client.lists.addListMember('147bc0b357', {
    //         email_address: 'cmhelder@xs4all.nl',
    //         status: 'subscribed',
    //         merge_fields: {
    //             FNAME: 'António',
    //             LNAME: 'Correia',
    //         },
    //     });
    //     console.log(response);
    // };

    // run();

    const url = 'https://us8.api.mailchimp.com/3.0/lists/147bc0b357AA';
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

// api key to helder_design
// 8cfb8f2b7eb7ad8a01582a3be3858db5-us8

// list ID;
// 147bc0b357

// mailchimp.setConfig({
//     apiKey: '8cfb8f2b7eb7ad8a01582a3be3858db5-us8',
//     server: 'us8',
// });

// // const listId = '147bc0b357';

// async function run01() {
//     const response = await mailchimp.ping.get();
//     console.log(response);
// }

// run01();

// const listId = '147bc0b357';
// const subscribingUser = {
//     firstName: 'Prudence',
//     lastName: 'McVankab',
//     email: 'test.p.t@example.com',
// };

// async function run() {
//     const response = await mailchimp.lists.addListMember(listId, {
//         email_address: subscribingUser.email,
//         status: 'subscribed',
//         merge_fields: {
//             FNAME: subscribingUser.firstName,
//             LNAME: subscribingUser.lastName,
//         },
//     });

//     console.log(
//         `Successfully added contact as an audience member. The contact's id is ${response.id}.`
//     );
// }

// run();
