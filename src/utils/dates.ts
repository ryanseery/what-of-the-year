export function currentYear() {
  const year = new Date().getFullYear();
  const startDate = new Date(year, 0, 1).getTime() / 1000;
  const endDate = new Date(year, 11, 31).getTime() / 1000;

  return {
    year,
    startDate,
    endDate,
  };
}
