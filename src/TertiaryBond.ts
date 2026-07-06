import type { Nucleobase } from './Nucleobase';

export interface TertiaryBond<B extends Nucleobase> {
  readonly base1: B;
  readonly base2: B;

  remove(): void;
}
