"use strict";

var countCol = 0;
var handleColor = function handleColor(e) {
    e.preventDefault();

    $("#aniMessage").animate({ width: "hide" }, 350);

    if ($("#colorName").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#colorForm").attr("action"), $("#colorForm").serialize(), function () {
        loadColorsFromServer();
    });

    return false;
};

var ColorForm = function ColorForm(props) {
    return React.createElement(
        "form",
        { id: "colorForm",
            name: "colorForm",
            onSubmit: handleColor,
            action: "/colors",
            method: "POST",
            className: "colorForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Color Name: "
        ),
        React.createElement("input", { id: "colorName", type: "text", name: "name", placeholder: "Color Rgb" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeColorSubmit", type: "submit", value: "Make Color" })
    );
};

var MainHolder = function MainHolder(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h1",
            { id: "currColor" },
            " Red "
        ),
        React.createElement(
            "div",
            { id: "controls" },
            React.createElement(
                "ul",
                null,
                React.createElement(
                    "li",
                    { id: "adElement", className: "controlBox adElementC" },
                    React.createElement(
                        "div",
                        { className: "control" },
                        React.createElement(
                            "p",
                            null,
                            " YOUR AD HERE "
                        )
                    )
                ),
                React.createElement(
                    "li",
                    { id: "newColor", className: "controlBox" },
                    React.createElement(
                        "div",
                        { className: "control" },
                        React.createElement(
                            "p",
                            null,
                            " New Color "
                        )
                    )
                ),
                React.createElement(
                    "li",
                    { id: "saveColor", className: "controlBox" },
                    React.createElement(
                        "div",
                        { className: "control" },
                        React.createElement(
                            "p",
                            null,
                            " Save Color "
                        )
                    )
                ),
                React.createElement(
                    "li",
                    { id: "hideSwatch", className: "controlBox" },
                    React.createElement(
                        "div",
                        { className: "control" },
                        React.createElement(
                            "p",
                            null,
                            " Hide Swatches "
                        )
                    )
                ),
                React.createElement(
                    "li",
                    { id: "tint", className: "controlBox" },
                    React.createElement(
                        "div",
                        { className: "control" },
                        React.createElement(
                            "p",
                            null,
                            " Tint "
                        )
                    )
                ),
                React.createElement(
                    "li",
                    { id: "lighten", className: "controlBox" },
                    React.createElement(
                        "div",
                        { className: "control" },
                        React.createElement(
                            "p",
                            null,
                            " Lighten "
                        )
                    )
                ),
                React.createElement(
                    "li",
                    { id: "adElement", className: "controlBox adElementC" },
                    React.createElement(
                        "div",
                        { className: "control" },
                        React.createElement(
                            "p",
                            null,
                            " YOUR AD HERE "
                        )
                    )
                )
            )
        )
    );
};

var ColorList = function ColorList(props) {
    //console.log("wtf");
    if (props.colors.length === 0) {
        return React.createElement(
            "div",
            { className: "colorList" },
            React.createElement(
                "h3",
                { className: "emptyColor" },
                " No colors yet "
            )
        );
    }

    var colorNodes = props.colors.map(function (color) {

        var styles = {
            backgroundColor: color.name
        };

        return React.createElement(
            "button",
            { className: "paletteBtn", key: color._id, title: color.name, style: styles },
            " "
        );
    });

    return React.createElement(
        "div",
        { className: "colorList" },
        colorNodes
    );
};

var loadColorsFromServer = function loadColorsFromServer() {
    sendAjax("GET", '/getColors', null, function (data) {
        //console.log(data);
        ReactDOM.render(React.createElement(ColorList, { colors: data.colors }), document.querySelector("#paletteHolder"));
    });

    //controls();
};

var appCode = function appCode() {
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

            //console.log(document.querySelector("#colorForm"));
            //handleColor();
            sendAjax('POST', $("#colorForm").attr("action"), $("#colorForm").serialize(), function () {
                loadColorsFromServer();
            });

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
        //console.log(swatches);

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

        //console.log(colors);
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

    console.log("load Colors ran");
};

var setup = function setup(csrf) {

    var premiumButton = document.querySelector("#premiumButton");

    premiumButton.addEventListener("click", function (e) {
        e.preventDefault();
        countColors();
        createPremium(csrf);
        return false;
    });

    var appButton = document.querySelector("#colorsButton");

    appButton.addEventListener("click", function (e) {
        e.preventDefault();
        countColors();
        createApp(csrf);
        return false;
    });

    var acctButton = document.querySelector("#acctButton");

    acctButton.addEventListener("click", function (e) {
        e.preventDefault();
        countColors();
        createAccount(csrf);
        return false;
    });

    createApp(csrf);

    loadColorsFromServer();

    countColors();

    //appCode();
};

var getToken = function getToken() {

    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
    //console.log("get token ran");
};

var Premium = function Premium(props) {
    return React.createElement(
        "div",
        { className: "premiumMain" },
        React.createElement(
            "h1",
            null,
            " Buy premium and get: "
        ),
        React.createElement(
            "ul",
            null,
            React.createElement(
                "li",
                null,
                " Unlimited palettes! "
            ),
            React.createElement(
                "li",
                null,
                " Bragging rights with your friends! "
            ),
            React.createElement(
                "li",
                null,
                " A lighter wallet! "
            )
        ),
        React.createElement(
            "h3",
            null,
            " only 1000$ a month"
        ),
        React.createElement(
            "a",
            { href: "https://www.gofundme.com/fight-cancer-with-james" },
            " Buy Now "
        )
    );
};

var countColors = function countColors() {
    sendAjax("GET", '/getColors', null, function (data) {
        //console.log(data);
        countCol = data.colors.length;
        //console.log("counted are: " + countCol);
    });

    //controls();
};

var AccountPage = function AccountPage(props) {

    countColors();
    var countColVal = countCol;

    //console.log(countCol);

    return React.createElement(
        "div",
        { className: "premiumMain" },
        React.createElement(
            "h1",
            null,
            " This is your account page "
        ),
        React.createElement(
            "h3",
            null,
            " You have ",
            countColVal,
            " Palettes "
        ),
        React.createElement(
            "h4",
            null,
            " Remember to buy premium if you want unlimited palettes! "
        )
    );
};

var createPremium = function createPremium(csrf) {
    ReactDOM.render(React.createElement(Premium, { csrf: csrf }), document.querySelector("#mainHolder"));
};

var createAccount = function createAccount(csrf) {
    ReactDOM.render(React.createElement(AccountPage, { csrf: csrf }), document.querySelector("#mainHolder"));
};

var createApp = function createApp(csrf) {
    ReactDOM.render(React.createElement(ColorForm, { csrf: csrf }), document.querySelector("#makeColor"));

    ReactDOM.render(React.createElement(MainHolder, { csrf: csrf }), document.querySelector("#mainHolder"));

    ReactDOM.render(React.createElement(ColorList, { colors: [] }), document.querySelector("#paletteHolder"));

    loadColorsFromServer();

    appCode();
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#aniMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#aniMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      console.warn(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
