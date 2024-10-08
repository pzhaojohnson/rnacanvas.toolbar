export interface Nucleobase {
  getCenterPoint(): Point;
  setCenterPoint(p: Point): void;

  readonly clientCenterPoint: Point;
}

type Point = {
  x: number;
  y: number;
};
