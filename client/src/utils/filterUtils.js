export const filterByAge = (array, min, max) => {
  return array.filter((user) => user.age >= min && user.age <= max);
};

export const filterByLocalisation = (array, min, max) => {
  if (min === 0 && max === 0)
    return array;
  return array.filter((user) => user.localisation >= min && user.localisation <= max);
};

export const filterByTags = (array, min, max) => {
  if (min === 0 && max === 0)
    return array;
  return array.filter((user) => user.commonTags >= min && user.commonTags <= max);
};

export const filterByScore = (array, min, max) => {
  if (min === 0 && max === 0)
    return array;
  return array.filter((user) => user.score >= min && user.score <= max);
};
