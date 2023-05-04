const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeData(url) {
  try {
    // Fetch the HTML content from the given URL
    const response = await axios.get(url);

    // Parse the HTML content with cheerio
    const $ = cheerio.load(response.data);

    // Scrape and manipulate the data as needed
    // Example: Find all the headings with the 'h1' tag
    const headings = $('h1')
      .map((index, element) => {
        return $(element).text();
      })
      .get();

    // Return the scraped data
    return headings;
  } catch (error) {
    console.error(`Error while scraping data from ${url}:`, error);
    return null;
  }
}

// Usage example
// scrapeData('https://example.com')
//   .then((data) => console.log(data))
//   .catch((error) => console.error(error));
