let boxes = [];
let activeBox = null;
let maxBoxes = 50;
let inputText = "";

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Inter Tight');
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  for (let box of boxes) {
    box.update();
    box.display();
  }
}

function mousePressed() {
    // Check for border drag first
    activeBox = null;
    for (let i = boxes.length - 1; i >= 0; i--) {
      if (boxes[i].overBorder(mouseX, mouseY)) {
        activeBox = boxes[i];
        activeBox.startDrag(mouseX, mouseY);
        return;
      }
    }
  
    // If clicked inside a box, select it for typing
    for (let box of boxes) {
      if (box.contains(mouseX, mouseY)) {
        box.selected = true;
      } else {
        box.selected = false;
      }
    }
  
    // If clicked on empty space, create new box
    if (boxes.length < maxBoxes) {
      let b = new Box(mouseX, mouseY);
      boxes.push(b);
    }
  }

function mouseReleased() {
  if (activeBox) {
    activeBox.stopDrag();
    activeBox = null;
  }
}

function mouseDragged() {
  if (activeBox) {
    activeBox.drag(mouseX, mouseY);
  }
}

function keyPressed() {
  if (keyCode === DELETE || keyCode === BACKSPACE) {
    boxes = [];
    inputText = "";
  }
}

function keyTyped() {
  if (activeBox && activeBox.selected) {
    if (key.length === 1 && activeBox.text.length < 15) {
      activeBox.text += key;
    }
  }
}

function doubleClicked() {
  for (let box of boxes) {
    if (box.contains(mouseX, mouseY)) {
      box.selected = true;
    } else {
      box.selected = false;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 50;
    this.scale = 0.5;
    this.targetScale = 1;
    this.growSpeed = 0.1;
    this.text = "";
    this.selected = false;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  update() {
    // Bouncy growth animation
    if (this.scale < this.targetScale) {
      this.scale += this.growSpeed;
      if (this.scale > this.targetScale) {
        this.scale = this.targetScale;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.scale);
    noFill();
    stroke(0);
    strokeWeight(this.selected ? 2 : 1); // Thicker border if selected
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);

    fill(0);
    noStroke();
    textSize(16);
    text(this.text, 0, 0);
    pop();
  }

  contains(px, py) {
    return (px > this.x - this.w / 2 && px < this.x + this.w / 2 &&
            py > this.y - this.h / 2 && py < this.y + this.h / 2);
  }

  overBorder(px, py) {
    let buffer = 12;
    return (
      abs(px - (this.x - this.w / 2)) < buffer ||
      abs(px - (this.x + this.w / 2)) < buffer ||
      abs(py - (this.y - this.h / 2)) < buffer ||
      abs(py - (this.y + this.h / 2)) < buffer
    ) && this.contains(px, py);
  }

  startDrag(mx, my) {
    this.dragging = true;
    this.offsetX = this.x - mx;
    this.offsetY = this.y - my;
  }

  drag(mx, my) {
    if (this.dragging) {
      this.x = mx + this.offsetX;
      this.y = my + this.offsetY;
    }
  }

  stopDrag() {
    this.dragging = false;
  }
}