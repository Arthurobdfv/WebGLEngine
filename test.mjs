import './matrix.mjs';
import { mat } from './matrix.mjs';
import './shaderConstants.mjs';
import { ATTRIB_NORMAL, ATTRIB_POSITION, ATTRIB_TEXTURE_COORD, ATTRIB_VERTEX_COLOR, UNIFORM_CAMERA_MAT, UNIFORM_PROJECTION_MAT, UNIFORM_TEXTURE_IMAGE, UNIFORM_TRANSFORMATION_MAT, basicLitFragShaderSource, basicLitTexturedFragShaderSource, basicLitTexturedVertexShaderSource, basicLitVertexShaderSource } from './shaderConstants.mjs';
import { log, glContext, ShaderProgram, compileShader,getRectangle, getCubeUVCoords } from './glContext.mjs';
import loadImage from './webHelpers.mjs';




try {

  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById('canvas');
  var text = document.getElementById('canvas-size');
  console.log(canvas);
  
  var context = glContext;
  console.log(context);
  context.enable(context.DEPTH_TEST);
  var activeProgram = null;
  log(`Webgl Errors: ${context.getError()}`);

  var contextVariables = []
  contextVariables.push({name: ATTRIB_POSITION, uniform: false, value: null});
  contextVariables.push({name: ATTRIB_NORMAL, uniform: false, value: null});
  contextVariables.push({name: ATTRIB_TEXTURE_COORD, uniform: false, value: null});
  contextVariables.push({name: ATTRIB_VERTEX_COLOR, uniform: false, value: null});
  contextVariables.push({name: UNIFORM_CAMERA_MAT, uniform: true, type: "m4", value: null});
  contextVariables.push({name: UNIFORM_PROJECTION_MAT, uniform: true, type: "m4", value: null});
  contextVariables.push({name: UNIFORM_TRANSFORMATION_MAT, uniform: true, type: "m4", value: null});
  contextVariables.push({name: "u_lightPos", uniform: true, type: "v3", value: null});
  contextVariables.push({name: "u_color", uniform: true, type: "v4", value: null});
  contextVariables.push({name: ATTRIB_TEXTURE_COORD, uniform: false, type: "v2", value: null});
  contextVariables.push({name: UNIFORM_TEXTURE_IMAGE, uniform: true, value: null});


  UNIFORM_TEXTURE_IMAGE
  var contextVariableValues = {}; 
  contextVariables.forEach(e => contextVariableValues[e.name] = { value: null, type: e.type } );
  var testProgram = new ShaderProgram(basicLitVertexShaderSource, basicLitFragShaderSource, context, contextVariables, "Basic_Lit_Shader_Program");
  var basicLitShaderProgram = testProgram.getProgram();
  log(`Webgl Errors: ${context.getError()}`);
  log(`Webgl Errors: ${context.getError()}`);
  var vertexTexShader = compileShader(context, context.VERTEX_SHADER, basicLitTexturedVertexShaderSource);
  var fragTexShader = compileShader(context, context.FRAGMENT_SHADER, basicLitTexturedFragShaderSource);
  //var texturedShaderProgram = createProgram(context, vertexTexShader, fragTexShader);
  switchProgram(basicLitShaderProgram);
  log(`Webgl Errors: ${context.getError()}`);
  log(`Webgl Errors: ${context.getError()}`);
  log(`GetProgramReturns: ${basicLitShaderProgram}`);


  var texturedProgram = new ShaderProgram(basicLitTexturedVertexShaderSource, basicLitTexturedFragShaderSource, context, contextVariables, "Textured_Program");
  var texCoordAttributeLocation = texturedProgram.getLocation(ATTRIB_TEXTURE_COORD);
  
  function switchProgram(newProgram){
      context.useProgram(newProgram);
      activeProgram = newProgram;
  }
  var rectSize = [ 100, 100 ];

  var lightPos = [300, 150, -600];

  var rectVerts = getRectangle(-50, -50, 100, 100, 100);
  var rectVerts3 = getRectangle(-50, -50, 100, 100, 100);
  var rectVerts2 = getRectangle(-100,-75, 200, 150,150);
  var lightVerts = getRectangle(0,0,10,10,10);

  var vao = context.createVertexArray();
  var vaoTransform = new mat(4);
  vaoTransform.position(0,0,0);
  var vao3 = context.createVertexArray();
  var vao3Transform = new mat(4);
  vao3Transform.position(0,0,0);

  var lightVao = context.createVertexArray();
  var lightTransform = new mat(4);





  var objectsToDraw = [];
  var cube1 = setupCube(vao, rectVerts, context, vaoTransform, testProgram);
  var light = setupCube(lightVao, lightVerts, context, lightTransform, testProgram);
  
  switchProgram(texturedProgram.getProgram());
  var cube3 = setupCube(vao3, rectVerts3, context, vao3Transform, texturedProgram);
  await appendTextureToCube(cube3,'./textures/brick 10 - 128x128.png');
  
  
  var vao2 = context.createVertexArray();
  var vao2Transform = new mat(4);
  //var cube2 = setupCube(vao2, rectVerts2, context, vao2Transform, testProgram);
  log(`Go!!!`);

  log(`Webgl Errors: ${context.getError()}`);

  log(`Webgl Errors: ${context.getError()}`);
  function setupCube(attrib, data, context, objTransform, shaderProgram){
    switchProgram(shaderProgram.getProgram());
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
    var positionLocation = shaderProgram.getLocation(ATTRIB_POSITION);
    if(positionLocation != -1){
      context.enableVertexAttribArray(positionLocation);
      context.vertexAttribPointer(positionLocation, size, type, normalize, 36, offset);
    }
    
    var normalLocation = shaderProgram.getLocation(ATTRIB_NORMAL);
    if(normalLocation != -1){
      context.enableVertexAttribArray(normalLocation);
      context.vertexAttribPointer(normalLocation, size, type, normalize, 36, 3*4);
    }
    
    var vertexLocation = shaderProgram.getLocation(ATTRIB_VERTEX_COLOR);
    if(vertexLocation != -1){
      context.enableVertexAttribArray(vertexLocation);
      context.vertexAttribPointer(vertexLocation,size, type, normalize, 36, 6*4);
    } 
    
    objectsToDraw.push({attrib, offset:0,count, primitiveType, transform: objTransform, shaderProgram})
    return objectsToDraw.length-1;
  }

  async function appendTextureToCube(cubeIndex, textureSource){
    var shaderProgram = objectsToDraw[cubeIndex].shaderProgram;
    switchProgram(shaderProgram.getProgram());
    var textureCoordArrayAttributeLocation = shaderProgram.getLocation(ATTRIB_TEXTURE_COORD);
    log(`Called appendTextureToCube on CubeIndex ${cubeIndex}`);
    var imgPromise = loadImage(textureSource);
    var cubeUVCoords = getCubeUVCoords();
    var coordBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, coordBuffer);
    log(`Webgl Errors: ${context.getError()}`);
    log(`Setting Coord buffer data`);
    context.bufferData(context.ARRAY_BUFFER, cubeUVCoords, context.STATIC_DRAW);
    log(`Webgl Errors: ${context.getError()}`);
    log(`Enabling texCoordAttribArray, location: ${texCoordAttributeLocation}`); context.enableVertexAttribArray(textureCoordArrayAttributeLocation);
    log(`Webgl Errors: ${context.getError()}`); context.vertexAttribPointer(textureCoordArrayAttributeLocation, 2, context.FLOAT, true, 0,0);
    log(`Webgl Errors: ${context.getError()}`);

    log(`Webgl Errors: ${context.getError()}`);
    log(`Webgl Errors: ${context.getError()}`);
    log(`Finished setting up texture for cube ${cubeIndex}`);


    var texture = context.createTexture();
    context.activeTexture(context.TEXTURE0 + 0);
    context.bindTexture(context.TEXTURE_2D, texture);
    
    log(`Configuring texture`);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
    log(`Webgl Errors: ${context.getError()}`);
  
    var mipLevel = 0;               // the largest mip
    var internalFormat = context.RGBA;   // format we want in the texture
    var srcFormat = context.RGBA;        // format of data we are supplying
    var srcType = context.UNSIGNED_BYTE  // type of data we are supplying
    log(`Supplying texture image data for cube`);
    
    var img = await imgPromise;
    log(`Ready...`)
    log(`Set...`);
    context.texImage2D(context.TEXTURE_2D,
                  mipLevel,
                  internalFormat,
                  srcFormat,
                  srcType,
                  img);
  }
  context.viewport(0,0, context.canvas.width, context.canvas.height);

  log(`Webgl Errors: ${context.getError()}`);
  log(`Webgl Errors: ${context.getError()}`);
  context.clearColor(0.1,0.25,0.2,0);
  context.clear(context.COLOR_BUFFER_BIT);

  var randOffset = Math.random(0,1) * 1000;
  var time = 0;
  var deg2rad = 0.017453;


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
    cameraMvp.position(0, 200);
    cameraMvp.rotation(-25);
    mvp.scale(1, 1);
    mvp.position(0, 0, 0);
    mvp.rotation(0);
    var test = cameraMvp.toMvp();
    var test2 = 1;
    var tick = 0;
    function mainDraw(){
    tick = (tick + 1) % 60;
    if(tick == 0){
    //log(`Webgl Errors: ${context.getError()}`);
    }
    if(resizeCanvasToDisplaySize(canvas)){
      context.viewport(0,0, canvas.width, canvas.height);
    } 
    
    //context.uniformMatrix4fv(uniform_ProjMatLocation, false, projectionMatrix.toMvp(0));
    contextVariableValues[UNIFORM_PROJECTION_MAT].value = projectionMatrix.toMvp(0);
    //context.uniformMatrix4fv(uniform_CameraMVPLocation, false, cameraMvp.inverse());
    contextVariableValues[UNIFORM_CAMERA_MAT].value = cameraMvp.inverse();
    contextVariableValues[UNIFORM_TEXTURE_IMAGE].value = 0;
    
    switchProgram(basicLitShaderProgram)  

    contextVariableValues["u_color", [.7,.7,0.3,1]];
    
    var timeDeg2Rad = time++ * deg2rad * 2;
    //objectsToDraw[cube2].transform.scale(1, 1 + 0.2*Math.cos(timeDeg2Rad*10), 1);
    //objectsToDraw[cube1].transform.rotation(1,timeDeg2Rad*10 , 1);
    objectsToDraw[cube1].transform.position(-150, 0, -300);
    objectsToDraw[cube1].transform.rotation(0,45+timeDeg2Rad,0);  
    objectsToDraw[cube3].transform.position(200, 0, -300);
    objectsToDraw[cube3].transform.rotation(0,45+timeDeg2Rad*50,0);
    objectsToDraw[light].transform.position(0, 100 + Math.cos(timeDeg2Rad) * 100, -200 + Math.sin(timeDeg2Rad)* 100);
    var lightTransform = objectsToDraw[light].transform.getPos();
    //context.uniform3f(uniform_LightPositionLocation, lightTransform[0], lightTransform[1], lightTransform[2]);
    contextVariableValues["u_lightPos"].value = new Float32Array([lightTransform[0], lightTransform[1], lightTransform[2]]);
    t[2] = -600;
    t[1] = -100;
    mvp.position(t[0], t[1], t[2]);
    mvp.rotation(0,time++/3,0);
    var test = mvp.toMvp();

    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
    objectsToDraw.forEach((element, idx) => {
      if(objectsToDraw[idx].shaderProgram.getProgram() != activeProgram){
        //log("Switching program...");
        switchProgram(element.shaderProgram.getProgram());
      }
      contextVariableValues[UNIFORM_TRANSFORMATION_MAT].value = objectsToDraw[idx].transform.toMvp();
      
      element.shaderProgram.setVariables(contextVariables, contextVariableValues);
      //context.uniformMatrix4fv(uniform_TransformLocation, false, objectsToDraw[idx].transform.toMvp());
      context.bindVertexArray(element.attrib);
      context.drawArrays(element.primitiveType, element.offset, element.count);
    });
    requestAnimationFrame(mainDraw)
  }
  mainDraw();

}
catch(error) {
  log(error);
}
