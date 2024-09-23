package main

import "github.com/gin-gonic/gin"

func main() {
  engine := gin.Default()

  api := engine.Group("/api")
  {
	api.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
  }

  v1 := api.Group("/v1")
  {
	v1.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"version": "v1",
		})
	})
  }

  if err := engine.Run(); err != nil {
	panic(err)
  }
}