var mailer = require("nodemailer");

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport('smtps://museq.notifications%40gmail.com:pleasenotifyme@smtp.gmail.com');

module.exports.vote = function(email) {
	
	sendMail({
	    from: "Museq <museq.notifications@gmail.com>",
	    to: email,
	    subject: "Ready to vote?",
	    text: "http://museq.nozemans.com/",
	    html: "<a href=\"http://museq.nozemans.com/\">museq.nozemans.com</a>"		    	
	});
}

module.exports.general = function(emails) {
	
	sendMail({
	    from: "Museq <museq.notifications@gmail.com>",
	    bcc: emails,
	    subject: "Ready to continue?",
	    text: "http://museq.nozemans.com/",
	    html: "<a href=\"http://museq.nozemans.com/\">museq.nozemans.com</a>"		    	
	});
	
}

module.exports.create = function(email) {
	
	sendMail({
	    from: "Museq <museq.notifications@gmail.com>",
	    to: email,
	    subject: "Ready to create?",
	    text: "http://museq.nozemans.com/",
	    html: "<a href=\"http://museq.nozemans.com/\">museq.nozemans.com</a>"		    	
	});
	
}

function sendMail(mail) {

	smtpTransport.sendMail(mail, function(error, response){
		
	    if(error){
	        console.log(error);
	    }else{
	        console.log(response);
	    }
	    smtpTransport.close();
	    
	});	

	
}




