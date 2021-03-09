export const sortByAge = (user1, user2) => {
  if (user1.age > user2.age) return 1;
  if (user1.age < user2.age) return -1;
  return 0;
};

export const sortByLocalisation = (user1, user2) => {
  if (user1.localisation > user2.localisation) return 1;
  if (user1.localisation < user2.localisation) return -1;
  return 0;
};

export const sortByTags = (user1, user2) => {
  if (user1.commonTags < user2.commonTags) return 1;
  if (user1.commonTags > user2.commonTags) return -1;
  return 0;
};

export const sortByScore = (user1, user2) => {
  if (user1.score < user2.score) return 1;
  if (user1.score > user2.score) return -1;
  return 0;
};
