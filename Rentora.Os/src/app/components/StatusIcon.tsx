import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { MaintenanceTicket } from "@/app/types";

export function StatusIcon({ status }: { status: MaintenanceTicket["status"] }) {
  if (status === "resolved") return <CheckCircle2 className="w-4 h-4 text-teal-400" />;
  if (status === "in-progress") return <Clock className="w-4 h-4 text-blue-400" />;
  return <AlertCircle className="w-4 h-4 text-purple-400" />;
}
