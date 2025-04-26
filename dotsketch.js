let dots = [];

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 100; i++) {
    dots.push(new Dot(random(width), random(height)));
  }
}

function draw() {
  background(0); // black background
  
  for (let i = 0; i < dots.length; i++) {
    dots[i].update();
    dots[i].display();
  }
}

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 1.5; // radius (so 3px diameter)
  }

  update() {
    let d = dist(mouseX, mouseY, this.x, this.y);

    // If mouse is near, move away
    if (d < 30) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      this.x += cos(angle) * 3;
      this.y += sin(angle) * 3;
    }

    // Keep dots inside the canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }
}