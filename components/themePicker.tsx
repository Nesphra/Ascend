'use client'

const radixColors = [
  "red", "crimson", "pink", "plum", "purple", "violet", "iris", "indigo", "blue", "sky",
  "cyan", "teal", "mint", "green", "grass", "lime", "yellow", "amber", "orange", "tomato",
  "brown", "bronze", "gold", "gray", "slate", "sage", "olive", "sand", "jade", "ruby"
] as const;

// type Props = {
//   setAccentColor: (color: typeof radixColors[number]) => void;
// };

const ThemePicker = () => {
  return (
    <div className="flex flex-wrap gap-1 p-4 w-[200px]">
      {radixColors.map(color => (
        <button
          key={color}
        //   onClick={() => setAccentColor(color)}
          className={`w-4 h-4 rounded-full hover:scale-110 transition-transform`}
          style={{ backgroundColor: `var(--${color}-9)` }}
          title={color}
        />
      ))}
    </div>
  );
};

export default ThemePicker;
