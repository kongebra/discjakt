package robots_test

import (
	"testing"

	"github.com/kongebra/discjakt/pkg/robots"
)

func TestParseRobotsTxt(t *testing.T) {
	content := `User-agent: *
Allow: /
Disallow: /kontrollpanel
Disallow: /search
Disallow: /search_result
Disallow: /search_result?*
Disallow: /cookie_usage
Disallow: /htmlpackingmanifest.php
Disallow: /htmlpackingmanifest.php?*
Disallow: /htmlpackingslip_new.php
Disallow: /htmlpackingslip_new.php?*
Disallow: /htmlpackingslip.php
Disallow: /htmlpackingslip.php?*
Disallow: /htmlpackingslip_meters.php
Disallow: /htmlpackingslip_meters.php?*
Disallow: /order_confirmation.php
Disallow: /order_confirmation.php?*
Disallow: /pdfinvoice.php
Disallow: /pdfinvoice.php?*
Disallow: /pdf_kredittnota.php
Disallow: /pdf_kredittnota.php?*
Disallow: /pdf_angreskjema.php
Disallow: /pdf_angreskjema.php?*
Disallow: /htmlreturnsform.php
Disallow: /htmlreturnsform.php?*
Disallow: /htmlinvoice_new.php
Disallow: /htmlinvoice_new.php?*
Disallow: /htmlgiftcard.php
Disallow: /htmlgiftcard.php?*
Crawl-delay: 5

User-agent: msnbot
Crawl-delay: 3

User-Agent: Googlebot
Allow: /

User-Agent: Googlebot-image
Allow: /

User-agent: SemrushBot
Crawl-delay: 5`

	robots, err := robots.ParseRobotsTxt(content)
	if err != nil {
		t.Error(err)
	}

	expectedUserAgents := []string{"*", "msnbot", "Googlebot", "Googlebot-image", "SemrushBot"}
	if len(robots.UserAgentRules) != len(expectedUserAgents) {
		t.Errorf("Expected %d UserAgentRules, got %d", len(expectedUserAgents), len(robots.UserAgentRules))
	}

	// Check for each user agent
	for _, ua := range expectedUserAgents {
		if _, exists := robots.UserAgentRules[ua]; !exists {
			t.Errorf("UserAgentRules missing expected user agent: %s", ua)
		}
	}

	// Continue with specific checks
	if len(robots.UserAgentRules["*"].Allow) != 1 {
		t.Errorf("Expected 1 Allow for '*', got %d", len(robots.UserAgentRules["*"].Allow))
	}

	expectedDisallowCount := 27 // Adjusted based on actual content
	if len(robots.UserAgentRules["*"].Disallow) != expectedDisallowCount {
		t.Errorf("Expected %d Disallow for '*', got %d", expectedDisallowCount, len(robots.UserAgentRules["*"].Disallow))
	}

	if robots.UserAgentRules["*"].CrawlDelay == nil || *robots.UserAgentRules["*"].CrawlDelay != 5 {
		t.Errorf("Expected CrawlDelay for '*' to be 5, got %v", robots.UserAgentRules["*"].CrawlDelay)
	}

	if len(robots.UserAgentRules["msnbot"].Allow) != 0 {
		t.Errorf("Expected 0 Allow for 'msnbot', got %d", len(robots.UserAgentRules["msnbot"].Allow))
	}

	if len(robots.UserAgentRules["msnbot"].Disallow) != 0 {
		t.Errorf("Expected 0 Disallow for 'msnbot', got %d", len(robots.UserAgentRules["msnbot"].Disallow))
	}

	if robots.UserAgentRules["msnbot"].CrawlDelay == nil || *robots.UserAgentRules["msnbot"].CrawlDelay != 3 {
		t.Errorf("Expected CrawlDelay for 'msnbot' to be 3, got %v", robots.UserAgentRules["msnbot"].CrawlDelay)
	}

	// Similarly for other user agents
	if len(robots.UserAgentRules["Googlebot"].Allow) != 1 {
		t.Errorf("Expected 1 Allow for 'Googlebot', got %d", len(robots.UserAgentRules["Googlebot"].Allow))
	}

	if len(robots.UserAgentRules["Googlebot"].Disallow) != 0 {
		t.Errorf("Expected 0 Disallow for 'Googlebot', got %d", len(robots.UserAgentRules["Googlebot"].Disallow))
	}

	if robots.UserAgentRules["Googlebot"].CrawlDelay != nil {
		t.Errorf("Expected CrawlDelay for 'Googlebot' to be nil, got %v", robots.UserAgentRules["Googlebot"].CrawlDelay)
	}

	// And so on for 'Googlebot-image' and 'SemrushBot'
}
