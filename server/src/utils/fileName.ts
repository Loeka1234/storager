export const incrementFileName = (fileName: string) => {
  if (fileName.replace("(", "").includes("("))
    throw new Error("fileName contains 2 or more times '('");

  if (fileName.replace(")", "").includes(")"))
    throw new Error("fileName contains 2 or more times ')'");

  const firstPart = fileName.substr(0, fileName.indexOf("(") + 1);
  const lastPart = fileName.substr(fileName.indexOf(")"));
  let nr = parseInt(fileName.replace(firstPart, "").replace(lastPart, ""));

  if (isNaN(nr)) throw new Error("error while getting number from filename");

  return firstPart + ++nr + lastPart;
};
