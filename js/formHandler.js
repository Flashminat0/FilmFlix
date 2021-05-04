$(function () {
    $('[data-form-type="blocs-form"] input,[data-form-type="blocs-form"] textarea').jqBootstrapValidation(
        {
            preventSubmit: true,
            submitSuccess: function ($form, event) {
                if (!$form.attr('action')) {
                    event.preventDefault();

                    var processorFile = getProcessorPath($form);
                    var formData = {};

                    $form.find("input, textarea, option:selected").each(function (e) {
                        var fieldData = $(this).val();
                        var fieldID = $(this).attr('id');

                        if ($(this).is(':checkbox')) {
                            fieldData = $(this).is(":checked");
                        } else if ($(this).is(':radio')) {
                            fieldData = $(this).val() + ' = ' + $(this).is(":checked");
                        } else if ($(this).is('option:selected')) {
                            fieldID = $(this).parent().attr('id');
                        }

                        formData[fieldID] = fieldData;
                    });

                    $.ajax({
                        url: processorFile,
                        type: "POST",
                        data: formData,
                        cache: false,
                        success: function (data) {
                            if ($form.find('#form-feedback-alert').length == 0) {
                                $form.append("<div id='form-feedback-alert' class='mt-2'><div class='alert'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong></strong></div></div>");
                            }

                            if (data == 'capture-error') {
                                $('#form-feedback-alert').addClass('alert-danger').removeClass('alert-success');
                                $('#form-feedback-alert strong').html($form.find('.g-recaptcha').attr('data-capture-warning'));
                            } else if (data == 'capture-connection-error') {
                                $('#form-feedback-alert').addClass('alert-danger').removeClass('alert-success');
                                $('#form-feedback-alert strong').html($form.find('.g-recaptcha').attr('data-capture-fail'));
                            } else {
                                if ($form.is('[data-success-msg]')) {
                                    $('#form-feedback-alert').addClass('alert-success').removeClass('alert-danger');
                                    $('#form-feedback-alert strong').html($form.attr('data-success-msg'));
                                    $form.trigger("reset");
                                } else {
                                    window.location.replace($form.attr('data-success-url'));
                                }
                            }
                        },
                        error: function () {
                            if ($('#form-alert').length == 0) {
                                $form.append("<div id='form-alert' class='mt-2'><div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>" + $form.attr('data-fail-msg') + "</strong></div></div>");
                            }
                        },
                    });
                }
            },
            filter: function () {
                return $(this).is(":visible");
            },
        });


    function getProcessorPath(form) {
        var path = "./includes/" + form.attr('id') + ".php";

        if (form.attr('data-clean-url-used')) {
            path = "." + path;
        } else if (form.attr('template-path')) {
            path = form.attr('template-path') + "/includes/" + form.attr('id') + ".php";
        }

        return path
    }
});