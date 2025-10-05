import { InventoryItem } from '../types/character';
import { Package, Sword, Shield, Wrench, Pill } from 'lucide-react';

interface InventoryListProps {
  inventory: InventoryItem[];
}

export function InventoryList({ inventory }: InventoryListProps) {
  const getCategoryIcon = (category: InventoryItem['category']) => {
    switch (category) {
      case 'weapon':
        return <Sword className="w-4 h-4" />;
      case 'armor':
        return <Shield className="w-4 h-4" />;
      case 'tool':
        return <Wrench className="w-4 h-4" />;
      case 'consumable':
        return <Pill className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (inventory.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 text-center text-slate-500">
        No items in inventory.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg divide-y divide-slate-700">
      {inventory.map((item) => (
        <div
          key={item.id}
          className={`p-3 hover:bg-slate-700/50 transition-colors ${
            item.equipped ? 'border-l-4 border-blue-500' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 text-slate-400">
              {getCategoryIcon(item.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">
                    ×{item.quantity}
                  </span>
                )}
                {item.equipped && (
                  <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                    Equipped
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-slate-400 mt-1">{item.description}</p>
              )}
              <div className="flex gap-3 mt-1 text-xs text-slate-500">
                <span>{item.weight} lb</span>
                <span>•</span>
                <span>
                  {item.value.amount} {item.value.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
