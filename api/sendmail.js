

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

var buildPlain = function( contentObject ) {
    var output = '';
    for (var key in contentObject) {
        
        output +=  contentObject[key]["headline"] + "\n";
        output +=  contentObject[key]["paragraph"] + "\n\n";
    }
    return output;
}
var buildHTML= function( contentObject ) {
    var output = '';
    for (var key in contentObject) {
        if (contentObject[key]["headline"]) {      
        output +=  "<h1 style='color:#334488'; font-family:'Tahoma'; font-weight:bold;>" + contentObject[key]["headline"] + "</h1>";}
        output +=  "<p>" + contentObject[key]["paragraph"] + "</p>";
    }
    return output;
}
var sendCFMessage = function( resObj ) {
    
  var headline = "A message from the Contact Form on the Reclaiming Loom:<br>";
  var paragraph = "From: " + resObj.firstname + ' ' + resObj.lastname + "<br>";
  var paragraph2 = "Their message: " + resObj.message;
  paragraph2 += "-end of message.<br>";
  var paragraph3 = resObj.firstname + ' ' + resObj.lastname +"<br>";
  paragraph3 += resObj.email + "<br>";
  paragraph3 += resObj.phone + "<br><br>";

  var welcomeEmail = [
    {
      "headline": headline,
      "paragraph": paragraph,
      }, 
      {
         "headline": null,
         "paragraph": paragraph2 
      },
      {
          "headline": null,
          "paragraph": paragraph3
      }
  ];
  var textBody = buildPlain( welcomeEmail );
  var htmlBody = buildHTML( welcomeEmail );

  var myMailBody = {
      "personalizations": [
        {
          "to": [
            {
              "email": "b0rgBart3@gmail.com"
            }
          ],
          "subject": "A message from the Contact Form of the Reclaiming Loom"
        }
      ],
      "from": {
        "email": "info@reclaimingloom.org"
      },
      "content": [
        {
          "type": "text/plain",
          "value": textBody
        },
        {
            "type": "text/html",
            "value": htmlBody
        }
      ]
    };

  var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: myMailBody,
    });
    
  console.log("Sending Contact Form Message");
  
  sg.API(request, function(error, response) {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
  });
}

var sendWelcome = function( resourceObject ) {
    
    var headline = "Welcome to the Reclaiming Loom, " + resourceObject.firstname + ".";
    var paragraph = "Your account has been successfully created.";
    var paragraph2 = "You can now LOG IN to the Loom " +
    "by going to https://thawing-reaches-29763.herokuapp.com/#/login and entering the " +
    "credentials you used to create your account.";
    var paragraph3 = "Thank you for joining the Reclaiming Loom!";

    var welcomeEmail = [
      {
        "headline": headline,
        "paragraph": paragraph,
        }, 
        {
           "headline": null,
           "paragraph": paragraph2 
        },
        {
            "headline": null,
            "paragraph": paragraph3
        }
    ];
    var textBody = buildPlain( welcomeEmail );
    var htmlBody = buildHTML( welcomeEmail );

    var myMailBody = {
        "personalizations": [
          {
            "to": [
              {
                "email": resourceObject.email
              }
            ],
            "subject": "Welcome to the Reclaiming Loom"
          }
        ],
        "from": {
          "email": "info@reclaimingloom.org"
        },
        "content": [
          {
            "type": "text/plain",
            "value": textBody
          },
          {
              "type": "text/html",
              "value": htmlBody
          }
        ]
      };

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: myMailBody,
      });
      
    console.log("Sending Welcome Email");
    
    sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    });
}

var sendMail = function(req) {
    user_email = req.body.email;

    console.log("In SendMail: email==" + user_email);

    var htmlBody = "<h1 style='color:#334488;'>Helloo, there " + user_email + "!</h1>" +
     "<p>Now I am including parameters in my emails</p>";
    
    var textBody = "Hello there " + user_email + "\nNow I am including parameters in my emails.";


    var myMailBody = {
        "personalizations": [
          {
            "to": [
              {
                "email": user_email
              }
            ],
            "subject": "Combined Email"
          }
        ],
        "from": {
          "email": "info@reclaimingloom.org"
        },
        "content": [
          {
            "type": "text/plain",
            "value": textBody
          },
          {
              "type": "text/html",
              "value": htmlBody
          }
        ]
      };

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: myMailBody,
      });
      

    sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    });
}


var sendReset = function( resourceObject ) {
    
    console.log("About to send reset email.");
    var headline = "A Message from the Reclaiming Loom";
    var paragraph = "We have received a request to reset your password.";
    var paragraph2 = "If you requested this reset, please go here:" +
    "https://thawing-reaches-29763.herokuapp.com/reset/" + resourceObject.resetKey + 
    " and then enter " +
    " the new password you would like to use for your account.";
    var paragraph3 = "Thank you.";

    var welcomeEmail = [
      {
        "headline": headline,
        "paragraph": paragraph,
        }, 
        {
           "headline": null,
           "paragraph": paragraph2 
        },
        {
            "headline": null,
            "paragraph": paragraph3
        }
    ];
    var textBody = buildPlain( welcomeEmail );
    var htmlBody = buildHTML( welcomeEmail );
    var myMailBody = buildBody( resourceObject.email, "Request for Reset", textBody, htmlBody);
    

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: myMailBody,
      });
      
    console.log("Sending Reset Email");
    
    sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    });
}

var buildBody = function( toEmail, subjectLine, text, html ) {
    console.log("In buildBody: email==" + toEmail);

    var body = {
        "personalizations": [
          {
            "to": [
              {
                "email": toEmail
              }
            ],
            "subject": subjectLine
          }
        ],
        "from": {
          "email": "info@reclaimingloom.org"
        },
        "content": [
          {
            "type": "text/plain",
            "value": text
          },
          {
              "type": "text/html",
              "value": html
          }
        ]
      };
    return body;
}

module.exports.sendMail = sendMail;
module.exports.sendWelcome = sendWelcome;
module.exports.sendReset = sendReset;
module.exports.sendCFMessage = sendCFMessage;



