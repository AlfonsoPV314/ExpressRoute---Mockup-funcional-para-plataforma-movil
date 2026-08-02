interface OffScreenProps {
  onWake: () => void
}

export default function OffScreen({ onWake }: OffScreenProps) {
  return (
    <div
      className="w-full h-full relative"
      style={{ background: '#000000' }}
    >
      {/* Hidden wake button — black on black, bottom-right */}
      <button
        onClick={onWake}
        className="absolute bottom-4 right-4 w-16 h-16 rounded-full"
        style={{
          background: '#000000',
          border: 'none',
          cursor: 'default',
          opacity: 0,
        }}
        aria-label="Encender"
      />
    </div>
  )
}
