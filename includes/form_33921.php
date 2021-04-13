<?php	
	if (empty($_POST['name_33921']) && strlen($_POST['name_33921']) == 0 || empty($_POST['email_33921']) && strlen($_POST['email_33921']) == 0 || empty($_POST['pass_123']) && strlen($_POST['pass_123']) == 0 || empty($_POST['re_pass_123']) && strlen($_POST['re_pass_123']) == 0)
	{
		return false;
	}
	
	$name_33921 = $_POST['name_33921'];
	$email_33921 = $_POST['email_33921'];
	$pass_123 = $_POST['pass_123'];
	$re_pass_123 = $_POST['re_pass_123'];
	$optin_33921 = $_POST['optin_33921'];
	
	$to = 'receiver@yoursite.com'; // Email submissions are sent to this email

	// Create email	
	$email_subject = "Message from a Blocs website.";
	$email_body = "You have received a new message. \n\n".
				  "Name_33921: $name_33921 \nEmail_33921: $email_33921 \nPass_123: $pass_123 \nRe_Pass_123: $re_pass_123 \nOptin_33921: $optin_33921 \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: contact@yoursite.com\n";
	$headers .= "Reply-To: $re_pass_123";	
	
	mail($to,$email_subject,$email_body,$headers); // Post message
	return true;			
?>