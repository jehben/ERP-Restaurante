import {
  Inbox,
  FileText,
  CreditCard,
  FolderOpen,
  Package,
  BarChart2,
  ChefHat,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const menuItems = [
  { icon: Inbox, label: 'Caixa de Entrada' },
  { icon: FileText, label: 'Notas Fiscais' },
  { icon: CreditCard, label: 'Contas a Pagar' },
  { icon: FolderOpen, label: 'Doc. Financeiro' },
  { icon: Package, label: 'Insumos & Estoque' },
  { icon: ChefHat, label: 'Receitas & Ficha Técnica' },
  { icon: BarChart2, label: 'Relatórios' },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-brand-beige h-full flex flex-col py-8 px-4 border-r border-black/5 shrink-0">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold text-xl shadow-orange">
          F
        </div>
        <div>
          <h1 className="font-bold text-brand-dark leading-tight">Financeiro</h1>
          <h1 className="font-bold text-brand-dark leading-tight">Burger</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
           <Image src="https://picsum.photos/seed/avatar/100/100" alt="Avatar" fill referrerPolicy="no-referrer" />
        </div>
        <div>
          <p className="font-semibold text-brand-dark text-sm">João Silva</p>
          <p className="text-brand-light text-xs">joao@burger.com</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all w-full text-left',
                isActive
                  ? 'bg-brand-orange text-white pill shadow-orange'
                  : 'text-brand-dark hover:bg-black/5 pill'
              )}
            >
              <item.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-brand-light')} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
