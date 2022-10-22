

exports.vert = 
`
varying vec2 vuv;

void main()
{
    vuv = uv;
    
    vec3 pos = position;
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
`;