import type { Nucleobase } from './Nucleobase';

export interface TertiaryBond {
  readonly base1: Nucleobase;
  readonly base2: Nucleobase;

  remove(): void;
}
