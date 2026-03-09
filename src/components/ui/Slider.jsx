import * as RadixSlider from "@radix-ui/react-slider";

export default function Slider({ label, value, onChange, min, max, step, format, accentColor = "#7b68ee" }) {
  const display = format ? format(value) : value;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] font-mono uppercase tracking-widest text-dim">{label}</span>
        <span className="text-[12px] font-mono font-medium text-text">{display}</span>
      </div>
      <RadixSlider.Root
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min} max={max} step={step}
        className="relative flex items-center select-none touch-none w-full h-5"
      >
        <RadixSlider.Track className="slider-track">
          <RadixSlider.Range
            className="slider-range"
            style={{ background: `linear-gradient(90deg, ${accentColor}88, ${accentColor})` }}
          />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="slider-thumb"
          style={{ background: accentColor, borderColor: accentColor }}
        />
      </RadixSlider.Root>
    </div>
  );
}