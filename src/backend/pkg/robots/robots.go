package robots

import (
	"bufio"
	"fmt"
	"strconv"
	"strings"
)

type UserAgentRules struct {
	UserAgent  string   `json:"user-agent"`
	Allow      []string `json:"allow"`
	Disallow   []string `json:"disallow"`
	CrawlDelay *int     `json:"crawl-delay"`
}

type Robots struct {
	UserAgentRules map[string]*UserAgentRules `json:"user-agent-rules"`
}

var (
	userAgentPrefixes  = []string{"user-agent:"}
	allowPrefixes      = []string{"allow:"}
	disallowPrefixes   = []string{"disallow:"}
	crawlDelayPrefixes = []string{"crawl-delay:"}
)

func ParseRobotsTxt(content string) (*Robots, error) {
	result := &Robots{
		UserAgentRules: make(map[string]*UserAgentRules),
	}

	scanner := bufio.NewScanner(strings.NewReader(content))
	currentUserAgents := []string{}

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Skip empty lines and comments
		if line == "" || strings.HasPrefix(line, "#") {
			// Reset current user agents on empty line or comment
			currentUserAgents = []string{}
			continue
		}

		lineLower := strings.ToLower(line)

		if hasPrefixes(lineLower, userAgentPrefixes) {
			userAgent := extractFromLine(line, userAgentPrefixes)
			currentUserAgents = append(currentUserAgents, userAgent)

			if _, ok := result.UserAgentRules[userAgent]; !ok {
				result.UserAgentRules[userAgent] = &UserAgentRules{
					UserAgent:  userAgent,
					Allow:      []string{},
					Disallow:   []string{},
					CrawlDelay: nil,
				}
			}
			continue
		}

		// Ensure there is at least one user agent to apply the directive to
		if len(currentUserAgents) == 0 {
			// Optionally, you could skip the directive or log a warning
			continue
		}

		if hasPrefixes(lineLower, allowPrefixes) {
			allow := extractFromLine(line, allowPrefixes)
			for _, ua := range currentUserAgents {
				if agent, ok := result.UserAgentRules[ua]; ok {
					agent.Allow = append(agent.Allow, allow)
				}
			}
			continue
		}

		if hasPrefixes(lineLower, disallowPrefixes) {
			disallow := extractFromLine(line, disallowPrefixes)
			for _, ua := range currentUserAgents {
				if agent, ok := result.UserAgentRules[ua]; ok {
					agent.Disallow = append(agent.Disallow, disallow)
				}
			}
			continue
		}

		if hasPrefixes(lineLower, crawlDelayPrefixes) {
			crawlDelayStr := extractFromLine(line, crawlDelayPrefixes)
			crawlDelay, err := strconv.Atoi(crawlDelayStr)
			if err != nil {
				// Handle the error as needed
				return result, fmt.Errorf("failed to parse crawl delay '%s': %w", crawlDelayStr, err)
			}
			for _, ua := range currentUserAgents {
				if agent, ok := result.UserAgentRules[ua]; ok {
					agent.CrawlDelay = &crawlDelay
				}
			}
			continue
		}

		// Optionally, handle unknown directives
	}

	if err := scanner.Err(); err != nil {
		return result, err
	}

	return result, nil
}

func hasPrefixes(line string, prefixes []string) bool {
	for _, prefix := range prefixes {
		if strings.HasPrefix(line, prefix) {
			return true
		}
	}
	return false
}

func extractFromLine(line string, prefixes []string) string {
	lineLower := strings.ToLower(line)
	for _, prefix := range prefixes {
		if strings.HasPrefix(lineLower, prefix) {
			return strings.TrimSpace(line[len(prefix):])
		}
	}
	return ""
}
