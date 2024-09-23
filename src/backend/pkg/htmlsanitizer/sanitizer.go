package htmlsanitizer

import (
	"github.com/microcosm-cc/bluemonday"
)

// defaultPolicy is the default sanitization policy used for cleaning HTML content.
// It is initialized once and used throughout the application.
var defaultPolicy *bluemonday.Policy

func init() {
	defaultPolicy = bluemonday.NewPolicy()
	setupDefaultPolicy(defaultPolicy)
}

// setupDefaultPolicy configures the provided policy with allowed elements and attributes.
func setupDefaultPolicy(p *bluemonday.Policy) {
	// Allow basic structural elements
	p.AllowElements("html", "head", "body", "main", "header", "footer", "section", "article", "nav", "div", "span")

	// Allow text formatting elements
	p.AllowElements("p", "br", "hr", "blockquote", "pre", "code", "em", "strong", "b", "i", "u", "small", "sub", "sup", "mark")

	// Allow lists
	p.AllowElements("ul", "ol", "li", "dl", "dt", "dd")

	// Allow tables
	p.AllowElements("table", "thead", "tbody", "tfoot", "tr", "th", "td")

	// Allow links and images with specific attributes
	p.AllowElements("a", "img")
	p.AllowAttrs("href").OnElements("a")
	p.AllowAttrs("src", "alt", "width", "height").OnElements("img")

	// Disallow inline styles and event handlers by not allowing 'style' and 'on*' attributes
	// Event handler attributes are disallowed by default in bluemonday
}

// SanitizeHTML cleans the provided HTML content using the default policy.
func SanitizeHTML(content string) string {
	return defaultPolicy.Sanitize(content)
}
