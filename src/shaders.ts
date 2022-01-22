import { regl } from "./canvas";
import { TEXTURE_DOWNSAMPLE } from "./config";
import { velocity, density, pressure, divergenceTex } from "./fbos";
import projectShader from "./shaders/project.vert";
import splatShader from "./shaders/splat.frag";
import logoShader from "./shaders/logo.frag";
import advectShader from "./shaders/advect.frag";
import advectColorShader from "./shaders/advectColor.frag";
import divergenceShader from "./shaders/divergence.frag";
import clearShader from "./shaders/clear.frag";
import gradientSubtractShader from "./shaders/gradientSubtract.frag";
import jacobiShader from "./shaders/jacobi.frag";
import displayShader from "./shaders/display.frag";
import scrollShader from "./shaders/scroll.frag";
import type REGL from "regl";

import imgURL from "../img/cm-logo-s.png";

const texelSize = ({ viewportWidth, viewportHeight }: REGL.DefaultContext) => [1 / viewportWidth, 1 / viewportHeight];
const viewport = ({ viewportWidth, viewportHeight }: REGL.DefaultContext) => ({
  x: 0,
  y: 0,
  width: viewportWidth >> TEXTURE_DOWNSAMPLE,
  height: viewportHeight >> TEXTURE_DOWNSAMPLE,
});

export const fullscreen = regl({
  vert: projectShader,
  attributes: {
    points: [1, 1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1],
  },
  count: 6,
});

interface SplatProps {
  framebuffer: REGL.Framebuffer2D;
  uTarget: REGL.Framebuffer2D;
  point: number[];
  color: number;
  radius: number;
}
const splat = regl({
  frag: splatShader,
  framebuffer: regl.prop<SplatProps, "framebuffer">("framebuffer"),
  uniforms: {
    uTarget: regl.prop<SplatProps, "uTarget">("uTarget"),
    aspectRatio: ({ viewportWidth, viewportHeight }) => viewportWidth / viewportHeight,
    point: regl.prop<SplatProps, "point">("point"),
    color: regl.prop<SplatProps, "color">("color"),
    radius: regl.prop<SplatProps, "radius">("radius"),
  },
  viewport,
});

interface ScrollProps {
  framebuffer: REGL.Framebuffer2D;
  x: REGL.Framebuffer2D;
  scroll: number;
  dissipation: number;
}
const scrollk = regl({
  frag: scrollShader,
  framebuffer: regl.prop<ScrollProps, "framebuffer">("framebuffer"),
  uniforms: {
    image: regl.prop<ScrollProps, "x">("x"),
    ratio: ({ viewportWidth, viewportHeight }) => {
      return [1, 1]; // viewportWidth > viewportHeight ? [viewportWidth / viewportHeight, 1.0] : [1.0, viewportHeight / viewportWidth];
    },
    scroll: regl.prop<ScrollProps, "scroll">("scroll"),
    dissipation: regl.prop<ScrollProps, "dissipation">("dissipation"),
  },
  viewport,
});

const img = new Image();
img.src = imgURL;
let logo_tex = regl.texture({
  width: window.innerWidth,
  height: window.innerHeight,
  min: "linear",
  mag: "linear",
  type: "half float",
});
let page_tex = regl.texture({
  width: window.innerWidth,
  height: window.innerHeight,
  min: "nearest",
  mag: "nearest",
  type: "half float",
});
img.onload = () => {
  logo_tex = regl.texture(img);
};
var lastScrollY = window.scrollY + 0.0;

interface AdvectProps {
  framebuffer: REGL.Framebuffer2D;
  color: number[];
  dissipation: number;
  x: REGL.Framebuffer2D;
}
const advect = regl({
  frag: advectShader,
  framebuffer: regl.prop<AdvectProps, "framebuffer">("framebuffer"),
  uniforms: {
    timestep: 0.017,
    dissipation: regl.prop<AdvectProps, "dissipation">("dissipation"),
    color: regl.prop<AdvectProps, "color">("color"),
    x: regl.prop<AdvectProps, "x">("x"),
    velocity: () => velocity.read,
    texelSize,
  },
  viewport,
});
const advectColor = regl({
  frag: advectColorShader,
  framebuffer: regl.prop<AdvectProps, "framebuffer">("framebuffer"),
  uniforms: {
    timestep: 0.017,
    dissipation: regl.prop<AdvectProps, "dissipation">("dissipation"),
    color: regl.prop<AdvectProps, "color">("color"),
    x: regl.prop<AdvectProps, "x">("x"),
    velocity: () => velocity.read,
    texelSize,
  },
  viewport,
});
const divergence = regl({
  frag: divergenceShader,
  framebuffer: divergenceTex,
  uniforms: {
    velocity: () => velocity.read,
    texelSize,
  },
  viewport,
});
interface ClearProps {
  dissipation: number;
}
const clear = regl({
  frag: clearShader,
  framebuffer: () => pressure.write,
  uniforms: {
    pressure: () => pressure.read,
    dissipation: regl.prop<ClearProps, "dissipation">("dissipation"),
  },
  viewport,
});
const gradientSubtract = regl({
  frag: gradientSubtractShader,
  framebuffer: () => velocity.write,
  uniforms: {
    pressure: () => pressure.read,
    velocity: () => velocity.read,
    texelSize,
  },
  viewport,
});
const jacobi = regl({
  frag: jacobiShader,
  framebuffer: () => pressure.write,
  uniforms: {
    pressure: () => pressure.read,
    divergence: () => divergenceTex,
    texelSize,
  },
  viewport,
});

export const getBreakpoint = (id: string) => {
  let element = document.getElementById(id);
  return element ? (element.getBoundingClientRect().top + window.scrollY) / window.innerHeight : 1;
};

export const display = regl({
  frag: displayShader,
  uniforms: {
    density: () => density.read,
    velocity: () => velocity.read,
    scroll: () => window.scrollY / window.innerHeight,
    page: () => page_tex,
    logo: () => logo_tex,
    breakpoint1: () => getBreakpoint("breakpoint1"),
    breakpoint2: () => getBreakpoint("breakpoint2"),
    breakpoint3: () => getBreakpoint("breakpoint3"),
    time: ({ time }) => time,
    texelSize,
  },
});

export function createSplat(x: number, y: number, dx: number, dy: number, color: number[], radius: number) {
  splat({
    framebuffer: velocity.write,
    uTarget: velocity.read,
    point: [x / window.innerWidth, 1 - y / window.innerHeight],
    radius,
    color: [dx, -dy, 1],
  });
  velocity.swap();

  splat({
    framebuffer: density.write,
    uTarget: density.read,
    point: [x / window.innerWidth, 1 - y / window.innerHeight],
    radius,
    color,
  });
  density.swap();
}

export const update = (config: {
  VELOCITY_DISSIPATION: number;
  DENSITY_DISSIPATION: number;
  PRESSURE_ITERATIONS: number;
  PRESSURE_DISSIPATION: number;
}) => {
  scrollk({
    framebuffer: velocity.write,
    x: velocity.read,
    dissipation: 0,
    color: [0, 0, 0, 0],
    scroll: -(window.scrollY - lastScrollY) / window.innerHeight,
  });
  velocity.swap();

  scrollk({
    framebuffer: density.write,
    x: density.read,
    dissipation: 0,
    color: [243 / 255, 243 / 255, 243 / 255, 0],
    scroll: -(window.scrollY - lastScrollY) / window.innerHeight,
  });
  density.swap();

  lastScrollY = window.scrollY;

  divergence();

  clear({
    dissipation: config.PRESSURE_DISSIPATION,
  });
  pressure.swap();

  for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
    jacobi();
    pressure.swap();
  }

  gradientSubtract();
  velocity.swap();

  advect({
    framebuffer: velocity.write,
    x: velocity.read,
    dissipation: config.VELOCITY_DISSIPATION,
    color: [0, 0, 0, 0],
  });
  velocity.swap();

  advectColor({
    framebuffer: density.write,
    x: density.read,
    dissipation: config.DENSITY_DISSIPATION,
    color: [243 / 255, 243 / 255, 243 / 255, 0],
  });
  density.swap();
};
