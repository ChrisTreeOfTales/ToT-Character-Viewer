import { Skill } from '../types/character';
import { Circle, Disc, Star } from 'lucide-react';

interface SkillsListProps {
  skills: Skill[];
}

export function SkillsList({ skills }: SkillsListProps) {
  const getModifierString = (bonus: number): string => {
    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  };

  if (skills.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 text-center text-slate-500">
        No skills yet. Add custom skills to get started.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg divide-y divide-slate-700">
      {skills.map((skill) => (
        <div key={skill.id} className="p-3 flex items-center gap-3 hover:bg-slate-700/50 transition-colors">
          <div className="flex-shrink-0">
            {skill.expertise ? (
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ) : skill.proficient ? (
              <Disc className="w-4 h-4 text-blue-400 fill-blue-400" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium">{skill.name}</div>
            <div className="text-xs text-slate-400">{skill.attribute.toUpperCase()}</div>
          </div>
          <div className="text-lg font-bold text-blue-400">
            {getModifierString(skill.bonus)}
          </div>
        </div>
      ))}
    </div>
  );
}
