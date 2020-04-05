precision highp float;
precision mediump sampler2D;

varying vec2 coords;
uniform sampler2D density;
uniform sampler2D velocity;
uniform sampler2D page;
uniform vec2 texelSize;
uniform float scroll;

float colorDistance(vec3 a,vec3 b){
    return 0.5-1.0/3.0*dot(a-0.5,b-0.5)*2.0;
}

vec3 rgb(int a,int b,int c){
    return vec3(float(a)/255.0,float(b)/255.0,float(c)/255.0);
}
#define addToPalette(a,b,c) if(colorDistance(blendedColor, rgb(a,b,c))<colorDistance(blendedColor,bestColorMatch)) bestColorMatch=rgb(a,b,c);

vec3 getColorAt(vec2 uv){
    vec3 color=texture2D(density, uv).xyz;
    float alpha=clamp(texture2D(density, uv).w,0.0,1.0);
    color=clamp(color,0.0,1.0); //sometimes the color might have a really high component that we need to tune down
    color.xyz=color.xyz;
    vec2 proj=(uv/texelSize-0.1*texture2D(velocity, uv).xy*1.0)+vec2(0,-scroll)/texelSize;
    vec3 bk=vec3(1.0);
    vec4 pgt=texture2D(page, vec2(0.0,1.0)+(uv-0.1*texture2D(velocity, uv).xy*texelSize.xy)*vec2(1.0,-1.0)).xyzw;
    pgt.xyz=vec3(1.0,1.0,1.0)*(pgt.xyz-vec3(0.5))+vec3(0.5);
    bk=bk*(1.0-pgt.w)+pgt.w*pgt.xyz;
    vec3 blendedColor=bk*(1.0*max(0.0,1.0-alpha)+color*alpha);
    vec3 bestColorMatch=vec3(243.0/255.0);
    addToPalette(211, 68, 176);
    addToPalette(7, 179, 227);
    addToPalette(246, 85, 75);
    addToPalette(47, 200, 120);
    addToPalette(250, 112, 21);
    addToPalette(8, 180, 227);
    addToPalette(255, 200, 67);
    addToPalette(15, 51, 163);
    addToPalette(12,12,12);
    addToPalette(218, 24, 0);
    addToPalette(0, 140, 60);
    
    return mix(bestColorMatch,vec3(1.0),0.0);
}
void main () {
    vec2 proj=(coords/texelSize-0.1*texture2D(velocity, coords).xy*1.0)+vec2(0.0,-scroll)/texelSize;
    gl_FragColor = vec4(0.25*(getColorAt(coords+texelSize*vec2(0.0,0.0))+
    getColorAt(coords+texelSize*vec2(0.0,0.5))+
    getColorAt(coords+texelSize*vec2(0.5,0.0))+
    getColorAt(coords+texelSize*vec2(0.5,0.5))),1.0);
    // if(mod(proj.x,100.0)<=2.0){
    //     gl_FragColor = vec4(vec3(0.0),1.0);
    // }
    // if(mod(proj.y,100.0)<=2.0){
    //     gl_FragColor = vec4(vec3(0.0),1.0);
    // }
}