package sitemap_test

import (
	"compress/gzip"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/kongebra/discjakt/pkg/sitemap"
)

func TestParseSitemapURLS(t *testing.T) {
	// Create test servers for the sitemaps

	// Map to store sitemap content keyed by path
	sitemapContents := map[string]string{
		"/sitemap1.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://example.com/page1</loc>
  </url>
  <url>
    <loc>http://example.com/page2</loc>
  </url>
</urlset>`,

		"/sitemap2.xml.gz": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://example.com/page3</loc>
  </url>
  <url>
    <loc>http://example.com/page4</loc>
  </url>
</urlset>`,
	}

	// Create a test server
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if content, ok := sitemapContents[path]; ok {
			if strings.HasSuffix(path, ".gz") {
				// Compress the content using gzip
				w.Header().Set("Content-Encoding", "gzip")
				gzipWriter := gzip.NewWriter(w)
				defer gzipWriter.Close()
				_, err := gzipWriter.Write([]byte(content))
				if err != nil {
					t.Fatalf("Failed to write gzipped content: %v", err)
				}
			} else {
				w.Header().Set("Content-Type", "application/xml")
				_, err := w.Write([]byte(content))
				if err != nil {
					t.Fatalf("Failed to write sitemap content: %v", err)
				}
			}
		} else {
			http.NotFound(w, r)
		}
	}))
	defer ts.Close()

	// Update the sitemap index content to use the test server URLs
	sitemapIndexContent := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>%s/sitemap1.xml</loc>
    <lastmod>2023-10-01</lastmod>
  </sitemap>
  <sitemap>
    <loc>%s/sitemap2.xml.gz</loc>
    <lastmod>2023-09-25</lastmod>
  </sitemap>
</sitemapindex>`, ts.URL, ts.URL)

	// Now we can test the ParseSitemapURLS function

	// First, test parsing a simple sitemap content directly
	simpleSitemapContent := `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://example.com/home</loc>
  </url>
  <url>
    <loc>http://example.com/about</loc>
  </url>
</urlset>`

	urls, err := sitemap.ParseSitemapURLS(simpleSitemapContent)
	if err != nil {
		t.Fatalf("Error parsing simple sitemap: %v", err)
	}

	if len(urls) != 2 {
		t.Errorf("Expected 2 URLs, got %d", len(urls))
	}

	// Now, test parsing the sitemap index
	urls, err = sitemap.ParseSitemapURLS(sitemapIndexContent)
	if err != nil {
		t.Fatalf("Error parsing sitemap index: %v", err)
	}

	if len(urls) != 4 {
		t.Errorf("Expected 4 URLs, got %d", len(urls))
	}

	// Check that the URLs match the expected ones
	expectedURLs := map[string]bool{
		"http://example.com/page1": true,
		"http://example.com/page2": true,
		"http://example.com/page3": true,
		"http://example.com/page4": true,
	}

	for _, url := range urls {
		if !expectedURLs[url.Loc] {
			t.Errorf("Unexpected URL: %s", url.Loc)
		}
		delete(expectedURLs, url.Loc)
	}

	if len(expectedURLs) != 0 {
		t.Errorf("Some expected URLs were not found: %v", expectedURLs)
	}
}
