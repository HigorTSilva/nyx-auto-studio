export interface SliceProgress {
  index: number;
  localProgress: number;
}

export function getSliceProgress(progress: number, sliceCount: number): SliceProgress {
  if (sliceCount <= 0) return { index: 0, localProgress: 0 };

  const clamped = Math.min(Math.max(progress, 0), 1);
  const sliceSize = 1 / sliceCount;
  const index = Math.min(Math.floor(clamped / sliceSize), sliceCount - 1);
  const localProgress = Math.min(Math.max((clamped - index * sliceSize) / sliceSize, 0), 1);

  return { index, localProgress };
}
