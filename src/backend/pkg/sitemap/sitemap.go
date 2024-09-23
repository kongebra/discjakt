package sitemap

import (
	"compress/gzip"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

type SitemapIndex struct {
	Sitemaps []Sitemap `xml:"sitemap"`
}

type Sitemap struct {
	Loc     string `xml:"loc"`
	Lastmod string `xml:"lastmod"`
}

type URLSet struct {
	URLs []URL `xml:"url"`
}

type URL struct {
	Loc        string `xml:"loc"`
	Lastmod    string `xml:"lastmod"`
	Changefreq string `xml:"changefreq"`
	Priority   string `xml:"priority"`
}

var httpClient = &http.Client{
	Timeout: 30 * time.Second,
}

func ParseSitemapURLS(content string) ([]URL, error) {
	// Attempt to parse as URLSet
	var urlSet URLSet
	if err := xml.Unmarshal([]byte(content), &urlSet); err == nil && len(urlSet.URLs) > 0 {
		return urlSet.URLs, nil
	}

	// Attempt to parse as SitemapIndex
	var sitemapIndex SitemapIndex
	if err := xml.Unmarshal([]byte(content), &sitemapIndex); err == nil && len(sitemapIndex.Sitemaps) > 0 {
		var (
			allURLs []URL
			mu      sync.Mutex
			wg      sync.WaitGroup
			errCh   = make(chan error, len(sitemapIndex.Sitemaps))
		)

		for _, sitemap := range sitemapIndex.Sitemaps {
			wg.Add(1)
			go func(sitemapLoc string) {
				defer wg.Done()
				sitemapContent, err := fetchSitemapContent(sitemapLoc)
				if err != nil {
					errCh <- err
					return
				}

				urls, err := ParseSitemapURLS(sitemapContent)
				if err != nil {
					errCh <- err
					return
				}

				mu.Lock()
				allURLs = append(allURLs, urls...)
				mu.Unlock()
			}(sitemap.Loc)
		}

		wg.Wait()
		close(errCh)

		if err, ok := <-errCh; ok {
			return nil, err
		}

		return allURLs, nil
	}

	return nil, fmt.Errorf("unknown sitemap format")
}

func fetchSitemapContent(url string) (string, error) {
	resp, err := httpClient.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to fetch sitemap: %w", err)
	}
	defer resp.Body.Close()

	var reader io.Reader = resp.Body
	if resp.Header.Get("Content-Encoding") == "gzip" {
		reader, err = gzip.NewReader(resp.Body)
		if err != nil {
			return "", fmt.Errorf("failed to create gzip reader: %w", err)
		}
		defer reader.(*gzip.Reader).Close()
	}

	bytes, err := io.ReadAll(reader)
	if err != nil {
		return "", fmt.Errorf("failed to read sitemap content: %w", err)
	}

	return string(bytes), nil
}
