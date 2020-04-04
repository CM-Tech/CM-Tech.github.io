precision mediump float;
precision mediump sampler2D;

varying vec2 coords;
uniform vec2 ratio;
uniform sampler2D density;
uniform sampler2D image;

void main(void) {
  vec2 pos = vec2(coords.x - 0.5, 0.5 - coords.y) * ratio * 2.0 + vec2(0.5, 0.5);
  vec4 logo = texture2D(image, pos);
  float ler = logo.w;
  vec4 newColor=texture2D(density, coords)*(1.0-ler)+ logo * ler;
  gl_FragColor = newColor;
}