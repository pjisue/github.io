let inputBoxes = [];
let responseBoxes = [];
let activeInput = null;

const buttonSize = 24;
const buttonMargin = 16;

let jisueMessages = [
  "This is my playground.",
  "Thank you for visiting!",
  "Have a creative day!",
  "Enjoy coding magic!",
  "Feel free to explore!"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Inter Tight');
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  // Update and draw all old response boxes (floating effect)
  for (let r of responseBoxes) {
    r.update();
    r.display();
  }

  // Update and draw all input boxes
  for (let b of inputBoxes) {
    b.update();
    b.display();
  }

  drawButtons();
}

function mousePressed() {
  activeInput = null;

  // Check button clicks first
  if (overMinusButton(mouseX, mouseY)) {
    deleteSelectedBox();
    return;
  }
  if (overClearButton(mouseX, mouseY)) {
    inputBoxes = [];
    responseBoxes = [];
    return;
  }

  // If any input box clicked, select it
  for (let i = inputBoxes.length - 1; i >= 0; i--) {
    if (inputBoxes[i].contains(mouseX, mouseY)) {
      activeInput = inputBoxes[i];
      return;
    }
  }

  // If clicked background: 
  // - Shrink last response box if exists
  // - Create new typing box
  if (responseBoxes.length > 0) {
    responseBoxes[responseBoxes.length - 1].startShrink();
  }
  createNewInputBox(mouseX, mouseY);
}

function keyPressed() {
  if (keyCode === ENTER && activeInput) {
    activeInput.startShrink();
    createResponseBox(activeInput.x + activeInput.w / 2 + 50, activeInput.y);
    activeInput.locked = true;
    activeInput = null;
    return false;
  }

  if (keyCode === BACKSPACE && activeInput) {
    activeInput.deleteLastChar();
    return false;
  }
}

function keyTyped() {
  if (activeInput && activeInput.text.length < 100) {
    activeInput.addChar(key);
  }
}

function createNewInputBox(x, y) {
  if (inputBoxes.length > 0) {
    // Deselect previous inputs
    for (let b of inputBoxes) b.selected = false;
  }
  let newBox = new InputBox(x, y);
  inputBoxes.push(newBox);
  activeInput = newBox;
}

function createResponseBox(x, y) {
  let msg = random(jisueMessages);
  let newResponse = new ResponseBox(x, y, msg);
  responseBoxes.push(newResponse);
}

function drawButtons() {
  noFill();
  stroke(0);
  strokeWeight(1);

  // '-' button
  line(
    width - buttonMargin - buttonSize * 2 - 8 + 6,
    buttonMargin + buttonSize / 2,
    width - buttonMargin - buttonSize * 2 - 8 + buttonSize - 6,
    buttonMargin + buttonSize / 2
  );

  // 'X' button
  line(width - buttonMargin - buttonSize + 6, buttonMargin + 6, width - buttonMargin - 6, buttonMargin + buttonSize - 6);
  line(width - buttonMargin - 6, buttonMargin + 6, width - buttonMargin - buttonSize + 6, buttonMargin + buttonSize - 6);
}

function deleteSelectedBox() {
  if (activeInput) {
    let idx = inputBoxes.indexOf(activeInput);
    if (idx > -1) inputBoxes.splice(idx, 1);
    activeInput = null;
  }
}

function overMinusButton(x, y) {
  return x > width - buttonMargin - buttonSize * 2 - 8 && x < width - buttonMargin - buttonSize - 8 &&
         y > buttonMargin && y < buttonMargin + buttonSize;
}

function overClearButton(x, y) {
  return x > width - buttonMargin - buttonSize && x < width - buttonMargin &&
         y > buttonMargin && y < buttonMargin + buttonSize;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- Classes ---
class InputBox {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 600;
    this.h = 300;
    this.text = "";
    this.selected = true;
    this.locked = false;
    this.shrinking = false;
    this.targetW = 300;
    this.targetH = 150;
    this.textSizeLarge = 18;
    this.textSizeSmall = 12;
    this.currentTextSize = this.textSizeLarge;
    this.fillColor = color(255);
    this.borderColor = color(0);
  }

  update() {
    if (this.shrinking) {
      this.w = lerp(this.w, this.targetW, 0.2);
      this.h = lerp(this.h, this.targetH, 0.2);
      this.currentTextSize = lerp(this.currentTextSize, this.textSizeSmall, 0.2);
      this.fillColor = lerpColor(color(255), color(200), 0.5); // White to light gray
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rectMode(CENTER);
    fill(this.fillColor);
    stroke(this.borderColor);
    strokeWeight(1);
    rect(0, 0, this.w, this.h);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.currentTextSize);
    text(this.text, 0, 0, this.w - 20, this.h - 20);
    pop();
  }

  contains(px, py) {
    return (px > this.x - this.w / 2 && px < this.x + this.w / 2 &&
            py > this.y - this.h / 2 && py < this.y + this.h / 2);
  }

  addChar(k) {
    if (!this.locked) {
      this.text += k;
    }
  }

  deleteLastChar() {
    if (!this.locked && this.text.length > 0) {
      this.text = this.text.slice(0, -1);
    }
  }

  startShrink() {
    this.shrinking = true;
  }
}

class ResponseBox {
  constructor(x, y, message) {
    this.x = x;
    this.y = y;
    this.w = 300;
    this.h = 150;
    this.message = "Jisue says: " + message;
    this.opacity = 25;
    this.shrinking = false;
    this.targetOpacity = 128;
    this.floatDirection = random([-1, 1]);
  }

  update() {
    if (this.shrinking) {
      this.opacity = lerp(this.opacity, this.targetOpacity, 0.1);
    }
    // slight random floating
    this.x += random(-0.2, 0.2) * this.floatDirection;
    this.y += random(-0.2, 0.2);
  }

  display() {
    push();
    translate(this.x, this.y);
    rectMode(CENTER);
    fill(0, 0, 255, this.opacity); // Blue fill with opacity
    stroke(0, 0, 255);
    strokeWeight(1);
    rect(0, 0, this.w, this.h);

    fill(0, 0, 255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.message, 0, 0, this.w - 20, this.h - 20);
    pop();
  }

  startShrink() {
    this.shrinking = true;
  }
}