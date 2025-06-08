export class BlogFunctions {
  estimateReadTime(htmlContent) {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Remove non-text content like <pre>, <code>, and any script/style tags
    const tagsToRemove = tempDiv.querySelectorAll("pre, code, script, style");
    tagsToRemove.forEach((tag) => tag.remove());

    // Extract readable text
    const text = tempDiv.textContent || "";

    // Clean and count words
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Reading speed (words per minute)
    const wordsPerMinute = 200;

    // Estimate time in minutes (at least 1)
    const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    console.log("Minutes: ", minutes);
    return minutes;
  }

  blogPreview(htmlContent, maxWords = 60) {
    // 1. Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // 2. Remove non-textual/preview-unfriendly elements
    const tagsToRemove = [
      "img",
      "table",
      "pre",
      "code",
      "iframe",
      "style",
      "script",
    ];
    tagsToRemove.forEach((tag) => {
      doc.querySelectorAll(tag).forEach((el) => el.remove());
    });

    // 3. Get all textual content
    const fullText = doc.body.textContent || "";

    // 4. Clean and trim the text
    const cleaned = fullText
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // 5. Return a truncated preview (default: 40 words)
    const words = cleaned.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ")
      : cleaned;
  }
}
const blogFn = new BlogFunctions();
export default blogFn;
