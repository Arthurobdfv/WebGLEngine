
var fragShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
uniform vec4 u_color;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = u_color;
}

`

var vertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
uniform mat4 u_transform;
uniform vec2 u_resolution;
in vec2 a_position;
 
// all shaders have a main function
void main() {
  vec2 position = (mat3(u_transform) * vec3(a_position, 1)).xy;

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`
import * as aux from './glContext.mjs';



/** @type {HTMLCanvasElement} */
var canvas = document.getElementById('canvas');
console.log(canvas);

var context = canvas.getContext('webgl2');
console.log(context);

var vertexShader = aux.compileShader(context, context.VERTEX_SHADER, vertexShaderSource);
var fragShader = aux.compileShader(context, context.FRAGMENT_SHADER, fragShaderSource);
var program = aux.createProgram(context, vertexShader, fragShader);

var positionAttributeLocation = context.getAttribLocation(program, "a_position");
var uniform_ResolutionLocation = context.getUniformLocation(program, "u_resolution");
var uniform_ColorLocation = context.getUniformLocation(program, "u_color");
var uniform_TransformLocation = context.getUniformLocation(program, "u_transform");

console.log(`Attrib location for a_position is ${positionAttributeLocation}`);
var positionBuffer = context.createBuffer();
context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

var positions = [
  150   ,150,
  150   ,175,
  225 ,150,

  150   ,175,
  225 ,175,
  225 ,150
]


var rectSize = [ 150, 75 ];
var rectVerts = aux.getRectangle(100, 100, rectSize[0], rectSize[1]);


context.bufferData(context.ARRAY_BUFFER, new Float32Array(rectVerts), context.STATIC_DRAW);
var vao = context.createVertexArray();
context.bindVertexArray(vao);
context.enableVertexAttribArray(positionAttributeLocation);

var size = 2;
var type = context.FLOAT;
var normalize = false;
var stride = 0;
var offset = 0;
context.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
context.viewport(0,0, context.canvas.width, context.canvas.height);


context.clearColor(0,0,0,0);
context.clear(context.COLOR_BUFFER_BIT);

context.useProgram(program);
context.bindVertexArray(vao);
var primitiveType = context.TRIANGLES;
var count = 6;
context.drawArrays(primitiveType, offset, count);
var randOffset = Math.random(0,1) * 1000;
var time = 0;
var deg2rad = 0.017453;



context.uniform2f(uniform_ResolutionLocation, context.canvas.width, context.canvas.height);
// for (var ii = 0; ii < 50; ++ii) {
  context.uniform4f(uniform_ColorLocation, Math.sin(time++), Math.sin(time++ + randOffset), 0.5, 1);
  //   // Put a rectangle in the position buffer
  //   aux.setRectangle(
    //       context, aux.randomInt(300), aux.randomInt(300), aux.randomInt(300), aux.randomInt(300));
    
    //   // Set a random color.
    //   context.uniform4f(uniform_ColorLocation, Math.random(), Math.random(), Math.random(), 1);
    
    //   // Draw the rectangle.
    //   var primitiveType = context.TRIANGLES;
    //   var offset = 0;
    //   var count = 6;
    //   context.drawArrays(primitiveType, offset, count);
    // }
  context.drawArrays(primitiveType, offset, count);
  
var t = [0, 0, 0];
var angle = 0;
var r = [0, 0, 0];
var s = [1, 1, 1];

var transformMat = new Float32Array([
  Math.cos(angle*deg2rad)*s[0],-Math.sin(angle*deg2rad),0,0,
  Math.sin(angle*deg2rad), Math.cos(angle*deg2rad)*s[1],0,0,
  0,0,1*s[2],0,
  t[0],t[1],t[2],1]);

var identity = new Float32Array([
  1,0,0,0,
  0,1,0,0,
  0,0,1,0,
  0,0,0,1
])
function mainDraw(){
  context.clearColor(0,0,0,0);
  context.clear(context.COLOR_BUFFER_BIT);
  console.log(`Test ${time}`);
  context.useProgram(program);
  context.bindVertexArray(vao);
  context.drawArrays(primitiveType, offset, count);
  context.uniform4f(uniform_ColorLocation, Math.sin(time++ * deg2rad), Math.sin(time++ *deg2rad + randOffset), 0.5, 1);
  t[0] = (Math.sin(time++ * deg2rad) + 1 / 2) * 50;
  t[1] = (Math.cos(time++ * deg2rad) + 1 / 2) * 50;
  r[0] = Math.sin(time++ * deg2rad);
  r[1] = Math.cos(time++ * deg2rad);
  context.uniformMatrix4fv(uniform_TransformLocation, false, transformMat);
  requestAnimationFrame(mainDraw)
}
mainDraw();
