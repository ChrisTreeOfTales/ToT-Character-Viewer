import { Feature, Trait } from '../types/character';
import { Sparkles, Zap } from 'lucide-react';

interface FeaturesListProps {
  features: Feature[];
  traits: Trait[];
}

export function FeaturesList({ features, traits }: FeaturesListProps) {
  if (features.length === 0 && traits.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 text-center text-slate-500">
        No features or traits yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Features */}
      {features.length > 0 && (
        <div className="bg-slate-800 rounded-lg divide-y divide-slate-700">
          {features.map((feature) => (
            <div key={feature.id} className="p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{feature.name}</h3>
                    {feature.isCustom && (
                      <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{feature.description}</p>
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span>Source: {feature.source}</span>
                    {feature.usesPerRest && (
                      <>
                        <span>•</span>
                        <span>
                          {feature.usesPerRest.current}/{feature.usesPerRest.max} uses (
                          {feature.usesPerRest.restType} rest)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Traits */}
      {traits.length > 0 && (
        <div className="bg-slate-800 rounded-lg divide-y divide-slate-700">
          {traits.map((trait) => (
            <div key={trait.id} className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{trait.name}</h3>
                    {trait.isCustom && (
                      <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{trait.description}</p>
                  <div className="text-xs text-slate-500">Source: {trait.source}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
