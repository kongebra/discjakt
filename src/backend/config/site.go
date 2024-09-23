package config

import (
	"encoding/json"
	"fmt"
	"os"
)

type SiteConfig struct {
	Name           string              `json:"name"`
	BaseURL        string              `json:"base_url"`
	Selectors      SiteConfigSelectors `json:"selectors"`
	DynamicContent bool                `json:"dynamic_content"`
}

type SiteConfigSelectors struct {
	Name        string `json:"name"`
	Price       string `json:"price"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Avability   string `json:"avability"`
}

func LoadSiteConfig(siteName string) (*SiteConfig, error) {
	siteConfigFile := fmt.Sprintf("config/sites/%s.json", siteName)
	siteConfigBytes, err := os.ReadFile(siteConfigFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read site config file %s: %w", siteConfigFile, err)
	}

	var siteConfig SiteConfig
	if err := json.Unmarshal(siteConfigBytes, &siteConfig); err != nil {
		return nil, fmt.Errorf("failed to unmarshal site config file %s: %w", siteConfigFile, err)
	}

	return &siteConfig, nil
}
