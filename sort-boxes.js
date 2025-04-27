let boxes = [];
let activeBox = null;
let maxBoxes = 50;

const buttonSize = 24; // Button box size
let buttonMargin = 16; // Margin from edges

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Inter Tight');
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  // Draw all boxes
  for (let box of boxes) {
    box.update();
    box.display();
  }

  drawButtons();
}

function drawButtons() {
  noFill();
  stroke(0);
  strokeWeight(1);

  // '-' Button (Delete selected)
  rect(width - buttonMargin - buttonSize * 2 - 8, buttonMargin, buttonSize, buttonSize);
  line(width - buttonMargin - buttonSize * 2 - 4, buttonMargin + buttonSize / 2,
       width - buttonMargin - buttonSize * 2 - 20, buttonMargin + buttonSize / 2);

  // 'X' Button (Clear all)
  rect(width - buttonMargin - buttonSize, buttonMargin, buttonSize, buttonSize);
  line(width - buttonMargin - buttonSize + 6, buttonMargin + 6, width - buttonMargin - 6, buttonMargin + buttonSize - 6);
  line(width - buttonMargin - 6, buttonMargin + 6, width - buttonMargin - buttonSize + 6, buttonMargin + buttonSize - 6);

  // 'Save' Button (bottom-right)
  rect(width - buttonMargin - buttonSize, height - buttonMargin - buttonSize, buttonSize, buttonSize);
  line(width - buttonMargin - buttonSize + 6, height - buttonMargin - 12, width - buttonMargin - 6, height - buttonMargin - 12);
}

function mousePressed() {
  activeBox = null;
  let clickedBox = false;

  // Check for button clicks first
  if (overMinusButton(mouseX, mouseY)) {
    deleteSelectedBox();
    return;
  }
  if (overClearButton(mouseX, mouseY)) {
    boxes = [];
    return;
  }
  if (overSaveButton(mouseX, mouseY)) {
    console.log("Save placeholder clicked!");
    return;
  }

  // Check for dragging
  for (let i = boxes.length - 1; i >= 0; i--) {
    if (boxes[i].overBorder(mouseX, mouseY)) {
      activeBox = boxes[i];
      activeBox.startDrag(mouseX, mouseY);
      clickedBox = true;
      return;
    }
  }

  // Check for box selection
  for (let box of boxes) {
    if (box.contains(mouseX, mouseY)) {
      box.selected = true;
      clickedBox = true;
    } else {
      box.selected = false;
    }
  }

  // If clicked on empty space, create new box
  if (!clickedBox && boxes.length < maxBoxes) {
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
  if (keyCode === BACKSPACE) {
    // If a box is selected, delete last character
    for (let box of boxes) {
      if (box.selected && box.text.length > 0) {
        box.text = box.text.slice(0, -1);
      }
    }
    return false;
  }

  if (key === '-') {
    deleteSelectedBox();
  }

  if (key.length === 1 && key !== '-') {
    for (let box of boxes) {
      if (box.selected && box.text.length < 15) {
        box.text += key;
      }
    }
  }
}

function deleteSelectedBox() {
  for (let i = boxes.length - 1; i >= 0; i--) {
    if (boxes[i].selected) {
      boxes.splice(i, 1);
      break;
    }
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

function overSaveButton(x, y) {
  return x > width - buttonMargin - buttonSize && x < width - buttonMargin &&
         y > height - buttonMargin - buttonSize && y < height - buttonMargin;
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
    strokeWeight(this.selected ? 2 : 1);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);

    fill(0);
    noStroke();
    textSize(12);
    text(this.text, 0, 0);
    pop();
  }

  contains(px, py) {
    return (px > this.x - this.w / 2 && px < this.x + this.w / 2 &&
            py > this.y - this.h / 2 && py < this.y + this.h / 2);
  }

  overBorder(px, py) {
    let buffer = 16;
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