let circles = [];
let circleCount = 40;
let layersPerCircle = 8;
let particlesPerLayer = 40;
let circleRadius = 100;
let circleSpacing = 400;
let layoutAngle = 7;

let pearlSize = 15;
let vineThickness = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#02212f");

  initCircles();
}

function draw() {
  background("#055376");
  for (let circle of circles) {
    circle.update();
    circle.show();
  }
}

function initCircles() {
  // Calculate the offset based on the tilt angle
  let angleRad = radians(layoutAngle);
  let xStep = circleSpacing * cos(angleRad);
  let yStep = circleSpacing * sin(angleRad);

  // Calculate the required number of rows and columns to fill the canvas
  let cols = Math.ceil(width / xStep) + 2;
  let rows = Math.ceil(height / yStep) + 4;

  // Start from the top-left corner of the canvas with a slight offset for even distribution
  let startX = -circleRadius;
  let startY = -circleRadius;

  for (let row = 0; row < rows; row++) {
    // Offset even rows by half the spacing
    let offsetX = (row % 2) * (xStep / 2);

    for (let col = 0; col < cols; col++) {
      let x = startX + col * xStep + offsetX;
      let y = startY + row * (yStep * 2.3); // Reduce vertical spacing for tighter circle arrangement

      // Only add circles near the visible area
      if (x >= -circleRadius && x <= width + circleRadius &&
          y >= -circleRadius && y <= height + circleRadius) {
        circles.push(new Circle(x, y, circleRadius, layersPerCircle, particlesPerLayer));
      }
    }
  }
}

class Circle {
  constructor(x, y, radius, numLayers, particlesPerLayer) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.particles = [];
    this.concentricCircles = [];
    this.rays = [];

    // Randomly choose between white and colored background
    this.backgroundColor = random(0, 10) >= 3 ? color(255, 255, 255) : color(random(100, 255), random(100, 255), random(100, 255));

    // Determine if this circle should show particles
    this.showParticle = random(0, 10) >= 2;

    this.initConcentricCircles();
    this.initParticles(numLayers, particlesPerLayer);
    this.initRays();

    this.hexagonPoints = this.calculateHexagonPoints();

    this.rotation = 0;           // Current rotation angle
    this.isRotating = false;     // Flag for rotation state
    this.rotationSpeed = random(0.01, 0.03);   // Rotation speed

    this.originalRadius = radius; // Store original radius
    this.targetRadius = radius;   // Target radius for animation
    this.isAnimating = false;    // Flag for animation state
    this.animationDirection = 1; // 1 for shrinking, -1 for expanding
    this.animationSpeed = 0.06;  // Scale animation speed
  }

  // Calculate octagon vertex points
  calculateHexagonPoints() {
    let points = [];
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI / 8 * i - PI / 8; // Start from top-right, counter-clockwise
      let px = this.x + cos(angle) * (this.radius) * 1.2;
      let py = this.y + sin(angle) * (this.radius) * 1.2;
      points.push({x: px, y: py});
    }
    return points;
  }

  // Draw decorative vine-like edges
  drawVineEdge(start, end) {
    let distance = dist(start.x, start.y, end.x, end.y);
    let steps = floor(distance / 10);

    push();
    strokeWeight(vineThickness);
    stroke(random(100, 255), random(100, 200), random(100, 200));
    noFill();

    beginShape();
    for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      let x = lerp(start.x, end.x, t);
      let y = lerp(start.y, end.y, t);

      // Add wave effect between connecting lines
      let perpX = -(end.y - start.y) / distance;
      let perpY = (end.x - start.x) / distance;
      let amp = 4 * sin(t * PI); // Amplitude
      let freq = 4; // Frequency

      x += perpX * amp * sin(t * TWO_PI * freq);
      y += perpY * amp * sin(t * TWO_PI * freq);

      curveVertex(x, y);
    }
    endShape();
    pop();
  }

  // Draw octagonal frame with pearl decorations
  drawOctagonalFrame() {
    for (let i = 0; i < 8; i++) {
      let start = this.hexagonPoints[i];
      let end = this.hexagonPoints[(i + 1) % 8];
      this.drawVineEdge(start, end);
    }

    // Draw pearl decorations at vertices
    for (let point of this.hexagonPoints) {
      // White pearl base
      fill(255);
      noStroke();
      ellipse(point.x, point.y, pearlSize);

      // Pearl highlight effect
      fill(255, 255, 255, 200);
      noStroke();
      ellipse(point.x - pearlSize/4, point.y - pearlSize/4, pearlSize/3);
    }
  }

  // Initialize concentric circles with different colors
  initConcentricCircles() {
    let numCircles = Math.ceil(random(1,8));
    let colors = [
      color(255, 100, 100),
      color(100, 255, 100),
      color(100, 100, 255),
      color(255, 255, 100),
      color(255, 100, 255),
      color(100, 255, 255),
      color(255, 150, 50),
      color(150, 50, 255)
    ];

    // Create concentric circles from outer to inner
    for (let i = 0; i < numCircles; i++) {
      let radius = map(i, 0, numCircles - 1, this.radius * 0.8, this.radius * 0.1);
      let col = colors[i % colors.length];
      this.concentricCircles.push({
        radius: radius * 1.3,
        color: col,
        strokeWeight: map(i, 0, numCircles - 1, 4, 1)
      });
    }
  }

  // Initialize particles in multiple layers
  initParticles(numLayers, particlesPerLayer) {
      let layerColor = color(random(100, 255), random(100, 255), random(100, 255));
      for (let layer = 0; layer < numLayers; layer++) {
      let layerRadius = (this.radius / numLayers) * (layer + 1);

      for (let i = 0; i < particlesPerLayer; i++) {
        let angle = (TWO_PI / particlesPerLayer) * i + random(-0.05, 0.05);
        let dist = layerRadius + random(-2, 0);
        let size = map(layer, 0, numLayers - 1, 4, 12) * random(0.8, 1.2);

        let px = this.x + cos(angle) * dist;
        let py = this.y + sin(angle) * dist;

        this.particles.push(new Particle(px, py, layerColor, size));
      }
    }
  }

  // Initialize decorative rays
  initRays() {
    let numRays = 60;
    let rayLength = this.radius;
    for (let i = 0; i < numRays; i++) {
      let angle = (TWO_PI / numRays) * i;
      let innerRadius = this.radius * 0.4;
      let outerRadius = innerRadius + rayLength * 0.6;
      this.rays.push({
        angle: angle,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        color: color(random(200, 255), random(100, 200), 50)
      });
    }
  }

  // Render the circle and all its components
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    translate(-this.x, -this.y);

    this.drawBackground();

    if (!this.showParticle) {
      // Draw rays
      for (let ray of this.rays) {
        stroke(ray.color);
        strokeWeight(2);
        let x1 = this.x + cos(ray.angle) * ray.innerRadius;
        let y1 = this.y + sin(ray.angle) * ray.innerRadius;
        let x2 = this.x + cos(ray.angle) * ray.outerRadius;
        let y2 = this.y + sin(ray.angle) * ray.outerRadius;
        line(x1, y1, x2, y2);
      }
    } else {
      // Draw particles
      for (let p of this.particles) {
        p.show();
      }
    }

    // Draw concentric circles
    for (let circle of this.concentricCircles) {
      fill(circle.color);
      strokeWeight(circle.strokeWeight);
      stroke(255, 100);
      ellipse(this.x, this.y, circle.radius);
    }

    // Draw octagonal frame last
    this.drawOctagonalFrame();

    pop();
  }

  // Draw circle background
  drawBackground() {
    fill(this.backgroundColor);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2.1);
  }

  // Update circle state
  update() {
    // Handle rotation
    if (this.isRotating) {
      this.rotation += this.rotationSpeed;
    }

    // Handle scale animation
    if (this.isAnimating) {
      if (this.animationDirection === 1) { // Shrinking
        this.radius = lerp(this.radius, this.targetRadius, this.animationSpeed);
        if (abs(this.radius - this.targetRadius) < 1) {
          this.animationDirection = -1;
          this.targetRadius = this.originalRadius;
        }
      } else { // Expanding
        this.radius = lerp(this.radius, this.targetRadius, this.animationSpeed);
        if (abs(this.radius - this.originalRadius) < 1) {
          this.isAnimating = false;
          this.radius = this.originalRadius;
        }
      }

      // Update octagon vertices
      this.hexagonPoints = this.calculateHexagonPoints();
    }
  }

  // Check if point is inside circle
  containsPoint(px, py) {
    return dist(px, py, this.x, this.y) < this.radius;
  }

  // Handle mouse hover interaction
  handleHover(px, py) {
    this.isRotating = this.containsPoint(px, py);
  }

  // Handle click interaction
  handleClick() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animationDirection = 1;
      this.targetRadius = this.originalRadius * 0.5; // Shrink to half size
    }
  }
}

class Particle {
  constructor(x, y, col, size) {
    this.x = x + random(-0.5, 0.5);
    this.y = y + random(-0.5, 0.5);
    this.col = col;
    this.size = size;
  }

  show() {
    fill(this.col);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// Handle mouse movement for hover effects
function mouseMoved() {
  for (let circle of circles) {
    circle.handleHover(mouseX, mouseY);
  }
}

// Handle mouse clicks for animation triggers
function mouseClicked() {
  for (let circle of circles) {
    if (circle.containsPoint(mouseX, mouseY)) {
      circle.handleClick();
      break; // Only handle one circle click
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  circles = [];
  initCircles();
}