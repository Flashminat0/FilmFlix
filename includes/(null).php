<?php	
	if (empty($_POST['']) && strlen($_POST['']) == 0)
	{
		return false;
	}
	
	$ = $_POST[''];
	
	$to = '(null)'; // Email submissions are sent to this email

	// Create email	
	$email_subject = "(null)";
	$email_body = "(null) \n\n".
				  ": $ \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: (null)\n";
	$headers .= "Reply-To: DoNotReply@yoursite.com";	
	
	mail($to,$email_subject,$email_body,$headers); // Post message
	return true;			
?>