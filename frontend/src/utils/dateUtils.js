
export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const expiry = new Date(expiryDate);
  const expiryOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  return Math.ceil((expiryOnly - today) / (1000 * 60 * 60 * 24));
};


export const getExpiresInText = (expiryDate) => {
  const days = getDaysUntilExpiry(expiryDate);
  if (days === null) return "";

  if (days < 0) {
    const absDays = Math.abs(days);
    return absDays === 1 ? "Expired yesterday" : `Expired ${absDays} days ago`;
  }
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days} days`;
};


export const getWarrantyProgress = (purchaseDate, expiryDate) => {
  if (!purchaseDate || !expiryDate) return 0;
  const start = new Date(purchaseDate).getTime();
  const end = new Date(expiryDate).getTime();
  const now = Date.now();

  if (now >= end) return 100;
  if (now <= start) return 0;

  return Math.round(((now - start) / (end - start)) * 100);
};


export const toInputDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};
