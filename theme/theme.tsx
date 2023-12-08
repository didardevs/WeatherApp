type Theme = {
  bgWhite: (opacity: number) => string;
};

export const theme: Theme = {
  bgWhite: (opacity: number) => `rgba(255,255,255, ${opacity})`,
};
