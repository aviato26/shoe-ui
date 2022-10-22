


exports.frag = 
`
uniform vec2 res;
uniform float time;
uniform vec2 mouse;
uniform sampler2D tex;
uniform sampler2D tex2;
varying vec2 vuv;

float sdSphere(vec3 p, float s){
  return length(p) - s;
}

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  
  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
              oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
              oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
              0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
mat4 m = rotationMatrix(axis, angle);
return (m * vec4(v, 1.0)).xyz;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x,max(q.y,q.z)), 0.0);
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5 + 0.5 * (b-a) / k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

mat2 rotate2d(float angle){
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float sdf(vec3 p){
  float radius = 0.9;  
  vec3 p1 = rotate(p, vec3(vuv, 0.0), mouse.x);
  //vec3 p1 = rotate(p, vec3(vuv, 0.0), time); 
  
  //vec2 m = texture2D(mainTex, vuv).xy;

  float box =  sdBox(p, vec3(0.33));
  //float sphere = sdSphere(p - vec3(mouse, 0.0), 0.25);  
  //float sphere = sdBox(p - vec3(mouse, 0.0), vec3(0.33));    
  float sphere = sdSphere(p - vec3(mouse, 0.0), 0.2);    
  return smin(box, sphere, 0.5);
}

vec3 calcNormal(vec3 p){
  vec2 eps = vec2(0.0001, 0.01);
  return normalize(vec3( 
    sdf(p + eps.xyy) - sdf(p - eps.xyy),
    sdf(p + eps.xyx) - sdf(p - eps.yxy), 
    sdf(p + eps.yyx) - sdf(p - eps.yyx) 
  ));
}

void main() {

  vec2 res = vuv;

  vec3 camPos = vec3(0.0, 0.0, 3.0);

  vec3 ray = normalize(vec3(vuv - 0.5, -1.0));

  vec3 rayPos = camPos;

  float t = 0.0;

  float tMax = 5.0;

  for(int i = 0; i < 35; ++i){
    vec3 pos = camPos + t * ray;
    float h = sdf(pos);
    float v = sdf(vec3(res, 1.0));

    t += h;

    if(t < 0.0001 || t > tMax) break;
  }

  vec3 color = vec3(0.0);

  if( t < tMax ){
    vec3 pos = camPos + t * ray;    
    //res.xy = rotate(pos, vec3(res, 1.0), mouse.x + (mouse.y * -1.0)).xy;
    res = (vuv - 0.5) * 2.5;

    for(int i = 0; i < 3; i++){
      res.x += (mouse.x * res.y) * -res.y;
      res.y += ((mouse.y * res.x) * -1.0) * res.x;
    }

    //res.xy = rotate(pos, vec3(res, 1.0), time).xy;    
    //vec3 shoe = texture2D(tex, (res * 2.0) - 0.5).xyz;           
    vec3 shoe = texture2D(tex, (res * 1.5) + 0.5).xyz;                
    vec3 shoe2 = texture2D(tex2, (res * 1.5) + 0.5).xyz;                    

    color = vec3(1.0);
    vec3 normal = calcNormal(pos);
    color = normal;
    //float diff = dot(shoe, normal);    

    vec3 mixedShoes = mix(shoe, shoe2, 0.0);


    //float diff = dot(shoe, normal * color);

    float diff = dot(mixedShoes, normal * color);
    
    //color = vec3(diff * shoe);

    color = vec3(diff * mixedShoes);    
  }

  //vec3 bufferTexture = texture2D(mainTex, res).xyz;

  //gl_FragColor = vec4(res, 0.0, 1.0);
  gl_FragColor = vec4(color, 1.0);  
  //gl_FragColor = vec4(bufferTexture, 1.0);  
}
`