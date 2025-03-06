



var textBox = document.getElementById('textarea');
export function log(message){
  textBox.innerHTML += '\n' + message;
  textBox.style.height = 'auto';
  textBox.style.height = `${textBox.scrollHeight}px`;
}

export const glContext = document.getElementById('canvas').getContext('webgl2');

export function compileShader(WebGLContext, shaderType, sourceCode){
    var shader = WebGLContext.createShader(shaderType);
    WebGLContext.shaderSource(shader, sourceCode);
    WebGLContext.compileShader(shader);
    var success = WebGLContext.getShaderParameter(shader, WebGLContext.COMPILE_STATUS);
    var message = '';
    if(success){
        message += 'Vertex is okay\n';
    } else {
        message += 'Vertex is NOT okay\n';
    }
    message += WebGLContext.getShaderInfoLog(shader);
    log(message);
    return shader;
}

export function createProgram(WebGLContext, vertexShader, fragShader){
    var program = WebGLContext.createProgram();
    WebGLContext.attachShader(program, vertexShader);
    WebGLContext.attachShader(program, fragShader);
    WebGLContext.linkProgram(program);
    var success = WebGLContext.getProgramParameter(program, WebGLContext.LINK_STATUS);
    if(success){
        log('WebGL Program Created and Linked Successfully!\n');
        return program;
    }
    log(WebGLContext.getProgramInfoLog(program));
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
    return new Float32Array([
        stepX,      stepY,
        2*stepX,    0,
        stepX,      0,
        2*stepX,    stepY,
        2*stepX,    0,
        stepX,      stepY,

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

    ])
  }
  
  export class ShaderProgram {
        static shaderCount = 1;  
        program;
        context;
        attribs = [];
        name;
        /**
         *
         */
        constructor(vertexSource, fragSource, glContextt, contextVariables = [], shaderProgramName = null) {
            if(shaderProgramName == null){
                this.name = `ShaderProgram_${ShaderProgram.shaderCount}`
                ++ShaderProgram.shaderCount;
            }
            else {
                this.name = shaderProgramName;
                ++ShaderProgram.shaderCount
            }
            log(`Loading shader ${this.name}`);
            var vertexShader = compileShader(glContext, glContext.VERTEX_SHADER, vertexSource);
            var fragShader = compileShader(glContext, glContext.FRAGMENT_SHADER, fragSource);
            this.program = createProgram(glContext, vertexShader, fragShader);
            this.context = glContext; 
            if(contextVariables.length != 0){
                contextVariables.forEach(element => {
                    var loc = glContext.getAttribLocation(this.program,element.name);
                    if(loc != -1){
                        this.attribs[element.name] = { uniform: false, location: loc};
                        log(`Attribute named ${element.name} found for shaderProgram ${this.name}, with location: ${loc}`);
                    } else {
                        var uloc = glContext.getUniformLocation(this.program,element.name);
                        if(uloc != null){
                            log(`Uniform named ${element.name} found for shaderProgram ${this.name}, with location: ${uloc}`);
                            this.attribs[element.name] = { uniform: true, location: uloc, type: element.type};  
                        }
                        else{
                            log(`Not a Uniform nor an Attribute named ${element.name} were fount on shaderProgram ${this.name}`);
                        }
                    }
                });
            }
        }

        setVariables(contextVariables = [], contextValues = {}) {
            contextVariables.forEach(element => {
                if(element.name in this.attribs){
                    console.log(`will try ${element.name}`)
                    var attrib = this.attribs[element.name];
                    if(attrib.uniform){
                        this.setUniformVariable(attrib.location, element.type, contextValues[element.name].value);
                    }
                }
            })
        }

        getProgram(){
            return this.program;
        }

        setUniformVariable(location, type ,value){
            switch(type){
                case 'v3':
                    var casted = new Float32Array(value);
                    glContext.uniform3f(location, casted[0], casted[1], casted[2]);
                    break;
                case 'v4':
                    var casted = new Float32Array(value);
                    glContext.uniform4f(location, casted[0], casted[1], casted[2], casted[3]);
                    break;
                case 'm4':
                    var casted = new Float32Array(value);
                    glContext.uniformMatrix4fv(location, false ,casted);
                    break;
                case 'm4t':
                    glContext.uniformMatrix4fv(location, false ,value);
                    break;
                case 'i':
                    glContext.uniform1i(location, value);
                    break;
            }
        }

        getLocation(parameter){
            var loc = -1;
            if(parameter in this.attribs)
                loc = this.attribs[parameter].location;
            log(`${this.name} shaderProgram being requested for attrib ${parameter}, location found: ${loc}`);
            return loc;
        }

        setAttributeVariable(name, type, value){

        }
  }
