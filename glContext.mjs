export function compileShader(WebGLContext, shaderType, sourceCode){
    var shader = WebGLContext.createShader(shaderType);
    WebGLContext.shaderSource(shader, sourceCode);
    WebGLContext.compileShader(shader);
    var success = WebGLContext.getShaderParameter(shader, WebGLContext.COMPILE_STATUS);
    if(success){
        console.log('Vertex is okay')
    } else {
        console.log('Vertex is NOT okay')
    }
    console.log(WebGLContext.getShaderInfoLog(shader));
    return shader;
}

export function createProgram(WebGLContext, vertexShader, fragShader){
    var program = WebGLContext.createProgram();
    WebGLContext.attachShader(program, vertexShader);
    WebGLContext.attachShader(program, fragShader);
    WebGLContext.linkProgram(program);
    var success = WebGLContext.getProgramParameter(program, WebGLContext.LINK_STATUS);
    if(success){
        console.log('WebGL Program Created and Linked Successfully!');
        return program;
    }

    console.log(WebGLContext.getProgramInfoLog(program));
    WebGLContext.deleteProgram(program);
}

export function setRectangle(gl, x, y, width, height) {
    
    gl.bufferData(gl.ARRAY_BUFFER, getRectangle(x,y, width,height), gl.STATIC_DRAW);
  }

  export function randomInt(range) {
    return Math.floor(Math.random() * range);
  }


  export function getRectangle(x, y, width, height, depth = 10){
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    return new Float32Array([
        x1, y2, 0,       0, 0,-1,   1, 0, 0,
        x2, y1, 0,       0, 0,-1,   1, 0, 0,
        x1, y1, 0,       0, 0,-1,   1, 0, 0,
        x2, y2, 0,       0, 0,-1,   1, 0, 0,
        x2, y1, 0,       0, 0,-1,   1, 0, 0,
        x1, y2, 0,       0, 0,-1,   1, 0, 0,


        // Left Side?
        x1,y2,depth,    -1, 0, 0,   1, 1, 0,
        x1,y1,0,        -1, 0, 0,   1, 1, 0,
        x1,y1,depth,    -1, 0, 0,   1, 1, 0,
        x1,y2,0,        -1, 0, 0,   1, 1, 0,
        x1,y1,0,        -1, 0, 0,   1, 1, 0,
        x1,y2,depth,    -1, 0, 0,   1, 1, 0,

        // Right Side?
        x2,y2,depth,     1, 0, 0,   0, 1, 0,
        x2,y1,depth,     1, 0, 0,   0, 1, 0,
        x2,y1,0,         1, 0, 0,   0, 1, 0,
        x2,y2,0,         1, 0, 0,   0, 1, 0,
        x2,y2,depth,     1, 0, 0,   0, 1, 0,
        x2,y1,0,         1, 0, 0,   0, 1, 0,

        // top side
        x2, y2,0,        0, 1, 0,   0, 1, 1,
        x1, y2,0,        0, 1, 0,   0, 1, 1,
        x1, y2,depth,    0, 1, 0,   0, 1, 1,
        x1, y2,depth,    0, 1, 0,   0, 1, 1,
        x2, y2,depth,    0, 1, 0,   0, 1, 1,
        x2, y2,0,        0, 1, 0,   0, 1, 1,

        // Bottom Side
        x2, y1,0,        0,-1, 0,   0, 0, 1,
        x1, y1,depth,    0,-1, 0,   0, 0, 1,
        x1, y1,0,        0,-1, 0,   0, 0, 1,
        x2, y1,0,        0,-1, 0,   0, 0, 1,
        x2, y1,depth,    0,-1, 0,   0, 0, 1,
        x1, y1,depth,    0,-1, 0,   0, 0, 1,

        x1, y2, depth,   0, 0, 1,   1, 0, 1,
        x2, y1, depth,   0, 0, 1,   1, 0, 1,
        x2, y2, depth,   0, 0, 1,   1, 0, 1,
        x1, y1, depth,   0, 0, 1,   1, 0, 1,
        x2, y1, depth,   0, 0, 1,   1, 0, 1,
        x1, y2, depth,   0, 0, 1,   1, 0, 1,


     ]);
  }

  export function getCubeUVCoords(){
    var stepX = 0.33;
    var stepY = 0.25;
    return new Float32Array(
        stepX,      0,
        stepX,      stepY,
        2*stepX,    0,
        stepX,      stepY,
        2*stepX,    stepY,
        2*stepX,    0,

        stepX,      0       +stepY,
        stepX,      stepY   +stepY,
        2*stepX,    0       +stepY,
        stepX,      stepY   +stepY,
        2*stepX,    stepY   +stepY,
        2*stepX,    0       +stepY,

        stepX,      0       +2*stepY,
        stepX,      stepY   +2*stepY,
        2*stepX,    0       +2*stepY,
        stepX,      stepY   +2*stepY,
        2*stepX,    stepY   +2*stepY,
        2*stepX,    0       +2*stepY,

        stepX,      0       +3*stepY,
        stepX,      stepY   +3*stepY,
        2*stepX,    0       +3*stepY,
        stepX,      stepY   +3*stepY,
        2*stepX,    stepY   +3*stepY,
        2*stepX,    0       +3*stepY,

        stepX + stepX,      0       +2*stepY,
        stepX + stepX,      stepY   +2*stepY,
        2*stepX + stepX,    0       +2*stepY,
        stepX + stepX,      stepY   +2*stepY,
        2*stepX + stepX,    stepY   +2*stepY,
        2*stepX + stepX,    0       +2*stepY,

        stepX - stepX,      0       +2*stepY,
        stepX - stepX,      stepY   +2*stepY,
        2*stepX - stepX,    0       +2*stepY,
        stepX - stepX,      stepY   +2*stepY,
        2*stepX - stepX,    stepY   +2*stepY,
        2*stepX - stepX,    0       +2*stepY,

    )
  }
