
export const ATTRIB_POSITION = `a_position`;
export const ATTRIB_NORMAL = `a_normal`;
export const ATTRIB_VERTEX_COLOR = `a_vertexColor`;
export const ATTRIB_TEXTURE_COORD = `a_texCoord`;
export const UNIFORM_TEXTURE_IMAGE = `u_image`;
export const UNIFORM_PROJECTION_MAT = `u_projMatrix`;
export const UNIFORM_CAMERA_MAT = `u_camMvp`;
export const UNIFORM_TRANSFORMATION_MAT = `u_transform`;


export const basicLitFragShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
uniform vec4 u_color;
in vec3   v_normal;
in vec3   v_pos; 
in vec4   v_vertexColor;
in vec3   v_lightPos;
in vec3   v_lightDir;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  float intensity = 0.3;
  float NdotL = dot(normalize(v_lightPos-v_pos), normalize(v_normal));
  //outColor = vec4(u_color.xyz * NdotL * intensity,1);
  //outColor = v_vertexColor;
outColor = vec4(vec3(NdotL * v_vertexColor.xyz),1);
//outColor = vec4(vec3(normalize(v_lightPos-v_pos)),1);
//outColor = vec4(vec3(NdotL),1);
}

`;

export const basicLitVertexShaderSource = `#version 300 es
 
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
out vec3 v_lightDir;
// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  mat4 mvp = u_projMatrix * u_camMvp * u_transform;
  vec4 worldPos = u_transform * a_position;
  v_normal = mat3(u_transform) * a_normal;
  gl_Position = mvp * a_position;
  v_pos = worldPos.xyz;
  v_vertexColor = a_vertexColor;
  v_lightPos = u_lightPos;
  v_lightDir = normalize(u_lightPos-worldPos.xyz);
}
`;


export const basicLitTexturedFragShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
uniform vec4 u_color;
in vec3   v_normal;
in vec3   v_pos; 
in vec4   v_vertexColor;
in vec3   v_lightPos;
in vec3   v_lightDir;
in vec2   v_texCoord;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
uniform sampler2D u_image;
 
void main() {
  // Just set the output to a constant reddish-purple
  float intensity = 0.3;
  float NdotL = dot(normalize(v_lightPos-v_pos), normalize(v_normal));

  outColor = vec4(NdotL * texture(u_image, v_texCoord).xyz,1);

}

`;

export const basicLitTexturedVertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
precision highp float;
in vec4 a_position;
in vec3 a_normal;
in vec4 a_vertexColor;
in vec2 a_texCoord;
 
// A matrix to transform the positions by
uniform mat4 u_projMatrix;
uniform mat4 u_transform;
uniform mat4 u_camMvp;
uniform vec3 u_lightPos;


out vec3 v_normal;
out vec3 v_pos; 
out vec4 v_vertexColor;
out vec3 v_lightPos;
out vec3 v_lightDir;
out vec2 v_texCoord;
// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  mat4 mvp = u_projMatrix * u_camMvp * u_transform;
  vec4 worldPos = u_transform * a_position;
  v_normal = mat3(u_transform) * a_normal;
  gl_Position = mvp * a_position;
  v_pos = worldPos.xyz;
  v_vertexColor = a_vertexColor;
  v_lightPos = u_lightPos;
  v_lightDir = normalize(u_lightPos-worldPos.xyz);
  v_texCoord = a_texCoord;
}
`;
