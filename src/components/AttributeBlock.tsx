interface AttributeBlockProps {
  name: string;
  score: number;
  modifier: string;
}

export function AttributeBlock({ name, score, modifier }: AttributeBlockProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 text-center">
      <div className="text-xs font-semibold text-slate-400 mb-2">{name}</div>
      <div className="text-3xl font-bold mb-1">{modifier}</div>
      <div className="text-sm text-slate-500">{score}</div>
    </div>
  );
}
