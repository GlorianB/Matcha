exports.compareUsers = (user1, user2) => {
  if (user1.ratio > user2.ratio) return 1;
  if (user1.ratio < user2.ratio) return -1;
  return 0;
};
