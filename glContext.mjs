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


  export function getRectangle(x, y, width, height){
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    return new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
     ]);
  }