import {
  getKeyWords,
  joinArticleContent,
  getUrlDirectory,
  getGuardianDate,
} from "./textProcessing";
import { stopWords } from "./stopwords";

describe("testing getKeyWords", () => {
  test("null input returns empty array", () => {
    expect(getKeyWords(null, stopWords)).toStrictEqual([]);
  });

  test("single keyword input returns keyword", () => {
    const string = "bubble";
    expect(getKeyWords(string, stopWords)).toStrictEqual(["bubble"]);
  });

  test("single upppercase keyword input returns keyword in lowercase", () => {
    const string = "Bubble";
    expect(getKeyWords(string, stopWords)).toStrictEqual(["bubble"]);
  });

  test("single stopword input returns empty", () => {
    const string = "as";
    expect(getKeyWords(string, stopWords)).toStrictEqual([]);
  });

  test("single uppercase stopword input returns empty array", () => {
    const string = "I";
    expect(getKeyWords(string, stopWords)).toStrictEqual([]);
  });

  test("mixture of stopwords and keywords input returns only keywords", () => {
    const string = "A Big Bubble in the blue sky";
    expect(getKeyWords(string, stopWords)).toStrictEqual([
      "big",
      "bubble",
      "blue",
      "sky",
    ]);
  });

  test("string with whitespace and multiple spaces input does not return empty strings", () => {
    const string = `
    
           big  sentence    with gaps    
           
           `;
    expect(getKeyWords(string, stopWords)).toStrictEqual([
      "big",
      "sentence",
      "gaps",
    ]);
  });

  test("string with multiple keywords does not return duplicates", () => {
    const string = "multiple keywords keywords multiple";
    expect(getKeyWords(string, stopWords)).toStrictEqual([
      "multiple",
      "keywords",
    ]);
  });

  test("string with special characters does not return special characters unless between characters", () => {
    const string = "Just in! Jeremy's high-fi 'case' @ news - headquarters!";
    expect(getKeyWords(string, stopWords)).toStrictEqual([
      "jeremy's",
      "high-fi",
      "case",
      "news",
      "headquarters",
    ]);
  });
});

describe("testing joinArticleContent", () => {
  test("null array input returns empty string", () => {
    expect(joinArticleContent([null, null, null])).toEqual("");
  });

  test("single line with whitespace input returns single line trimmed", () => {
    expect(joinArticleContent(["   test   "])).toEqual("test");
  });

  test("multiline input returns linebreak '/n' in between lines", () => {
    expect(joinArticleContent(["line1", "line2"])).toEqual("line1/nline2");
  });

  test("multiline input with whitespace returns linebreak '/n' in between lines with no whitespace gap", () => {
    expect(
      joinArticleContent([
        "   line1: line1 text test    ",
        "   line2: line2 text test   ",
      ])
    ).toEqual("line1: line1 text test/nline2: line2 text test");
  });

  test("multiline input including null values returns string ", () => {
    expect(
      joinArticleContent([
        null,
        "   line1: line1 text test    ",
        null,
        null,
        null,
        "   line2: line2 text test   ",
        null,
      ])
    ).toEqual("line1: line1 text test/nline2: line2 text test");
  });
});

describe("testing getUrlDirectory", () => {
  test("bad url return undefined ", () => {
    expect(getUrlDirectory("", 0)).toBeUndefined();
  });

  test("index not in directory range return undefined ", () => {
    expect(getUrlDirectory("test/dir0/dir1/dir2/dir3", 4)).toBeUndefined();
  });

  test("index in range to return the dir", () => {
    expect(getUrlDirectory("test/dir0/dir1/dir2/dir3", 2)).toEqual("dir2");
  });
});

describe("testing getGuardianDate", () => {
  expect(getGuardianDate("Thu 16 Mar 2023 14.43 GMT")).not.toBeFalsy();
});
