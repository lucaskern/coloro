"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#aniMessage").animate({
        width: 'toggle'
    }, 350);
};

var sendAjax = function sendAjax(action, data) {
    $.ajax({
        cache: false,
        type: "POST",
        url: action,
        data: data,
        dataType: "json",
        success: function success(result, status, xhr) {
            $("#aniMessage").animate({
                width: 'hide'
            }, 350);

            window.location = result.redirect;
        },
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);

            handleError(messageObj.error);
        }
    });
};

$(document).ready(function () {
    $("#signupForm").on("submit", function (e) {
        e.preventDefault();

        $("#aniMessage").animate({
            width: 'hide'
        }, 350);

        if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("All fields are required");
            return false;
        }

        if ($("#pass").val() !== $("#pass2").val()) {
            handleError("Passwords do not match");
            return false;
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

        return false;
    });

    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        $("#aniMessage").animate({
            width: 'hide'
        }, 350);

        if ($("#user").val() == '' || $("#pass").val() == '') {
            handleError("Username or password is empty");
            return false;
        }

        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });

    var place = 1;
    var colorNum = 1;
    var colors = [];
    var savedColors = [];
    var currColor = '';
    var rgbVal = '';

    var body = void 0;
    var palette = void 0;
    var swatch = void 0;
    var colorLabel = void 0;

    var init = function init() {
        body = document.querySelector('body');
        $("#currColor h1").fadeIn("slow");
        colorLabel = document.getElementById('currColor');

        palette = document.getElementById('paletteHolder');
        swatch = document.getElementById('');

        //intro();
        controls();
        controlBar();
        getColor();
        setColor();

        $('#colorName').val("rgb(" + colors[place][0] + ',' + colors[place][1] + ',' + colors[place][2] + ")");
    };

    var intro = function intro() {};

    var controlBar = function controlBar() {
        $("#hideSwatch").click(function () {
            $("#paletteHolder").slideToggle("slow", function () {
                // Animation complete.
            });
        });

        $("#newColor").click(function () {
            keyPress(32);
        });

        $("#tint").click(function () {
            keyPress(115);
        });
        $("#lighten").click(function () {
            keyPress(119);
        });

        $("#saveColor").click(function (e) {

            e.preventDefault();

            $("#aniMessage").animate({
                width: 'hide'
            }, 350);

            if ($("#colorName").val() == '') {
                handleError("No Color specified");
                return false;
            }

            $('#colorName').val("rgb(" + colors[place][0] + ',' + colors[place][1] + ',' + colors[place][2] + ")");

            sendAjax($("#colorForm").attr("action"), $("#colorForm").serialize());

            saveColor();
            return false;
        });

        //      $(".paletteBtn").click(function(e) {
        //          copyToClipboard(e.target);
        //      })
    };

    var controls = function controls() {

        body.onkeypress = function (e) {
            keyPress(e.keyCode);
            //console.log(e.keyCode);
        };

        var swatches = document.getElementsByClassName('paletteBtn');
        console.log(swatches);

        var _loop = function _loop(i) {
            swatches.item(i).onclick = function (e) {
                //deleteSwatch(i);
                copyToClipboard(swatches[i]);
            };
        };

        for (var i = 0; i < swatches.length; i++) {
            _loop(i);
        }
    };

    //handle key controls
    var keyPress = function keyPress(keyCode) {

        switch (keyCode) {
            //Space : new color
            case 32:
                if (place < colors.length) {
                    place = colors.length;
                }
                getColor();

                //console.log("space");
                break;
            // Left: Move back
            case 97:
                if (place > 1) {
                    place--;
                    setColor();
                }

                //console.log("back");
                break;
            //Right: Move forward
            case 100:
                if (place < colors.length - 1) {
                    place++;
                    setColor();
                }
                break;
            case 115:
                tint();
                //place++;
                break;
            case 119:
                lighten();
                //place++;
                break;
            case 102:
                saveColor();
                break;
        }

        setColor();

        //console.log(place);
    };

    //add current color to saved array and update palette
    var saveColor = function saveColor() {
        if (colors[place][3] != 's') {
            savedColors.push(colors[place]);
            updatePalette();
        }

        colors[place][3] = 's';
        //console.log('saveColor ran');
    };

    //redraw saved colors
    var updatePalette = function updatePalette() {
        palette.innerHTML = '';

        for (var i = 0; i < savedColors.length; i++) {
            var _rgbVal = "rgb(" + savedColors[i][0] + "," + savedColors[i][1] + "," + savedColors[i][2] + ")";
            palette.innerHTML += "<button class='paletteBtn' title='" + _rgbVal + "' style='background-color:" + _rgbVal + ";'> </button>";
        }

        controls();
    };

    //delete swatch based on array place passed in
    var deleteSwatch = function deleteSwatch(place) {
        savedColors.splice(place, 1);
        updatePalette();
        console.log(colors);
    };

    var copyToClipboard = function copyToClipboard(element) {
        console.log(element);
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).prop('title')).select();
        document.execCommand("copy");
        console.log("copied " + $(element).prop("title"));
        $temp.remove();
    };

    //generate random color
    var getColor = function getColor() {
        var redVal = randomInt(0, 255);
        var greenVal = randomInt(0, 255);
        var blueVal = randomInt(0, 255);

        currColor = 'rgb(' + redVal + ',' + greenVal + ',' + blueVal + ')';

        colors[place] = [redVal, greenVal, blueVal];
        //setColor();

        colorNum++;

        console.log(colors);
    };

    //darken color by 20%
    var tint = function tint() {

        var red = colors[place][0];
        var green = colors[place][1];
        var blue = colors[place][2];

        if (red >= 255) {
            red = 255;
        }

        if (blue >= 255) {
            blue = 255;
        }

        if (green >= 255) {
            green = 255;
        }

        if (red <= 255) {
            red = Math.round(red * .8);
        }

        if (green <= 255) {
            green = Math.round(green * .8);
        }

        if (blue <= 255) {
            blue = Math.round(blue * .8);
        }

        colors[place][0] = red;
        colors[place][1] = green;
        colors[place][2] = blue;

        //setColor();
    };

    //lighten by 20%
    var lighten = function lighten() {
        var red = colors[place][0];
        var green = colors[place][1];
        var blue = colors[place][2];

        if (red < 255) {
            red = Math.round(red / .8);
        }

        if (green < 255) {
            green = Math.round(green / .8);
        }

        if (blue < 255) {
            blue = Math.round(blue / .8);
        }

        colors[place][0] = red;
        colors[place][1] = green;
        colors[place][2] = blue;

        //setColor();
    };

    //set bg color and reset label with current color
    var setColor = function setColor() {
        var redVal = colors[place][0];
        var greenVal = colors[place][1];
        var blueVal = colors[place][2];

        body.style.backgroundColor = 'rgb(' + redVal + ',' + greenVal + ',' + blueVal + ')';
        colorLabel.innerHTML = 'rgb(' + redVal + ',' + greenVal + ',' + blueVal + ')';
    };

    //generate random int
    var randomInt = function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    init();
});
