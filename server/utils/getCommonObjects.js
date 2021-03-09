exports.getCommonObjects = (array1, array2) => {
  let result = 0;
  for (const elem1 of array1)
    for (const elem2 of array2)
      if (JSON.stringify(elem1) === JSON.stringify(elem2))
        result++;
  return (result);
};
