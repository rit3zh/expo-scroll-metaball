import { shaderHash } from "@/utils/shader-hash.util";

const METABALL_DRIP_COUNT: number = 7;

const mix = (from: number, to: number, amount: number): number =>
  from + (to - from) * amount;

const glslFloat = (value: number): string => value.toFixed(9);

const METABALL_DRIP_CALLS: string = Array.from(
  { length: METABALL_DRIP_COUNT },
  (_: unknown, index: number): string => {
    const seed: number = shaderHash(index, 1.7);
    const neck: number = mix(3.5, 6.5, shaderHash(index, 4.1));
    const bulb: number = neck + mix(2.5, 5.0, shaderHash(index, 8.3));
    const slot: number =
      (index + 0.5 + (seed - 0.5) * 0.7) / METABALL_DRIP_COUNT;
    const shape: string = [slot, neck, bulb, mix(0.25, 1.0, seed)]
      .map(glslFloat)
      .join(", ");
    const cycle: string = [
      shaderHash(index, 6.6) >= 0.4 ? 1 : 0,
      mix(2.6, 4.4, shaderHash(index, 11.9)),
      seed * 3.1,
      index * 1.9,
    ]
      .map(glslFloat)
      .join(", ");

    return `  acc = dripAt(acc, p, edge, left, width, amount, reach, fallDistance, t, limit, float4(${shape}), float4(${cycle}));`;
  },
).join("\n");

const METABALL_SHADER_SOURCE: string = /*glsl*/ `
uniform shader uPhoto;
uniform shader uVideo;
uniform float4 uIsland;
uniform float4 uAvatar;
uniform float4 uEffect;
uniform float2 uFade;
uniform float4 uImage;
uniform float2 uDrop;
uniform float2 uBanner;
uniform float2 uFlow;
uniform float4 uLiquify;
uniform float2 uMelt;
uniform float4 uVideoImage;

float sdBox(highp float2 p, highp float2 c, highp float2 h, float r) {
  highp float2 q = abs(p - c) - h + float2(r, r);
  return length(max(q, float2(0.0, 0.0))) + min(max(q.x, q.y), 0.0) - r;
}
float smoothUnion(highp float a, highp float b, float k) {
  float h = max(k - abs(a - b), 0.0) / max(k, 0.0001);
  return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

float sdDrop(highp float2 p, float r1, float r2, float h) {
  highp float2 q = float2(abs(p.x), p.y);
  float b = (r1 - r2) / h;
  float a = sqrt(max(1.0 - b * b, 0.0));
  float k = dot(q, float2(-b, a));
  if (k < 0.0) {
    return length(q) - r1;
  }
  if (k > a * h) {
    return length(q - float2(0.0, h)) - r2;
  }
  return dot(q, float2(a, b)) - r1;
}

float hash(highp float2 p) {
  return fract(sin(dot(p, float2(12.9898, 78.233))) * 43758.5453);
}

float2 flowAt(highp float2 p, float t) {
  highp float2 q = p;
  q.x += 0.55 * sin(q.y * 1.7 + t * 0.9);
  q.y += 0.45 * sin(q.x * 1.3 - t * 0.7);
  q.x += 0.25 * sin(q.y * 3.1 - t * 1.3 + 1.7);
  q.y += 0.2 * sin(q.x * 2.7 + t * 1.1 + 0.6);
  return q - p;
}

float meltAt(highp float2 uv, float t) {
  float x = uv.x + 0.025 * sin(uv.y * 8.0 + t * 1.2);
  float wave = 0.5 + 0.5 * sin(x * 19.0 + 2.2 * sin(x * 7.0 + t * 0.45) + t * 0.3);
  return wave * wave * wave;
}

float glossAt(highp float2 p, highp float2 c, float r) {
  float dist = length(p - c + float2(r * 0.32, r * 0.38));
  return 1.0 - smoothstep(r * 0.08, r * 0.5 + 0.01, dist);
}

float2 dripAt(highp float2 acc, highp float2 p, highp float edge, highp float left, float width, float amount, float reach, float fallDistance, float t, float limit, float4 shape, float4 cycle) {
  float neck = shape.y * amount;
  float bulb = shape.z * amount;
  highp float x = left + shape.x * width;
  if (abs(p.x - x) > bulb * 1.3 + limit) {
    return acc;
  }
  float gloss = acc.y;
  float s = fract(t / cycle.y + cycle.z);
  float form = smoothstep(0.0, 0.45, s) * cycle.x;
  float fall = max(s - 0.45, 0.0) / 0.55 * cycle.x;
  float sway = 0.9 + 0.1 * sin(t * 0.9 + cycle.w) + 0.18 * form * (1.0 - smoothstep(0.45, 0.75, s));
  float h = max(reach * amount * shape.w * sway, bulb - neck + 0.5);
  highp float root = edge - neck;
  highp float tip = root + h;
  highp float dDrip = sdDrop(p - float2(x, root), neck, bulb, h);
  float r = bulb * 0.95 * form;
  float stretch = 1.0 + 0.3 * smoothstep(0.0, 0.3, fall);
  highp float2 c = float2(x, tip + r * 0.9 + fall * fall * fallDistance);
  highp float2 bead = float2(p.x, c.y + (p.y - c.y) / stretch);
  highp float dBead = 100000.0;
  if (r > 0.5) {
    dBead = length(bead - c) - r;
    gloss = max(gloss, glossAt(bead, c, r));
  }
  gloss = max(gloss, glossAt(p, float2(x, tip), bulb));
  return float2(min(acc.x, smoothUnion(dDrip, dBead, bulb * 1.6)), gloss);
}

float2 dripsAt(highp float2 p, highp float edge, highp float left, float width, float amount, float reach, float fallDistance, float t, float limit) {
  highp float2 acc = float2(100000.0, 0.0);
${METABALL_DRIP_CALLS}
  return float2(acc.x, acc.y * amount);
}

float4 cropAt(highp float2 image, float aspect, float bias) {
  highp float2 crop = float2(image.x, image.x / aspect);
  if (image.x / image.y > aspect) {
    crop = float2(image.y * aspect, image.y);
  }
  return float4((image.x - crop.x) * 0.5, (image.y - crop.y) * bias, crop.x, crop.y);
}

float3 photoAt(highp float2 uv, float spread, highp float2 lo, highp float2 size, float spin) {
  highp float2 hi = lo + size;
  highp float2 base = lo + uv * size;
  float3 sum = float3(0.0, 0.0, 0.0);
  for (int i = 0; i < 16; i++) {
    float t = (float(i) + 0.5) / 16.0;
    float angle = float(i) * 2.39996323 + spin;
    highp float2 offset = float2(cos(angle), sin(angle)) * sqrt(t) * spread;
    sum += uPhoto.eval(clamp(base + offset, lo, hi)).rgb;
  }
  return sum / 16.0;
}
half4 main(float2 pos) {
  float aa = uEffect.w;
  float presence = uEffect.z;
  float expand = uBanner.x;
  float flow = uFlow.y;
  float radius = uAvatar.z;
  highp float top = mix(uAvatar.y - radius, 0.0, expand);
  highp float bottom = uAvatar.y + radius;
  highp float2 extent = float2(mix(radius, uBanner.y * 0.5, expand), (bottom - top) * 0.5);
  highp float2 center = float2(uAvatar.x, (top + bottom) * 0.5);
  highp float2 local = pos - center;
  highp float dIsland = sdBox(pos, uIsland.xy, uIsland.zw * presence, uIsland.w * presence) + (1.0 - presence) * 2.0;
  highp float dShape = sdBox(pos, center, extent, radius * (1.0 - expand));
  float gloss = 0.0;
  if (flow > 0.0 && pos.y > bottom - 40.0) {
    dShape -= flow * 2.5 * sin(pos.x * 0.045 + uFlow.x * 0.8) * smoothstep(bottom - 40.0, bottom, pos.y);
    float near = max(aa, uEffect.x * 0.6) + uEffect.y + aa;
    float limit = max(min(dShape, near), 0.0) + 12.0 * flow + 1.0;
    float2 drips = dripsAt(pos, bottom, center.x - extent.x, 2.0 * extent.x, flow, uLiquify.z, uLiquify.w, uFlow.x, limit);
    dShape = smoothUnion(dShape, drips.x, 12.0 * flow);
    gloss = drips.y;
  }
  highp float dAvatar = dShape;
  if (radius > 0.5 && uDrop.x > radius - uDrop.y + 0.01) {
    dAvatar = sdDrop(float2(local.x, -local.y), radius, uDrop.y, uDrop.x);
  }
  highp float d = smoothUnion(dIsland, dAvatar, uEffect.y);
  float coverage = clamp(0.5 - d / aa, 0.0, 1.0);
  if (coverage <= 0.0) {
    return half4(0.0, 0.0, 0.0, 0.0);
  }
  float height = bottom - top;
  highp float2 bannerUv = local / (2.0 * extent) + 0.5;
  float3 color = float3(0.0, 0.0, 0.0);
  if (radius > 0.5 && uAvatar.w < 1.0) {
    float feather = max(aa, uEffect.x * 0.6);
    float edge = clamp(0.5 - dShape / feather, 0.0, 1.0);
    float melt = 1.0;
    if (uImage.w > 0.0) {
      float soft = max(radius * uFade.x, uFade.y);
      float reach = bottom - uIsland.y - uIsland.w + soft;
      float front = mix(-soft, reach, uImage.w);
      melt = smoothstep(front - soft, front + soft, dIsland);
    }
    float weight = clamp(edge / coverage, 0.0, 1.0) * melt * (1.0 - uAvatar.w);
    if (weight > 0.0) {
      float aspect = extent.x / extent.y;
      highp float4 photoCrop = cropAt(uImage.xy, aspect, uImage.z);
      highp float2 lo = photoCrop.xy;
      highp float2 crop = photoCrop.zw;
      highp float2 uv = bannerUv;
      if (flow > 0.0) {
        float depth = smoothstep(uMelt.x, 1.0, bannerUv.y);
        float sides = smoothstep(0.0, 0.06, bannerUv.x) * (1.0 - smoothstep(0.94, 1.0, bannerUv.x));
        highp float2 shift = flowAt(pos / uLiquify.y, uFlow.x) * uLiquify.x * flow * depth;
        shift.x *= sides;
        uv = bannerUv + shift / (2.0 * extent);
        uv.y -= meltAt(bannerUv, uFlow.x) * depth * depth * uMelt.y * flow;
      }
      float texel = crop.y / height;
      float spread = uEffect.x * texel;
      float3 sharp = uPhoto.eval(clamp(lo + uv * crop, lo, lo + crop)).rgb;
      float3 photo = sharp;
      if (spread >= 0.25) {
        float3 blurred = photoAt(uv, spread, lo, crop, hash(pos) * 6.2831853);
        photo = mix(sharp, blurred, smoothstep(0.25, 3.0, spread));
      }
      if (uVideoImage.w > 0.0) {
        highp float4 videoCrop = cropAt(uVideoImage.xy, aspect, uVideoImage.z);
        float3 frame = uVideo.eval(clamp(videoCrop.xy + uv * videoCrop.zw, videoCrop.xy, videoCrop.xy + videoCrop.zw)).rgb;
        photo = mix(photo, frame, uVideoImage.w);
      }
      color = min(photo * weight + gloss * 0.35 * weight, float3(weight, weight, weight));
    }
  }
  return half4(color * coverage, coverage);
}
`;

const METABALL_BLEND_RANGE = [0.05, 0.8];
const METABALL_BLUR_MAX: number = 30;
const METABALL_BLUR_RANGE = [0.08, 0.5];
const METABALL_CROP_BIAS_Y: number = 0.3;
const METABALL_DARKEN_RANGE = [0.6, 0.95];
const METABALL_DROP_REACH_RANGE = [0.22, 0.4];
const METABALL_DROP_TIP_RATIO = 0.22;
const METABALL_FADE_SOFTNESS: number = 0.8;
const METABALL_FADE_SOFTNESS_MIN = 8;
const METABALL_GOO_MAX = 70;
const METABALL_GOO_MIN = 20;
const METABALL_GOO_FADE: number = 0.78;
const METABALL_GOO_RAMP = 0.3;
const METABALL_LIQUIFY_AMPLITUDE: number = 10;
const METABALL_LIQUIFY_EXPAND_RANGE: number[] = [0.55, 1];
const METABALL_LIQUIFY_MELT_PULL: number = 0.25;
const METABALL_LIQUIFY_MELT_START: number = 0.6;
const METABALL_LIQUIFY_REACH: number = 64;
const METABALL_LIQUIFY_SCALE: number = 70;
const METABALL_LIQUIFY_SPEED: number = 0.6;
const METABALL_PRESENCE_SCALES = [0, 1, 1, 0];
const METABALL_PRESENCE_STOPS = [0, 0.4, 0.9, 1.1];
const METABALL_RADIUS_END_RATIO: number = 0;
const METABALL_RADIUS_MID_RATIO: number = 0.62;
const METABALL_VIDEO_CROP_BIAS_Y: number = 0.5;
const METABALL_VIDEO_EXPAND_RANGE: number[] = [0.35, 1];
const METABALL_VIDEO_FADE_MS: number = 420;

export {
  METABALL_BLEND_RANGE,
  METABALL_BLUR_MAX,
  METABALL_BLUR_RANGE,
  METABALL_CROP_BIAS_Y,
  METABALL_DARKEN_RANGE,
  METABALL_DROP_REACH_RANGE,
  METABALL_DROP_TIP_RATIO,
  METABALL_FADE_SOFTNESS,
  METABALL_FADE_SOFTNESS_MIN,
  METABALL_GOO_FADE,
  METABALL_GOO_MAX,
  METABALL_GOO_MIN,
  METABALL_GOO_RAMP,
  METABALL_LIQUIFY_AMPLITUDE,
  METABALL_LIQUIFY_EXPAND_RANGE,
  METABALL_LIQUIFY_MELT_PULL,
  METABALL_LIQUIFY_MELT_START,
  METABALL_LIQUIFY_REACH,
  METABALL_LIQUIFY_SCALE,
  METABALL_LIQUIFY_SPEED,
  METABALL_PRESENCE_SCALES,
  METABALL_PRESENCE_STOPS,
  METABALL_RADIUS_END_RATIO,
  METABALL_RADIUS_MID_RATIO,
  METABALL_SHADER_SOURCE,
  METABALL_VIDEO_CROP_BIAS_Y,
  METABALL_VIDEO_EXPAND_RANGE,
  METABALL_VIDEO_FADE_MS,
};
