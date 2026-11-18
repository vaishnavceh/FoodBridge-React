export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const calculateTimeRemaining = (expiryDate) => {
  const diff = new Date(expiryDate).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, percentage: 0, text: 'Expired' };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  // Based on 24 hours lifecycle
  const percentage = Math.max(0, Math.min(100, (diff / (24 * 60 * 60 * 1000)) * 100));

  return {
    hours,
    percentage,
    text: `${hours}h left`
  };
};

export const formatCoordinates = (lat, lng) => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};
