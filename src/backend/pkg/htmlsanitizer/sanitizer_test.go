package htmlsanitizer_test

import (
	"testing"

	"github.com/kongebra/discjakt/pkg/htmlsanitizer"
)

func TestSanitizeHTML(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{
			name:  "Basic paragraph",
			input: "<p>Hello, World!</p>",
			want:  "<p>Hello, World!</p>",
		},
		{
			name:  "Script tag removal",
			input: "<p>Text</p><script>alert('XSS');</script>",
			want:  "<p>Text</p>",
		},
		{
			name:  "Style tag removal",
			input: "<style>body { background: red; }</style><p>Content</p>",
			want:  "<p>Content</p>",
		},
		{
			name:  "Inline style removal",
			input: `<p style="color: red;">Styled Text</p>`,
			want:  `<p>Styled Text</p>`,
		},
		{
			name:  "Event handler removal",
			input: `<button onclick="alert('Clicked!')">Click Me</button>`,
			want:  `Click Me`,
		},
		{
			name:  "Allowed image attributes",
			input: `<img src="image.jpg" alt="An image">`,
			want:  `<img src="image.jpg" alt="An image">`,
		},
		{
			name:  "Disallowed image attributes",
			input: `<img src="image.jpg" alt="An image" style="border: none;">`,
			want:  `<img src="image.jpg" alt="An image">`,
		},
		{
			name:  "Allowed link attributes",
			input: `<a href="https://example.com">Example</a>`,
			want:  `<a href="https://example.com">Example</a>`,
		},
		{
			name:  "Disallowed link attributes",
			input: `<a href="https://example.com" style="color: red;">Example</a>`,
			want:  `<a href="https://example.com">Example</a>`,
		},
		{
			name:  "Iframe removal",
			input: `<iframe src="https://example.com"></iframe>`,
			want:  ``,
		},
		{
			name:  "Complex nested content",
			input: `<div><p>Paragraph with <strong>bold</strong> text and an <a href="https://example.com" onclick="alert('XSS')">evil link</a>.</p></div>`,
			want:  `<div><p>Paragraph with <strong>bold</strong> text and an <a href="https://example.com">evil link</a>.</p></div>`,
		},
		{
			name:  "Comment removal",
			input: `<p>Text<!-- Comment --></p>`,
			want:  `<p>Text</p>`,
		},
		{
			name:  "Unknown element removal",
			input: `<custom-tag>Content</custom-tag>`,
			want:  `Content`,
		},
		{
			name:  "Nested disallowed elements",
			input: `<div><script>alert('XSS');</script><p>Safe Text</p></div>`,
			want:  `<div><p>Safe Text</p></div>`,
		},
		{
			name:  "Self-closing tags",
			input: `<br/><hr/><img src="image.jpg"/>`,
			want:  `<br/><hr/><img src="image.jpg"/>`,
		},
		{
			name:  "Table elements",
			input: `<table><tr><td>Cell</td></tr></table>`,
			want:  `<table><tr><td>Cell</td></tr></table>`,
		},
		{
			name:  "Disallowed table attributes",
			input: `<table border="1"><tr><td>Cell</td></tr></table>`,
			want:  `<table><tr><td>Cell</td></tr></table>`,
		},
		{
			name:  "Encoded entities",
			input: `<p>Some &lt;encoded&gt; text</p>`,
			want:  `<p>Some &lt;encoded&gt; text</p>`,
		},
		{
			name:  "Style attribute in allowed elements",
			input: `<div style="background: blue;"><p>Text</p></div>`,
			want:  `<div><p>Text</p></div>`,
		},
		{
			name:  "Multiple disallowed attributes",
			input: `<a href="https://example.com" onclick="alert('XSS')" style="color: red;">Link</a>`,
			want:  `<a href="https://example.com">Link</a>`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := htmlsanitizer.SanitizeHTML(tt.input)
			if got != tt.want {
				t.Errorf("SanitizeHTML() = %q, want %q", got, tt.want)
			}
		})
	}
}
