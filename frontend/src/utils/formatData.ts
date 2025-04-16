export const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };