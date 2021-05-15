export const getAnim = () => {
  const anims = [
    'zoom-in',
    'zoom-out',
    'zoom-in-up',
    'zoom-in-down',
    'flip-left',
    'flip-right',
    'flip-up',
    'flip-down',
    'fade-up',
  ];

  const rand = () => Math.floor(Math.random() * anims.length - 1);

  return anims[rand()];
};
