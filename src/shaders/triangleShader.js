
exports.triangleShader = 
`
    varying vec2 vuv;
    uniform float time;

    float circle(in vec2 _st, in float _radius){
        vec2 dist = _st-vec2(0.5);
        return 1.-smoothstep(_radius-(_radius*0.01),
                             _radius+(_radius*0.01),
                             dot(dist,dist)*4.0);
    }

    void main(){

        vec2 color = vuv;

        //color *= 12.0;

        for(int i = 0; i < 5; i++){
            //color.x += sin(time) + color.y;
            //color.y += sin(time) + color.x;            
        }

        vec2 dist = vec2(circle(color, 0.1));

        //dist -= 0.5;

        gl_FragColor = vec4(color, 0.0, 0.0);
        //gl_FragColor = vec4(dist, 0.0, 0.0);        
    }
`