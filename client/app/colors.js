const handleColor = (e) => {
    e.preventDefault();
    
    $("#aniMessage").animate({width:"hide"},350);
    
    if ($("#colorName").val() == '') {
        handleError("All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#colorForm").attr("action"), $("#colorForm").serialize(), function() {
        loadColorsFromServer();
    });
    
    return false;
};

const ColorForm = (props) => {
    return (
    <form id="colorForm" 
        name="colorForm" 
        onSubmit={handleColor}
        action="/colors" 
        method="POST" 
        className="colorForm">
            
      <label htmlFor="name">Color Name: </label>
      <input id="colorName" type="text" name="name" placeholder="Color Rgb"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeColorSubmit" type="submit" value="Make Color" />
    </form>    
    );
};

const MainHolder = (props) => {
    return (   
        <div>
        <h1 id="currColor"> Red </h1>

        <div id="controls">
            <ul>
                <li id="adElement" className="controlBox adElementC">
                    <div className="control">
                        <p> YOUR AD HERE </p>
                    </div>
                </li>
                <li id="newColor" className="controlBox">
                    <div className="control">
                        <p> New Color </p>
                    </div>
                </li>
                <li id="saveColor" className="controlBox">
                    <div className="control">
                        <p> Save Color </p>
                    </div>
                </li>
                <li id="hideSwatch" className="controlBox">
                    <div className="control">
                        <p> Hide Swatches </p>
                    </div>
                </li>
                <li id="tint" className="controlBox">
                    <div className="control">
                        <p> Tint </p>
                    </div>
                </li>
                <li id="lighten" className="controlBox">
                    <div className="control">
                        <p> Lighten </p>
                    </div>
                </li>
                <li id="adElement" className="controlBox adElementC">
                    <div className="control">
                        <p> YOUR AD HERE </p>
                    </div>
                </li>
            </ul>
        </div>     
        </div>
    );
};


const ColorList = function(props) {
    //console.log("wtf");
  if(props.colors.length === 0) {
      return (
        <div className="colorList">
              <h3 className="emptyColor"> No colors yet </h3>
        </div>
      );
  }
    
    const colorNodes = props.colors.map(function(color) {
        
        var styles = {
	       backgroundColor:color.name,
        };
        
        return (
            <button className='paletteBtn' key={color._id} title={color.name} style={styles}> </button>
        );
    });
    
    return (
        <div className="colorList">
            {colorNodes}
        </div>
    );
};

const loadColorsFromServer = () => {
    sendAjax("GET", '/getColors', null, (data) => {
        console.log(data);
        ReactDOM.render(
        <ColorList colors={data.colors} />, document.querySelector("#paletteHolder")
      );  
    });
    
    //controls();
};

const setup = function(csrf) {
    
    const premiumButton = document.querySelector("#premiumButton");
    
    premiumButton.addEventListener("click", (e) => {
       e.preventDefault();
        createPremium(csrf);
        return false;
    });
    
  ReactDOM.render(
    <ColorForm csrf={csrf} />, document.querySelector("#makeColor")
  );
    
 ReactDOM.render(
    <MainHolder csrf={csrf} />, document.querySelector("#mainHolder")
 );
    
  ReactDOM.render(
    <ColorList colors={[]}/>, document.querySelector("#paletteHolder")
  );

  loadColorsFromServer();

    let place = 1;
    let colorNum = 1;
    let colors = [];
    let savedColors = [];
    let currColor = '';
    let rgbVal = '';

    let body;
    let palette;
    let swatch;
    let colorLabel;

    let init = function () {
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
    }

    let intro = function () {

    }

    let controlBar = function () {
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
            sendAjax('POST', $("#colorForm").attr("action"), $("#colorForm").serialize(), function() {
                loadColorsFromServer();
            });
            
            saveColor();
            return false;
        });

        //      $(".paletteBtn").click(function(e) {
        //          copyToClipboard(e.target);
        //      })
    }

    let controls = function () {

        body.onkeypress = function (e) {
            keyPress(e.keyCode);
            //console.log(e.keyCode);
        }

        let swatches = document.getElementsByClassName('paletteBtn');
        //console.log(swatches);

        for (let i = 0; i < swatches.length; i++) {
            swatches.item(i).onclick = function (e) {
                //deleteSwatch(i);
                copyToClipboard(swatches[i]);
            }
        }
    }

    //handle key controls
    let keyPress = function (keyCode) {

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
    }

    //add current color to saved array and update palette
    let saveColor = function () {
        if (colors[place][3] != 's') {
            savedColors.push(colors[place]);
            updatePalette();
        }

        colors[place][3] = 's';
        //console.log('saveColor ran');
    }

    //redraw saved colors
    let updatePalette = function () {
        palette.innerHTML = '';

        for (let i = 0; i < savedColors.length; i++) {
            let rgbVal = "rgb(" + savedColors[i][0] + "," + savedColors[i][1] + "," + savedColors[i][2] + ")";
            palette.innerHTML += "<button class='paletteBtn' title='" + rgbVal + "' style='background-color:" + rgbVal + ";'> </button>"
        }

        controls();
    }

    //delete swatch based on array place passed in
    let deleteSwatch = function (place) {
        savedColors.splice(place, 1);
        updatePalette();
        console.log(colors);
    }

    let copyToClipboard = function (element) {
        console.log(element);
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).prop('title')).select();
        document.execCommand("copy");
        console.log("copied " + $(element).prop("title"));
        $temp.remove();
    }

    //generate random color
    let getColor = function () {
        let redVal = randomInt(0, 255);
        let greenVal = randomInt(0, 255);
        let blueVal = randomInt(0, 255);

        currColor = 'rgb(' + redVal + ',' + greenVal + ',' + blueVal + ')';

        colors[place] = [redVal, greenVal, blueVal];
        //setColor();

        colorNum++;

        console.log(colors);
    }

    //darken color by 20%
    let tint = function () {

        let red = colors[place][0];
        let green = colors[place][1];
        let blue = colors[place][2];

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
    }

    //lighten by 20%
    let lighten = function () {
        let red = colors[place][0];
        let green = colors[place][1];
        let blue = colors[place][2];

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
    }

    //set bg color and reset label with current color
    let setColor = function () {
        let redVal = colors[place][0];
        let greenVal = colors[place][1];
        let blueVal = colors[place][2];

        body.style.backgroundColor = 'rgb(' + redVal + ',' + greenVal + ',' + blueVal + ')';
        colorLabel.innerHTML = 'rgb(' + redVal + ',' + greenVal + ',' + blueVal + ')';
    }

    //generate random int
    let randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    init();
    
    console.log("load Colors ran");
};

const getToken = () => {
       
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
     console.log("get token ran");
};

const Premium = (props) => {
    return (
        <div className="premiumMain">
            <h1> Buy premium and get: </h1>
            <ul>
            <li> Unlimited palettes! </li>
            <li> Bragging rights with your friends! </li>
            <li> A lighter wallet! </li>
            </ul>
            <h3> only 1000$ a month</h3>
            <a href="https://www.gofundme.com/fight-cancer-with-james"> Buy Now </a>
        </div>
    );
};

const createPremium = (csrf) => {
    ReactDOM.render(
        <Premium csrf={csrf} />,
        document.querySelector("#mainHolder")
    );
};

$(document).ready(function() {
       getToken();     
    
});