
// Definition for the Wave class to properly handle sine wave generation
class Wave {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  value: number;

  constructor(config: {
    phase?: number;
    offset?: number;
    frequency?: number;
    amplitude?: number;
  }) {
    this.phase = config.phase || 0;
    this.offset = config.offset || 0;
    this.frequency = config.frequency || 0.001;
    this.amplitude = config.amplitude || 1;
    this.value = 0;
  }

  update(): number {
    this.phase += this.frequency;
    this.value = this.offset + Math.sin(this.phase) * this.amplitude;
    return this.value;
  }

  getValue(): number {
    return this.value;
  }
}

// Definition for the Node class to properly handle node points
class Node {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
}

// Definition for the Line class to handle line drawing
class Line {
  spring: number;
  friction: number;
  nodes: Node[];

  constructor(config: { spring?: number } = {}) {
    this.spring = config.spring || 0.1 + 0.1 * Math.random() - 0.05;
    this.friction = settings.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    
    for (let i = 0; i < settings.size; i++) {
      const node = new Node();
      node.x = mousePos.x;
      node.y = mousePos.y;
      this.nodes.push(node);
    }
  }

  update() {
    let spring = this.spring;
    const firstNode = this.nodes[0];
    
    firstNode.vx += (mousePos.x - firstNode.x) * spring;
    firstNode.vy += (mousePos.y - firstNode.y) * spring;

    for (let i = 1; i < this.nodes.length; i++) {
      const currentNode = this.nodes[i];
      const previousNode = this.nodes[i - 1];
      
      currentNode.vx += (previousNode.x - currentNode.x) * spring;
      currentNode.vy += (previousNode.y - currentNode.y) * spring;
      currentNode.vx += previousNode.vx * settings.dampening;
      currentNode.vy += previousNode.vy * settings.dampening;
      
      currentNode.vx *= this.friction;
      currentNode.vy *= this.friction;
      currentNode.x += currentNode.vx;
      currentNode.y += currentNode.vy;
      
      spring *= settings.tension;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let x = this.nodes[0].x;
    let y = this.nodes[0].y;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    for (let i = 1; i < this.nodes.length - 2; i++) {
      const currentNode = this.nodes[i];
      const nextNode = this.nodes[i + 1];
      
      const xc = (currentNode.x + nextNode.x) * 0.5;
      const yc = (currentNode.y + nextNode.y) * 0.5;
      
      ctx.quadraticCurveTo(currentNode.x, currentNode.y, xc, yc);
    }
    
    const i = this.nodes.length - 2;
    const currentNode = this.nodes[i];
    const nextNode = this.nodes[i + 1];
    
    ctx.quadraticCurveTo(currentNode.x, currentNode.y, nextNode.x, nextNode.y);
    ctx.stroke();
    ctx.closePath();
  }
}

// Animation settings
const settings = {
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
  debug: false
};

// Global variables
let ctx: CanvasRenderingContext2D | null = null;
let canvas: HTMLCanvasElement | null = null;
let wave: Wave;
let lines: Line[] = [];
let isRunning = false;

// Mouse position tracking
const mousePos: { x: number; y: number } = { x: 0, y: 0 };

function handleMouseMove(e: MouseEvent | TouchEvent) {
  if ('touches' in e) {
    mousePos.x = e.touches[0].pageX;
    mousePos.y = e.touches[0].pageY;
  } else {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  }
  e.preventDefault();
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    mousePos.x = e.touches[0].pageX;
    mousePos.y = e.touches[0].pageY;
  }
}

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight;
  }
}

function initializeLines() {
  lines = [];
  for (let i = 0; i < settings.trails; i++) {
    lines.push(new Line({ spring: 0.45 + (i / settings.trails) * 0.025 }));
  }
}

function render() {
  if (!ctx || !isRunning) return;
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = `hsla(${Math.round(wave.update())},100%,50%,0.025)`;
  ctx.lineWidth = 10;
  
  for (let i = 0; i < settings.trails; i++) {
    const line = lines[i];
    line.update();
    line.draw(ctx);
  }
  
  window.requestAnimationFrame(render);
}

function setupEventListeners() {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('touchstart', handleMouseMove);
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('touchmove', handleMouseMove);
  document.addEventListener('touchstart', handleTouchStart);
  
  document.body.addEventListener('orientationchange', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);
  
  window.addEventListener('focus', () => {
    if (!isRunning) {
      isRunning = true;
      render();
    }
  });
  
  window.addEventListener('blur', () => {
    isRunning = false;
  });
}

export const renderCanvas = function() {
  canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  isRunning = true;
  
  wave = new Wave({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285
  });
  
  setupEventListeners();
  initializeLines();
  resizeCanvas();
  render();
};
