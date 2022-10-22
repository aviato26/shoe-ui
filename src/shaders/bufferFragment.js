

exports.bufferFrag = 
`
uniform vec2 res;
uniform float time;
uniform vec2 mouse;
uniform sampler2D mainTex;
varying vec2 vuv;

void main() {

  //vec2 res = gl_FragCoord.xy;
  vec2 res = vuv - 0.5;  

  vec3 bufferTexture = texture2D(mainTex, res).xyz;

  vec3 displacement = vec3(0.0);
  vec3 d = vec3(0.0);

  //vec3 dist = bufferTexture - vec3(mouse, 0.0);
  //vec3 dist = vec3(mouse, 0.0) - vec3(vec2(0.0), 0.0);  
  vec3 dist = bufferTexture - vec3(mouse, 0.0);
  vec3 diff = vec3(0.0);
  vec3 vel = vec3(0.0);

  //displacement += (bufferTexture - vec3(mouse, 0.0));
  //displacement += (vec3(res - 0.5, 0.0) - vec3(mouse, 0.0));
  diff += dist;

  //displacement += -diff;

  //gl_FragColor = vec4(res, 0.0, 1.0);
  gl_FragColor = vec4(bufferTexture, 1.0);  
  //gl_FragColor = vec4(displacement, 1.0);  
  //gl_FragColor = vec4(d, 1.0);      
}
`