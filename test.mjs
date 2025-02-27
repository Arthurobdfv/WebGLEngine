
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
uniform mat4 u_projMatrix;
uniform mat4 u_transform;
uniform mat4 u_camMvp;
 
// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projMatrix * u_camMvp * u_transform * a_position;
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
context.enable(context.DEPTH_TEST);

var vertexShader = aux.compileShader(context, context.VERTEX_SHADER, vertexShaderSource);
var fragShader = aux.compileShader(context, context.FRAGMENT_SHADER, fragShaderSource);
var program = aux.createProgram(context, vertexShader, fragShader);

var positionAttributeLocation = context.getAttribLocation(program, "a_position");
var uniform_CameraMVPLocation = context.getUniformLocation(program, "u_camMvp");
var uniform_ProjMatLocation = context.getUniformLocation(program, "u_projMatrix");
var uniform_ColorLocation = context.getUniformLocation(program, "u_color");
var uniform_TransformLocation = context.getUniformLocation(program, "u_transform");

console.log(`Attrib location for a_position is ${positionAttributeLocation}`);



var rectSize = [ 100, 100 ];
var rectVerts = aux.getRectangle(0, 0, rectSize[0], rectSize[1], 100);

var rectVerts2 = aux.getRectangle(-200,-200, 200, 150,150);
var vao = context.createVertexArray();
var vao2 = context.createVertexArray();


var objectsToDraw = [];
setupCube(vao, rectVerts, context);
setupCube(vao2, rectVerts2, context);
var positionBuffer = context.createBuffer();

function setupCube(attrib, data, context){
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), context.STATIC_DRAW);
  context.bindVertexArray(attrib);
  context.enableVertexAttribArray(positionAttributeLocation);
  var size = 3;
  var type = context.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  var primitiveType = context.TRIANGLES;
  var count = data.length;
  context.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  
  objectsToDraw.push({attrib, offset,count, primitiveType})
}
context.viewport(0,0, context.canvas.width, context.canvas.height);


context.clearColor(0,0,0,0);
context.clear(context.COLOR_BUFFER_BIT);

var randOffset = Math.random(0,1) * 1000;
var time = 0;
var deg2rad = 0.017453;


  context.uniform4f(uniform_ColorLocation, Math.sin(time++), Math.sin(time++ + randOffset), 0.5, 1);


var fieldOfView = 60;
var near = 1;
var far = 2000;
var rangeInv = 1/(near-far);
var projectionMatrix=  new mat(4);
var f = Math.tan(Math.PI * 0.5 - deg2rad * fieldOfView * 0.5)
projectionMatrix.position(0,0,near*far* rangeInv *2);
projectionMatrix.fudge = -1;
var aspect = context.canvas.width / context.canvas.height;
projectionMatrix.scale(f/aspect, f, (near+far) * rangeInv);




function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;
 
  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
    console.log(`Display Width: ${displayWidth}, Display Height: ${displayHeight}`);
  }
  var aspect = context.canvas.width / context.canvas.height;

  projectionMatrix.scale(f/aspect, f, (near+far) * rangeInv);
  return needResize;
}


var t = [0, 0, 0];
var angle = 0;
var r = [0, 0, 0];
var s = [1, 1, 1];
var mvp = new mat(4);
var cameraMvp = new mat(4);
cameraMvp.scale(0, 0,0);
cameraMvp.position(0, 10);
cameraMvp.rotation(0);
cameraMvp.scale(1,1, 1);
mvp.scale(1, 1);
mvp.position(0, 0, 0);
mvp.rotation(0);
var test = cameraMvp.toMvp();
var test2 = 1;
function mainDraw(){
  resizeCanvasToDisplaySize(canvas); 
  context.viewport(0,0, canvas.width, canvas.height);
  context.uniformMatrix4fv(uniform_ProjMatLocation, false, projectionMatrix.toMvp());
  context.uniformMatrix4fv(uniform_CameraMVPLocation, false, cameraMvp.inverse());
  context.clearColor(0,0,0,0);
  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
  context.useProgram(program);
  objectsToDraw.forEach(element => {
    context.bindVertexArray(element.attrib);
    context.drawArrays(element.primitiveType, element.offset, element.count);
  });
  //context.uniform4f(uniform_ColorLocation, Math.sin(time++ * deg2rad), Math.sin(time++ *deg2rad + randOffset), 0.5, 1);
  context.uniform4f(uniform_ColorLocation,.7, .7, 0.3, 1);
  //t[0] = (Math.sin(time++ * deg2rad) + 1 / 2) * 50;
  //t[1] = (Math.cos(time++ * deg2rad) + 1 / 2) * 50;
  //t[0] = context.canvas.width/2;
  //t[1] = context.canvas.height/2;
  r[0] = Math.sin(time++ * deg2rad);
  r[1] = Math.cos(time++ * deg2rad);
  t[2] = -600;
  t[1] = -100;
  mvp.position(t[0], t[1], t[2]);
  mvp.rotation(0,time++/3,0);
  var test = mvp.toMvp();
  context.uniformMatrix4fv(uniform_TransformLocation, false, mvp.toMvp());
  requestAnimationFrame(mainDraw)
}
mainDraw();
