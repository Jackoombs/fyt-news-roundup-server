import url from "url";

export const getKeyWords = (
  text: string | null,
  stopWords: string[]
): string[] => {
  if (text === null) {
    return [];
  }
  const cleanText = removeSpecialCharactersAndWhiteSpace(text);
  const textArray = cleanText
    .split(" ")
    .map((word) => word.toLowerCase())
    .filter((word) => !stopWords.includes(word));
  return Array.from(new Set(textArray));
};

const removeSpecialCharactersAndWhiteSpace = (string: string) => {
  return string
    .replace(/(?<=\s|^)[^\w\s]|[^\w\s](?=\s|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const joinArticleContent = (contentArray: (string | null)[]) => {
  return contentArray
    .map((paragraph) => paragraph?.trim())
    .filter(Boolean)
    .join("/n");
};

export const getUrlDirectory = (urlString: string, directoryIndex: number) => {
  const parsedUrl = url.parse(urlString);
  if (!parsedUrl.pathname) {
    return undefined;
  }
  const directories = parsedUrl.pathname.split("/").slice(1);
  const directory: string | undefined = directories[directoryIndex];
  return directory ?? undefined;
};

export const getGuardianDate = (dateString: string) => {
  const dateArray = dateString.split(" ");
  const year = dateArray[3];
  const month = dateArray[2];
  const day = dateArray[1];
  const time = dateArray[4].replace(".", ":") + ":00";

  const parsedDate = Date.parse(`${day} ${month} ${year} ${time} GMT`);
  return new Date(parsedDate);
};
