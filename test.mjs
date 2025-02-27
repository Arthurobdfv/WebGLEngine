
var fragShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
uniform vec4 u_color;
in vec3   v_normal;
in vec3   v_pos; 
in vec4   v_vertexColor;
in vec3   v_lightPos;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  float intensity = 0.3;
  vec3 inverseLightDir = normalize(v_lightPos-v_pos);
  float NdotL = dot(inverseLightDir, normalize(v_normal));
  //outColor = vec4(u_color.xyz * NdotL * intensity,1);
  //outColor = v_vertexColor * NdotL;
//outColor = vec4(vec3(NdotL * v_vertexColor.xyz),1);
outColor = vec4(vec3( v_normal),1);
//outColor = vec4(vec3(NdotL),1);
}

`

var vertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
precision highp float;
in vec4 a_position;
in vec3 a_normal;
in vec4 a_vertexColor;
 
// A matrix to transform the positions by
uniform mat4 u_projMatrix;
uniform mat4 u_transform;
uniform mat4 u_camMvp;
uniform vec3 u_lightPos;

out vec3 v_normal;
out vec3 v_pos; 
out vec4 v_vertexColor;
out vec3 v_lightPos;
// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  mat4 mvp = u_projMatrix * u_camMvp * u_transform;
  v_normal = mat3(u_transform) * a_normal;
  gl_Position = mvp * a_position;
  v_pos = gl_Position.xyz;
  v_vertexColor = a_vertexColor;
  v_lightPos = u_lightPos;
}
`
import * as aux from './glContext.mjs';
import './matrix.mjs';
import { mat } from './matrix.mjs';



/** @type {HTMLCanvasElement} */
var canvas = document.getElementById('canvas');
var text = document.getElementById('canvas-size');
console.log(canvas);

var context = canvas.getContext('webgl2');
console.log(context);
context.enable(context.DEPTH_TEST);

var vertexShader = aux.compileShader(context, context.VERTEX_SHADER, vertexShaderSource);
var fragShader = aux.compileShader(context, context.FRAGMENT_SHADER, fragShaderSource);
var program = aux.createProgram(context, vertexShader, fragShader);

var positionAttributeLocation = context.getAttribLocation(program, "a_position");
var normalAttributeLocation = context.getAttribLocation(program, "a_normal");
var vertexColorAttributeLocation = context.getAttribLocation(program, "a_vertexColor");
var uniform_LightPositionLocation = context.getUniformLocation(program, "u_lightPos");
var uniform_CameraMVPLocation = context.getUniformLocation(program, "u_camMvp");
var uniform_ProjMatLocation = context.getUniformLocation(program, "u_projMatrix");
var uniform_ColorLocation = context.getUniformLocation(program, "u_color");
var uniform_TransformLocation = context.getUniformLocation(program, "u_transform");

console.log(`Attrib location for a_position is ${positionAttributeLocation}`);



var rectSize = [ 100, 100 ];

var lightPos = [300, 150, -600];

var rectVerts = aux.getRectangle(0, 0, rectSize[0], rectSize[1], 100);
var rectVerts3 = aux.getRectangle(0, 0, rectSize[0], rectSize[1], 100);
var rectVerts2 = aux.getRectangle(0,0, 200, 150,150);
var lightVerts = aux.getRectangle(0,0,10,10,10);

var vao = context.createVertexArray();
var vaoTransform = new mat(4);
vaoTransform.position(0,0,0);
var vao3 = context.createVertexArray();
var vao3Transform = new mat(4);
vao3Transform.position(0,0,0);
var vao2 = context.createVertexArray();
var vao2Transform = new mat(4);
vao2Transform.position(-200,-350, -600);
var lightVao = context.createVertexArray();
var lightTransform = new mat(4);





var objectsToDraw = [];
var cube1 = setupCube(vao, rectVerts, context, vaoTransform);
var cube2 = setupCube(vao2, rectVerts2, context, vao2Transform);
var cube3 = setupCube(vao3, rectVerts3, context, vao3Transform);
var light = setupCube(lightVao, lightVerts, context, lightTransform);

function setupCube(attrib, data, context, objTransform){
  var positionBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
  context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), context.STATIC_DRAW);
  context.bindVertexArray(attrib);
  var size = 3;
  var type = context.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  var primitiveType = context.TRIANGLES;
  var count = 36;
  context.enableVertexAttribArray(positionAttributeLocation);
  context.vertexAttribPointer(positionAttributeLocation, size, type, normalize, 36, offset);

  context.enableVertexAttribArray(normalAttributeLocation);
  context.vertexAttribPointer(normalAttributeLocation, size, type, normalize, 36, 3*4);

  context.enableVertexAttribArray(vertexColorAttributeLocation);
  context.vertexAttribPointer(vertexColorAttributeLocation,size, type, normalize, 36, 6*4);
  
  objectsToDraw.push({attrib, offset:0,count, primitiveType, transform: objTransform})
  return objectsToDraw.length-1;
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
  const displayWidth  = canvas.clientWidth * window.devicePixelRatio;;
  const displayHeight = canvas.clientHeight * window.devicePixelRatio;;
 
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
cameraMvp.position(400, -200);
cameraMvp.rotation(0);
mvp.scale(1, 1);
mvp.position(0, 0, 0);
mvp.rotation(0);
var test = cameraMvp.toMvp();
var test2 = 1;
function mainDraw(){
  if(resizeCanvasToDisplaySize(canvas)){
    text.innerHTML = `Canvas size ${canvas.width}, ${canvas.height}`;
    context.viewport(0,0, canvas.width, canvas.height);
  } 
  
  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
  context.uniformMatrix4fv(uniform_ProjMatLocation, false, projectionMatrix.toMvp(0));
  context.uniformMatrix4fv(uniform_CameraMVPLocation, false, cameraMvp.inverse());
  context.clearColor(0.1,0.25,0.2,0);
  context.useProgram(program);
  context.uniform4f(uniform_ColorLocation,.7, .7, 0.3, 1);
  //t[0] = (Math.sin(time++ * deg2rad) + 1 / 2) * 50;
  //t[1] = (Math.cos(time++ * deg2rad) + 1 / 2) * 50;
  //t[0] = context.canvas.width/2;
  //t[1] = context.canvas.height/2;
  var timeDeg2Rad = time++ * deg2rad;
  text.innerHTML = timeDeg2Rad;
  //objectsToDraw[cube2].transform.scale(1, 1 + 0.2*Math.cos(timeDeg2Rad*10), 1);
  //objectsToDraw[cube1].transform.rotation(1,timeDeg2Rad*10 , 1);
  objectsToDraw[cube1].transform.position(300, -150, -600);
  objectsToDraw[cube1].transform.rotation(0,45,0);  
  objectsToDraw[cube3].transform.position(150, -150, -600);
  objectsToDraw[cube3].transform.rotation(0,45,0);
  objectsToDraw[light].transform.position(300, -150 + Math.cos(timeDeg2Rad) * 300, -600 + Math.sin(timeDeg2Rad)* 300);
  var lightTransform = objectsToDraw[light].transform.getPos();
  console.log(`Light pos is ${lightTransform[0]}, ${lightTransform[1]}, ${lightTransform[2]}`)
  context.uniform3f(uniform_LightPositionLocation,false, lightTransform[0], lightTransform[1], lightTransform[2]);
  t[2] = -600;
  t[1] = -100;
  mvp.position(t[0], t[1], t[2]);
  mvp.rotation(0,time++/3,0);
  var test = mvp.toMvp();
  //context.uniform4f(uniform_ColorLocation, Math.sin(time++ * deg2rad), Math.sin(time++ *deg2rad + randOffset), 0.5, 1);
  objectsToDraw.forEach((element, idx) => {
    context.uniformMatrix4fv(uniform_TransformLocation, false, objectsToDraw[idx].transform.toMvp());
    context.bindVertexArray(element.attrib);
    context.drawArrays(element.primitiveType, element.offset, element.count);
  });
  requestAnimationFrame(mainDraw)
}
mainDraw();
