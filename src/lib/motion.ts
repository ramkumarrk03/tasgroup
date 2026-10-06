// Motion presets. Heavy, crane-like: slow lift, firm stop. Never bouncy.

export const craneEase = [0.7, 0, 0.2, 1] as const;
export const liftEase = [0.55, 0, 0.1, 1] as const;
export const tideEase = [0.45, 0, 0.55, 1] as const;

export const lift = {
  hidden: { y: 48, opacity: 0 },
  show: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: liftEase, delay: i * 0.08 },
  }),
};

export const slam = {
  hidden: { scale: 1.8, opacity: 0, rotate: -14 },
  show: (i = 0) => ({
    scale: 1,
    opacity: 1,
    rotate: -6,
    transition: { duration: 0.32, ease: [0.9, 0, 0.6, 1] as const, delay: i * 0.14 },
  }),
};
