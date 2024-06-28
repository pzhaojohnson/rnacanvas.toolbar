import * as styles from './GrabHatch.css';

function Line() {
  let line = document.createElement('div');

  line.classList.add(styles.line);

  return line;
}

export function GrabHatch() {
  let grabHatch = document.createElement('div');

  grabHatch.classList.add(styles.grabHatch);

  grabHatch.append(
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
  );

  return grabHatch;
}
