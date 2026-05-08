export default async function handler(req, res) {
  const imageUrl = req.query.url as string;
  if (!imageUrl) return res.status(400).send("URL is required");
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.send(buffer);
  } catch (error) {
    res.status(500).send("Error fetching image");
  }
}
