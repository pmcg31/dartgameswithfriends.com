import DartHitInput from '@/components/input/dart-hit-input';
import {
  DartHitEvent,
  dartHitEventToPoints,
  dartHitEventToString
} from '@/lib/dart-types';

export default function TestDartHitInput() {
  function onDartHit(event: DartHitEvent) {
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
      </div>
    </main>
  );
}
