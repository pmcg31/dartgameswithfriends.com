export enum DartHitKind {
  Hit,
  BounceOut,
  Miss
}

export enum DartHitMultiplier {
  X1 = 1,
  X2,
  X3
}

export enum DartHitScoreArea {
  N1 = 1,
  N2,
  N3,
  N4,
  N5,
  N6,
  N7,
  N8,
  N9,
  N10,
  N11,
  N12,
  N13,
  N14,
  N15,
  N16,
  N17,
  N18,
  N19,
  N20,
  Bull
}

export type DartHitEvent = {
  kind: DartHitKind;
  multiplier?: DartHitMultiplier;
  scoreArea?: DartHitScoreArea;
};

export function multiplierToString(multiplier: DartHitMultiplier): string {
  switch (multiplier) {
    case DartHitMultiplier.X3:
      return 'X3';
    case DartHitMultiplier.X2:
      return 'X2';
    case DartHitMultiplier.X1:
    default:
      return 'X1';
  }
}

export function multiplierFromString(s: string): DartHitMultiplier {
  if (s === 'X3') {
    return DartHitMultiplier.X3;
  } else if (s === 'X2') {
    return DartHitMultiplier.X2;
  } else if (s === 'X1') {
    return DartHitMultiplier.X1;
  } else {
    console.log(
      `multiplerFromString: unknown multiplier string "${s}": returning default X1`
    );
    return DartHitMultiplier.X1;
  }
}

export function scoreAreaFromString(s: string): DartHitScoreArea {
  if (s.startsWith('N')) {
    const s2 = s.substring(1);

    if (s2 === 'B') {
      return DartHitScoreArea.Bull;
    } else {
      for (let i = 1; i <= 20; i++) {
        if (DartHitScoreArea[i] === s) {
          return i as DartHitScoreArea;
        }
      }
    }
  }

  return undefined;
}

export function dartHitEventToString(event: DartHitEvent): string {
  if (event.kind === DartHitKind.Miss || event.kind === DartHitKind.BounceOut) {
    return DartHitKind[event.kind];
  } else {
    let multStr = '';
    if (event.multiplier === DartHitMultiplier.X2) {
      multStr = 'D';
    } else if (event.multiplier === DartHitMultiplier.X3) {
      multStr = 'T';
    }
    let area = '';
    if (event.scoreArea <= 20) {
      area = `${multStr}${event.scoreArea}`;
    } else {
      if (event.multiplier !== DartHitMultiplier.X1) {
        area = `${multStr} Bull`;
      } else {
        area = 'Bull';
      }
    }
    return area;
  }
}

export function dartHitEventToPoints(event: DartHitEvent): number {
  if (event.kind === DartHitKind.Miss || event.kind === DartHitKind.BounceOut) {
    return 0;
  } else {
    if (event.scoreArea <= 20) {
      return event.multiplier * event.scoreArea;
    } else {
      return event.multiplier * 25;
    }
  }
}
