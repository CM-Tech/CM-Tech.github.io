precision highp float;
precision mediump sampler2D;

varying vec2 coords;
uniform sampler2D density;

void main () {
    vec3 color=texture2D(density, coords).xyz;
    color.x=floor(color.x*3.0)/2.0;
    color.y=floor(color.y*3.0)/2.0;
    color.z=floor(color.z*3.0)/2.0;
    color=clamp(color,0.0,1.0);
    if(color.x==color.y && color.x==color.z){
        color.xyz=floor(color.xyz*2.0)/1.0;
    }
    gl_FragColor = vec4(vec3(243.0/255.0)*max(0.0,1.0-length(color))+color*243.0/255.0,1.0);
}