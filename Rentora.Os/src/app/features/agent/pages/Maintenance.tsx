import { 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  Paperclip, 
  Clock,
  Image as ImageIcon
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const kanbanData = {
  open: [
    { id: "T-892", title: "HVAC not cooling", desc: "AC blowing warm air since yesterday.", tenant: "Sarah Jenkins", unit: "Unit 114", priority: "high", date: "2 hrs ago", comments: 0, attachments: 0, assignee: null },
    { id: "T-893", title: "Leaky Faucet", desc: "Kitchen sink is dripping constantly.", tenant: "Marcus Johnson", unit: "Unit 101", priority: "low", date: "5 hrs ago", comments: 1, attachments: 1, assignee: null }
  ],
  inProgress: [
    { id: "T-890", title: "Dishwasher broken", desc: "Not draining water after cycle.", tenant: "David Chen", unit: "Unit 201", priority: "medium", date: "1 day ago", comments: 3, attachments: 2, assignee: "https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWludGVuYW5jZSUyMHdvcmtlciUyMGhlYWRzaG90fGVufDF8fHx8MTc4MDU2ODEyMXww&ixlib=rb-4.1.0&q=80&w=100", image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25kbyUyMGludGVyaW9yJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3ODA1NjgxMjF8MA&ixlib=rb-4.1.0&q=80&w=400" }
  ],
  waiting: [
    { id: "T-885", title: "Wall damage repair", desc: "Patching required in living room.", tenant: "Emma Wilson", unit: "Unit 202", priority: "medium", date: "3 days ago", comments: 4, attachments: 1, assignee: "https://images.unsplash.com/photo-1769636929231-3cd7f853d038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBoZWFkc2hvdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc4MDU2ODEyMXww&ixlib=rb-4.1.0&q=80&w=100" }
  ],
  resolved: [
    { id: "T-882", title: "Key card replacement", desc: "Lost main entrance key card.", tenant: "The Martinez Family", unit: "Unit 301", priority: "low", date: "1 week ago", comments: 2, attachments: 0, assignee: "https://images.unsplash.com/photo-1774897778836-3b13763e71b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzgwNTY4MTIxfDA&ixlib=rb-4.1.0&q=80&w=100" }
  ]
};

const Column = ({ title, count, items, dotColor }: { title: string, count: number, items: any[], dotColor: string }) => (
  <div className="flex-1 min-w-[320px] flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden h-full">
    <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between shrink-0">
      <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
        <span className={cn("w-2 h-2 rounded-full", dotColor)}></span>
        {title}
        <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full ml-1">{count}</span>
      </h3>
      <button className="text-zinc-500 hover:text-zinc-300">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
    
    <div className="p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
      {items.map((task) => (
        <div key={task.id} className="bg-[#18181b] border border-zinc-700/60 rounded-lg p-4 shadow-sm hover:border-zinc-600 transition-colors cursor-grab active:cursor-grabbing group">
          <div className="flex justify-between items-start mb-2">
            <span className={cn(
              "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border",
              task.priority === 'high' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : 
              task.priority === 'medium' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
              "bg-blue-500/10 text-blue-400 border-blue-500/20"
            )}>
              {task.priority}
            </span>
            <span className="text-xs text-zinc-500 font-medium">{task.id}</span>
          </div>
          
          <h4 className="text-sm font-semibold text-zinc-100 mb-1">{task.title}</h4>
          <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{task.desc}</p>
          
          {task.image && (
            <div className="w-full h-24 mb-3 rounded-md overflow-hidden border border-zinc-800 relative">
               <img src={task.image} alt="Issue evidence" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <ImageIcon className="w-5 h-5 text-white" />
               </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex -space-x-2">
               {task.assignee ? (
                 <img src={task.assignee} alt="Assignee" className="w-6 h-6 rounded-full border border-zinc-800 object-cover" />
               ) : (
                 <div className="w-6 h-6 rounded-full border border-dashed border-zinc-500 flex items-center justify-center bg-zinc-900 text-zinc-500 hover:text-indigo-400 hover:border-indigo-400 cursor-pointer transition-colors" title="Assign Technician">
                   <Plus className="w-3 h-3" />
                 </div>
               )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-zinc-500">
               {task.comments > 0 && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {task.comments}</span>}
               {task.attachments > 0 && <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" /> {task.attachments}</span>}
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-zinc-800/50 flex justify-between items-center">
            <div className="text-xs font-medium text-zinc-300">{task.unit}</div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {task.date}</div>
          </div>
        </div>
      ))}
      
      {/* Empty State / Add Button */}
      {title === "Open" && (
        <button className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all flex items-center justify-center gap-2 font-medium">
          <Plus className="w-4 h-4" /> Add Ticket
        </button>
      )}
    </div>
  </div>
);

export function Maintenance() {
  return (
    <div className="h-full flex flex-col p-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Maintenance Operations</h1>
          <p className="text-zinc-400 text-sm">Kanban workflow for issue resolution.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md p-1 mr-2">
            <button className="px-3 py-1.5 text-xs font-medium bg-zinc-800 text-white rounded shadow-sm">Board</button>
            <button className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200">List</button>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-6 h-full min-w-max pb-2">
          <Column title="Open" count={kanbanData.open.length} items={kanbanData.open} dotColor="bg-rose-500" />
          <Column title="In Progress" count={kanbanData.inProgress.length} items={kanbanData.inProgress} dotColor="bg-blue-500" />
          <Column title="Waiting on Tenant" count={kanbanData.waiting.length} items={kanbanData.waiting} dotColor="bg-orange-500" />
          <Column title="Resolved" count={kanbanData.resolved.length} items={kanbanData.resolved} dotColor="bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}
