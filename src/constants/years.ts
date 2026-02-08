export type Year = {
  key: number;
  label: string;
};

const currentYear = new Date().getFullYear();
const startYear = 1987;

export const years: Year[] = Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
  const year = currentYear - i;
  return {
    key: year,
    label: year.toString(),
  };
});
