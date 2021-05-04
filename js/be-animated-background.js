$('div[id^="be-animBackground"]').each(function( index ) {
    var thisID = $( this ).attr('id');

var color1 = $("#" + thisID).attr("data-color1");
var color2 = $("#" + thisID).attr("data-color2");
var color3 = $("#" + thisID).attr("data-color3");
var color4 = $("#" + thisID).attr("data-color4");

$('head').append('<style type="text/css">body{background: linear-gradient(-45deg,' + color4 + ', ' + color3 + ', ' + color2 + ', ' + color1 + ');}</style>');

$('head').append('<style type="text/css">.anim-background{background: rgba(255, 255, 255, 0.0)!important;}</style>');

});