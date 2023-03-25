import DartHitInput from '@/components/input/dart-hit-input';
import {
  DartHitEvent,
  dartHitEventToPoints,
  dartHitEventToString
} from '@/lib/dart-types';
import { useRef } from 'react';

let timeoutID: NodeJS.Timeout = undefined;

export default function TestDartHitInput() {
  const dartHitP = useRef();
  const pointsP = useRef();

  function onDartHit(event: DartHitEvent) {
    // If there is a timer out there,
    // cancel it
    if (timeoutID !== undefined) {
      clearTimeout(timeoutID);
    }

    // Show the current values
    (dartHitP.current as HTMLParagraphElement).textContent =
      dartHitEventToString(event);
    (
      pointsP.current as HTMLParagraphElement
    ).textContent = `${dartHitEventToPoints(event)}`;

    // Clear current values in a second
    timeoutID = setTimeout(() => {
      (dartHitP.current as HTMLParagraphElement).textContent = '--';
      (pointsP.current as HTMLParagraphElement).textContent = '--';
    }, 1000);

    console.log(
      `onDartHit: ${dartHitEventToString(event)} (${dartHitEventToPoints(
        event
      )})`
    );
  }

  return (
    <main>
      <div
        style={{
          padding: '20px',
          maxWidth: '600px',
          margin: 'auto',
          backgroundColor: '#444'
        }}
      >
        <DartHitInput autoResetToSingle={true} onDartHit={onDartHit} />
        <div
          style={{
            display: 'flex',
            gap: '20px',
            padding: '10px',
            color: 'white'
          }}
        >
          <p>Dart Hit:</p>
          <p ref={dartHitP}>--</p>
          <p>Points:</p>
          <p ref={pointsP}>--</p>
        </div>
      </div>
    </main>
  );
}
