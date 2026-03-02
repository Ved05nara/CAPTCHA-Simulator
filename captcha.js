// Store user data
let userName = "";
let currentStep = 1;

// CAPTCHA storage
let textCaptchaCode = "";
let audioCaptchaCode = "";
let mathAnswer = "";
let imageTarget = "";
let imageCorrectPositions = [];
let selectedPositions = [];

// Start the verification process
function startCaptcha() {
  userName = document.getElementById("userName").value.trim();
  if (userName === "") {
    alert("Please enter your name!");
    return;
  }

  // Update progress
  document.getElementById("step1").classList.add("completed");
  document.getElementById("step2").classList.add("active");

  // Hide step 1, show step 2
  document.getElementById("step1-content").style.display = "none";
  document.getElementById("step2-content").style.display = "block";

  // Generate text CAPTCHA
  generateTextCaptcha();
}

// ============ TEXT CAPTCHA ============
// ============ TEXT CAPTCHA ============
function generateTextCaptcha() {
    // Your new chars with lowercase
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    textCaptchaCode = '';
    for (let i = 0; i < 6; i++) {
        textCaptchaCode += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Display with "distortion" effects
    let display = '';
    for (let char of textCaptchaCode) {
        let rotation = Math.random() * 10 - 5;
        display += `<span style="display: inline-block; transform: rotate(${rotation}deg); margin: 0 2px;">${char}</span>`;
    }
    
    document.getElementById('textCaptcha').innerHTML = display + 
        '<div style="position: relative; top: -20px; left: 0; width: 100%; height: 2px; background: rgba(0,0,0,0.1); transform: rotate(1deg);"></div>' +
        '<div style="position: relative; top: -30px; left: 0; width: 100%; height: 1px; background: rgba(0,0,0,0.1); transform: rotate(-2deg);"></div>';
}

function verifyText() {
    const userInput = document.getElementById('textInput').value.trim(); // NO MORE .toUpperCase()
    if (userInput === textCaptchaCode) {
        // Update progress
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step2').classList.add('completed');
        document.getElementById('step3').classList.add('active');
        
        // Move to audio CAPTCHA
        document.getElementById('step2-content').style.display = 'none';
        document.getElementById('step3-content').style.display = 'block';
        
        // Generate audio CAPTCHA
        generateAudioCaptcha();
    } else {
        alert('Incorrect text CAPTCHA! Try again.');
        generateTextCaptcha(); // Generate new one
        document.getElementById('textInput').value = '';
    }
}

// ============ AUDIO CAPTCHA ============
function generateAudioCaptcha() {
  const words = [
    "APPLE",
    "HOUSE",
    "TIGER",
    "1234",
    "WORLD",
    "MUSIC",
    "HELLO",
    "JAVA",
    "PYTHON",
    "BIRD",
    "TREE",
    "RIVER",
    "MOUNTAIN",
    "OCEAN",
    "SUN",
    "MOON",
  ];
  audioCaptchaCode = words[Math.floor(Math.random() * words.length)];

  sessionStorage.setItem("audioCode", audioCaptchaCode);
}

function playAudio() {
  // Simulate audio with beeps and speech synthesis
  const code = audioCaptchaCode;
  const utterance = new SpeechSynthesisUtterance(code);
  utterance.rate = 0.8; // Slightly slower
  utterance.pitch = 1.2; // Slightly higher pitch

  // Actually speak it
  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(utterance);
}

function verifyAudio() {
  const userInput = document
    .getElementById("audioInput")
    .value.trim()
    .toUpperCase();
  if (userInput === audioCaptchaCode) {
    // Update progress
    document.getElementById("step3").classList.remove("active");
    document.getElementById("step3").classList.add("completed");
    document.getElementById("step4").classList.add("active");

    // Move to math CAPTCHA
    document.getElementById("step3-content").style.display = "none";
    document.getElementById("step4-content").style.display = "block";

    // Generate math CAPTCHA
    generateMathCaptcha();
  } else {
    alert("Incorrect audio CAPTCHA! Try again.");
    generateAudioCaptcha(); // Generate new one
    document.getElementById("audioInput").value = "";
  }
}

// ============ MATH CAPTCHA ============
function generateMathCaptcha() {
  const operations = [
    { symbol: "+", func: (a, b) => a + b },
    { symbol: "-", func: (a, b) => a - b },
    { symbol: "×", func: (a, b) => a * b },
    { symbol: "÷", func: (a, b) => Math.floor(a / b) },
  ];

  const op = operations[Math.floor(Math.random() * operations.length)];

  let a, b;
  if (op.symbol === "×") {
    a = Math.floor(Math.random() * 10) + 2;
    b = Math.floor(Math.random() * 10) + 2;
  } else {
    a = Math.floor(Math.random() * 30) + 10;
    b = Math.floor(Math.random() * 20) + 1;
    if (op.symbol === "-" && a < b) {
      [a, b] = [b, a]; // Swap to ensure positive
    }
  }

  mathAnswer = op.func(a, b).toString();
  document.getElementById("mathQuestion").innerHTML =
    `${a} ${op.symbol} ${b} = ?`;
}

function verifyMath() {
  const userInput = document.getElementById("mathInput").value.trim();
  if (userInput === mathAnswer) {
    // Update progress
    document.getElementById("step4").classList.remove("active");
    document.getElementById("step4").classList.add("completed");
    document.getElementById("step5").classList.add("active");

    // Move to image CAPTCHA
    document.getElementById("step4-content").style.display = "none";
    document.getElementById("step5-content").style.display = "block";

    // Generate image CAPTCHA
    generateImageCaptcha();
  } else {
    alert("Incorrect math answer! Try again.");
    generateMathCaptcha(); // Generate new one
    document.getElementById("mathInput").value = "";
  }
}

// ============ IMAGE GRID CAPTCHA ============
function generateImageCaptcha() {
  const objects = ["🐱 Cat", "🐶 Dog", "🐟 Fish", "🐦 Bird", "🌳 Tree"];
  const symbols = {
    "🐱 Cat": "🐱",
    "🐶 Dog": "🐶",
    "🐟 Fish": "🐟",
    "🐦 Bird": "🐦",
    "🌳 Tree": "🌳",
  };

  // Select target
  imageTarget = objects[Math.floor(Math.random() * objects.length)];
  document.getElementById("targetObject").textContent = imageTarget;

  // Generate 3x3 grid
  const grid = document.getElementById("imageGrid");
  grid.innerHTML = "";
  selectedPositions = [];
  imageCorrectPositions = [];

  const numTargets = Math.floor(Math.random() * 2) + 2;
  const positions = new Set();
  while (positions.size < numTargets) {
    positions.add(Math.floor(Math.random() * 9));
  }
  imageCorrectPositions = Array.from(positions);

  for (let i = 0; i < 9; i++) {
    const item = document.createElement("div");
    item.className = "grid-item";

    if (imageCorrectPositions.includes(i)) {
      item.textContent = symbols[imageTarget];
      item.dataset.object = imageTarget;
    } else {
      let otherObject;
      do {
        otherObject = objects[Math.floor(Math.random() * objects.length)];
      } while (otherObject === imageTarget);
      item.textContent = symbols[otherObject];
      item.dataset.object = otherObject;
    }

    item.dataset.index = i;
    item.onclick = function () {
      this.classList.toggle("selected");
      const index = parseInt(this.dataset.index);
      if (selectedPositions.includes(index)) {
        selectedPositions = selectedPositions.filter((pos) => pos !== index);
      } else {
        selectedPositions.push(index);
      }
    };

    grid.appendChild(item);
  }
}

function verifyImage() {
  const sortedSelected = selectedPositions.sort((a, b) => a - b);
  const sortedCorrect = imageCorrectPositions.sort((a, b) => a - b);

  const correct =
    JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);

  if (correct) {
    document.getElementById("step5").classList.remove("active");
    document.getElementById("step5").classList.add("completed");

    // Show final message
    document.getElementById("step5-content").style.display = "none";
    document.getElementById("final-message").style.display = "block";
    document.getElementById("welcomeMessage").innerHTML =
      `Verified! Welcome ${userName}!`;
  } else {
    alert("Incorrect image selection! Try again.");
    selectedPositions = [];
    // Clear selections
    document.querySelectorAll(".grid-item").forEach((item) => {
      item.classList.remove("selected");
    });
  }
}
