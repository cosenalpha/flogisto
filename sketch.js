let slideIndex = [1];
let l = 0; // scorrimento delle interfacce
showSlides(slideIndex);

let slider = document.getElementById("myRange");
let altezza;
let stampaDati;
let massaG;
let tagSlider;

let serial; // variable for the serial object
let latestData; // variable to hold the data

let sensors = [0, 0];
let massa = 0;
let tassoAlc = 0;
let idratazione;
let valEn;
let valEc;
let codiceUtente;

let heig;
let mass;
let fatMass;
let alcLevel;
let hydra;
let energy;
let money;
let utente;
let oggi;

let clock = 1000; //5 secondi
let timer;
let expAlt;

let page;

// **************************** AGE & GENDER DETECTION ****************************

const video = document.getElementById("webcam");
let età = [];
let etaAvg;
let genere;
let varGen = 0; // 12.1 se l'utente è maschio, 0 se l'utente è femmina
let outData;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  // faceapi.nets.faceExpressionNet.loadFromUri('./models'),
  faceapi.nets.ageGenderNet.loadFromUri("./models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { video: true },
      function (stream) {
        var video = document.querySelector("video");
        //  video.style.display = "none";
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
          video.play();
        };
      },
      function (err) {
        console.log(err.name);
      }
    );
  } else {
    document.body.innerText = "getUserMedia not supported";
    console.log("getUserMedia not supported");
  }
}

if (video) {
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const predictions = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      // .withFaceExpressions()
      .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(predictions, displaySize);
    // resizedDetections.style.display = "none";
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    resizedDetections.forEach((result) => {
      const { age, gender, genderProbability } = result;
      // new faceapi.draw.DrawTextField(
      //   [
      //     `${faceapi.round(age, 0)} years`,
      //     `${gender} (${faceapi.round(genderProbability)})`
      //   ],
      //   result.detection.box.bottomRight
      // ).draw(canvas);
      età.push(faceapi.round(age, 0));
      genere = gender;
      if (genere == "male") {
        varGen = 12.1;
      } else if (genere == "female") {
        varGen = 0;
      }

      if (faceapi.round(genderProbability) >= 0.9) {
        console.log("Genere: " + genere);
        // document.getElementById("massaVar").innerText = genere;

        // document.getElementById("prediction").innerText = "Gender: " + genere;
      }

      if (età.length == 20) {
        let count = 0;
        for (let i = 0; i < età.length; i++) {
          count = count + età[i];
        }
        etaAvg = faceapi.round(count / età.length, 0);
        console.log("Età: " + etaAvg);
        // document.getElementById("prediction1").innerText = "Età: "+ faceapi.round(count / età.length);
      }
      if ((genere == "male" || genere == "female") && etaAvg) {
        video.pause();
      }
    });
  }, 100);
});
}

// ************************************* SETUP *************************************

function setup() {
  timer = millis();
  massaG = 23;
  stampaDati = round(massaG);

  tagSlider = document.getElementById("tagSlider");
  altezza = nf(slider.value / 100, 1, 2);
  tagSlider.innerHTML = altezza + "m"; // Display the default slider value
}

// *************************** CODICE SLIDER ***************************

slider.oninput = function () {
  timer = millis();
  expAlt = this.value;
  altezza = nf(this.value / 100, 1, 2);
  tagSlider.innerHTML = altezza + "m";
  console.log(altezza);
  outData = altezza;
};

function keyPressed() {
  if (keyCode === ENTER && [slideIndex[l] - 1] == 1) {
    plusSlides(1);
  }
}

// **************************** CALCOLO MASSA GRASSA ****************************
// FORMULA DI JACKSON-POLLOCK
// Grasso corporeo % = (1.61 x BMI) + (0.13 x età) - (12.1 x sesso) - 13.9;
// BMI = peso / altezza ^ 2;
// sesso = 1 se maschio ; sesso = 0 se femmina;

// **************************** CALCOLO IDRATAZIONE ****************************
// FORMULA DI WATSON
// Male TBW = 2.447 - (0.09156 x age) + (0.1074 x height) + (0.3362 x weight)
// Female TBW = -2.097 + (0.1069 x height) + (0.2466 x weight)

function invioDati() {
  massa = round(sensors[1]);
  tassoAlc = sensors[0];

  if (!tassoAlc) {
    tassoAlc = 0;
  }
  console.log("VarGen: " + varGen);
  console.log("Massa: " + massa);
  console.log("Altezza: " + altezza);
  console.log("EtàAvg: " + etaAvg);
  console.log("Tasso Alcolemico: " + tassoAlc);

  // if (massa == 0) {
    if (altezza > 1.40 && altezza < 1.50) {
      massa = round(random(40, 47));
    } else if ( altezza >= 1.50 && altezza < 1.60) {
      massa = round(random(48, 57));
    } else if ( altezza >= 1.60 && altezza < 1.70) {
      massa = round(random(55, 73));
    } else if ( altezza >= 1.70 && altezza < 1.80) {
      massa = round(random(60, 78));
    } else if ( altezza >= 1.80 && altezza < 1.90) {
      massa = round(random(70, 83));
    } else if ( altezza >= 1.90) {
      massa = round(random(80, 95));
    }
  

  if (!etaAvg) {
    etaAvg = random(20, 50);
  }

  massaG = round(
    (1.61 * massa) / (altezza * altezza) + 0.13 * etaAvg - varGen - 13.9
  );
  if (!massaG) {
    massaG = random(19, 28);
  }

  if (genere == "male") {
    idratazione = round(
      ((2.447 - 0.09156 * etaAvg + 0.1074 * expAlt + 0.3362 * massa) / massa) *
        100
    );
  } else if (genere == "female") {
    idratazione = round(
      ((-2.097 + 0.1069 * expAlt + 0.2466 * massa) / massa) * 100
    );
  }

  if (!idratazione) {
    idratazione = random(40, 60);
  }

  valEn = nf(round((
    tassoAlc +
      massa * massa +
      massa * (massaG / 100) -
      massa * (idratazione / 100)) / 10));
  valEc = nf(round(valEn * 53.75));

  stampaDati = nf(massa + " kg\nmassa grassa  . . . . . . " + (massaG) + "%\nidratazione   . . . . . . " + round(idratazione) + "%\naltezza   . . . . . . . . " + altezza + " m\n\nVALORE ENERGETICO: " + valEn + " kWh \nVALORE ECONOMICO:  " + valEc + " EURO" + codiceUtente);

  console.log("Massa grassa: " + stampaDati);

  serial.clear(); // clears the buffer of any outstanding data
  serial.write(stampaDati); // send a byte to the Arduino

  heig = document.getElementById("heig");
  heig.innerHTML = altezza + " m"; 

  mass = document.getElementById("mass");
  mass.innerHTML = massa + " kg"; 

  fatMass = document.getElementById("fatMass");
  fatMass.innerHTML = massaG + " %"; 

  alcLevel = document.getElementById("alcLevel");
  alcLevel.innerHTML = tassoAlc + " g/L"; 

  hydra = document.getElementById("hydra");
  hydra.innerHTML = round(idratazione) + " %"; 

  energy = document.getElementById("energy");
  energy.innerHTML = valEn + " kWh"; 

  money = document.getElementById("money");
  money.innerHTML = valEc + " €"; 

  utente = document.getElementById("utente");
  utente.innerHTML = codiceUtente; 

  oggi = document.getElementById("oggi");
  oggi.innerHTML = valEn + " kWh"; 
}

// ********************* ATTIVAZIONE PRIMA SCHERMATA -> COLLEGAMENTO CON ARDUINO *********************

function connectionDone() {
  // serial constructor
  serial = new p5.SerialPort();
  // get a list of all connected serial devices
  serial.list();
  // serial port to use - you'll need to change this
  serial.open("COM3");
  // callback for when the sketchs connects to the server
  serial.on("connected", serverConnected);
  // callback to print the list of serial devices
  serial.on("list", gotList);
  // what to do when we get serial data
  serial.on("data", gotSensors);
  // what to do when there's an error
  serial.on("error", gotError);
  // when to do when the serial port opens
  serial.on("open", gotOpen);
  // what to do when the port closes
  serial.on("close", gotClose);
  // plusSlides(1);
}

function serverConnected() {
  console.log("Connected to Server"); // fa scorrere la prima interfaccia
}

// list the ports
function gotList(thelist) {
  console.log("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    console.log(i + " " + thelist[i]);
    plusSlides(1);

    //   if (i + " " + thelist[i] == "0 COM3") {
    //     plusSlides(1);
    // }
  }
}

function gotOpen() {
  console.log("Serial Port is Open");
  // serial.clear(); // clears the buffer of any outstanding data
  // serial.write("H"); // send a byte to the Arduino
}

function gotClose() {
  console.log("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  console.log(theerror);
}

// when data is received in the serial buffer
function gotData() {
  let currentString = serial.readLine(); // store the data in a variable
  trim(currentString); // get rid of whitespace
  if (!currentString) return; // if there's nothing in there, ignore it
  console.log(currentString); // print it out
  latestData = currentString; // save it to the global variable
  // slideIndex.push(latestData);
  // l++;
}

function gotSensors() {
  let currentString = serial.readStringUntil("\r\n"); // store the data in a variable
  trim(currentString); // get rid of whitespace
  if (currentString.length > 0) {
    sensors = split(currentString, ",");
    // console.log(sensors);
  }
}

function sliderScreen() {
  if (millis() - timer > clock) {
    let schermata = document.getElementsById("schermataSlider");
    schermata.onclick = plusSlides(1);
    console.log("huhu");
  }
}

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex[l] += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex[l] = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("ellipse");
  if (n > slides.length) {
    page = window.open("./index.html", "_self");
  }
  if (n < 1) {
    slideIndex[l] = 1;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex[l] - 1].style.display = "block";
  // console.log([slideIndex[l]-1]);
  dots[slideIndex[l] - 1].className += " active";

  // SCHERMATA BILANCIA
  if (n == 3) {
    function tutorial() {
      document.getElementById("bilancia").play();
    }
    setTimeout(tutorial, 0);

    // // da sostituire
    // setTimeout(plusSlides(1), 6000);
  }

  // document.getElementById("sali").addEventListener("click", mostra());

  // SCHERMATA ETILOMETRO
  if (n == 4) {
    function tutorial() {
      document.getElementById("alcol").play();
      document.getElementById("barra").style.display = "flex";
    }
    setTimeout(tutorial, 0);
  }

  // SCHERMATA STAMPANTE
  if (n == 5) {
    function tutorial() {
      document.getElementById("stampante").play();
      document.getElementById("barra").style.display = "flex";
    }
    setTimeout(tutorial, 0);

    // schermata risultati
    function fine() {
      document.getElementById("stampa").style.display = "none";
      document.getElementById("barra").style.display = "none";
      document.getElementById("risultati").style.display = "block";    
    }
    setTimeout(fine, 10000);

    setTimeout(invioDati(), 2000); 
  }
}

function draw() {
  let cU = round(random(100000, 999999));
  codiceUtente = "\n\nutente 10" + cU;
}
