export function getAnim(anim = "") {
  return process.env.NODE_ENV === "development" ? "" : anim;
}

getAnim();
