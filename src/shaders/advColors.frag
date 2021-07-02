#ifdef GL_ES
precision mediump float;
#endif

// Advect color field according to the texture,
// interpreted as a velocity field

// Time duration between two frame
uniform float dt;

// Velocity field, where (R -> v_x, G -> v_y, G, B).
uniform sampler2D velocity;

// Previous color field state (the previous result of this shader)
// At the initial state, set the alpha channel to 0.
uniform sampler2D prev;

uniform vec2 resolution;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  vec2 vel = texture2D(velocity, st).xy;
  // De-normalize velocity [0, 1] -> [-1, 1]
  vel = vel * 2. - 1.;

  vec2 new_st = st - vel * dt;
  // new_st = floor(new_st * resolution) / resolution;
  vec4 color = texture2D(prev, fract(new_st));

  // If the alpha is null, we are at the initial generation, so we must generate the initial texture
  if (color.a == 0.) {
    st *= 10.;
    // B&W Grid
    float x = mod(floor(st.x), 2.);
    float y = mod(floor(st.y + x), 2.);
    color = vec4(vec3(y), 1.);

    // Random noise
    // st = floor(st);
    // float r = random(st);
    // color = vec4(vec3(r), 1.);
  }

  gl_FragColor = color;
}