$(function()
{	
	$('[data-form-type="blocs-form"] input,[data-form-type="blocs-form"] textarea').jqBootstrapValidation(
    {
     	preventSubmit: true,
     	submitSuccess: function($form, event)
	 	{			
			if(!$form.attr('action')) // Check form doesnt have action attribute
			{
				event.preventDefault(); // prevent default submit behaviour
			
				var processorFile = getProcessorPath($form);
				var formData = {};

				$form.find("input, textarea, option:selected").each(function(e) // Loop over form objects build data object
				{		
					var fieldData =  $(this).val();
					var fieldID =  $(this).attr('id');
				
					if($(this).is(':checkbox')) // Handle Checkboxes
					{
						fieldData = $(this).is(":checked");
					}
					else if($(this).is(':radio')) // Handle Radios
					{
						fieldData = $(this).val()+' = '+$(this).is(":checked");
					}
					else if($(this).is('option:selected')) // Handle Option Selects
					{
						fieldID = $(this).parent().attr('id');
					}
					
					formData[fieldID] = fieldData;		
				});
	
				$.ajax({
		        	url: processorFile,
		    		type: "POST",
		    		data: formData,
		    		cache: false,
		    		success: function(data) // Success
		 			{  
		 				if ($form.find('#form-feedback-alert').length == 0) // Add Alert
		 				{
		 					$form.append("<div id='form-feedback-alert' class='mt-2'><div class='alert'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong></strong></div></div>");
		 				}
		 				
		 				if (data == 'capture-error') // Capture Error
		 				{
		 					$('#form-feedback-alert').addClass('alert-danger').removeClass('alert-success');
		 					$('#form-feedback-alert strong').html($form.find('.g-recaptcha').attr('data-capture-warning'));
		 				}
		 				else if (data == 'capture-connection-error') // Capture Connection Error
		 				{
		 					$('#form-feedback-alert').addClass('alert-danger').removeClass('alert-success');
		 					$('#form-feedback-alert strong').html($form.find('.g-recaptcha').attr('data-capture-fail'));
		 				}
		 				else // Success
		 				{
		 					if ($form.is('[data-success-msg]')) // Show Success Message
							{
								$('#form-feedback-alert').addClass('alert-success').removeClass('alert-danger');
		 						$('#form-feedback-alert strong').html($form.attr('data-success-msg'));
								$form.trigger("reset"); // Clear Form	
							}
							else // Re-Direct
							{
								window.location.replace($form.attr('data-success-url'));
							}	
		 				}
		 	   		},
			   		error: function() // Fail
			   		{
						if($('#form-alert').length == 0)
						{
							$form.append("<div id='form-alert' class='mt-2'><div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+$form.attr('data-fail-msg')+"</strong></div></div>");
						}	
			   		},
		   		});
			}
         },
         filter: function() // Handle hidden form elements
		 {
			 return $(this).is(":visible");
         },
	 });
	 
	 // Get Path to processor PHP file
	 function getProcessorPath(form)
	 {
		var path = "./includes/"+form.attr('id')+".php";
		
		if (form.attr('data-clean-url-used')) // Clean URL use Double Dot
		{
			path = "."+path;
		}
		else if (form.attr('template-path')) // Check For Template path
		{
			path = form.attr('template-path')+"/includes/"+form.attr('id')+".php";
		}
		
	 	return path
	 }
});