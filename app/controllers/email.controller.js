const nodemailer = require('nodemailer');


exports.send = (email, token) => {
    console.log("SEND EMAIL: ", email);

    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'listupapp@outlook.com',
            pass: 'lua3571113'
        }
    });

    var mailOptions = {
        from: 'listupapp@outlook.com',
        to: email,
        subject: 'ListUP - confirmação de email',
        text: '<a href="http://192.168.15.12:3000/user/confirm/' + token+'">Clique aqui para confirmar sua conta</a>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


};