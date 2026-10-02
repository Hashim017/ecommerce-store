export const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-sun text-ink" },
  PAID: { label: "Paid", className: "bg-powder text-ink" },
  SHIPPED: { label: "Shipped", className: "bg-lilac text-ink" },
  DELIVERED: { label: "Delivered", className: "bg-mint text-ink" },
  CANCELLED: { label: "Cancelled", className: "bg-coral text-white" },
};

export function statusStyle(status: string) {
  return STATUS_STYLE[status] ?? STATUS_STYLE.PENDING;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}