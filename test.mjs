
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
in vec4 a_position;
 
// A matrix to transform the positions by
uniform mat4 u_transform;
uniform mat4 u_camMvp;
 
// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_camMvp * u_transform * a_position;
}
`
import * as aux from './glContext.mjs';
import './matrix.mjs';
import { mat } from './matrix.mjs';



/** @type {HTMLCanvasElement} */
var canvas = document.getElementById('canvas');
console.log(canvas);

var context = canvas.getContext('webgl2');
console.log(context);

var vertexShader = aux.compileShader(context, context.VERTEX_SHADER, vertexShaderSource);
var fragShader = aux.compileShader(context, context.FRAGMENT_SHADER, fragShaderSource);
var program = aux.createProgram(context, vertexShader, fragShader);

var positionAttributeLocation = context.getAttribLocation(program, "a_position");
var uniform_CameraMVPLocation = context.getUniformLocation(program, "u_camMvp");
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
var rectVerts = aux.getRectangle(100, 100, rectSize[0], rectSize[1], context.canvas.width, context.canvas.height);


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



//context.uniform2f(uniform_ResolutionLocation, context.canvas.width, context.canvas.height);
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

var mvp = new mat(4);
var cameraMvp = new mat(4);
cameraMvp.scale(1, 1,1);
cameraMvp.position(0, 0);
cameraMvp.rotation(0);
cameraMvp.scale(2/context.canvas.width,-2/context.canvas.height);
cameraMvp.rotation(0);
cameraMvp.position(-1,1);
mvp.scale(1, 1);
mvp.position(0, 0);
mvp.rotation(0);
var test = cameraMvp.toMvp();
var test2 = 1;
function mainDraw(){
  context.uniformMatrix4fv(uniform_CameraMVPLocation, false, cameraMvp.toMvp());
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
  mvp.position(t[0], t[1]);
  //mvp.rotation(time++);
  var test = mvp.toMvp();
  context.uniformMatrix4fv(uniform_TransformLocation, false, mvp.toMvp());
  requestAnimationFrame(mainDraw)
}
mainDraw();
