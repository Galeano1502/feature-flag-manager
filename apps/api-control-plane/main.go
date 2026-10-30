package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type RuleCondition struct {
	Attribute string   `json:"attribute"`
	Operator  string   `json:"operator"`
	Values    []string `json:"values"`
}

type FlagRule struct {
	ID         string          `json:"id"`
	Percentage *int            `json:"percentage,omitempty"`
	Conditions []RuleCondition `json:"conditions,omitempty"`
	Value      interface{}     `json:"value"`
}

type FeatureFlag struct {
	Key          string      `json:"key"`
	Enabled      bool        `json:"enabled"`
	DefaultValue interface{} `json:"defaultValue"`
	Rules        []FlagRule  `json:"rules,omitempty"`
}

var (
	rdb         *redis.Client
	flagsMemory = make(map[string]FeatureFlag)
	ctx         = context.Background()
)

func main() {
	rdb = redis.NewClient(&redis.Options{
		Addr: "localhost:6380", // Alterado para 6380
	})

	router := gin.Default()

	router.GET("/api/v1/flags", getFlags)
	router.POST("/api/v1/flags", createOrUpdateFlag)

	log.Println("API Control Plane rodando na porta 8081...")
	router.Run(":8081") // Alterado para 8081
}

func getFlags(c *gin.Context) {
	var list []FeatureFlag
	for _, flag := range flagsMemory {
		list = append(list, flag)
	}
	c.JSON(http.StatusOK, list)
}

func createOrUpdateFlag(c *gin.Context) {
	var flag FeatureFlag
	if err := c.ShouldBindJSON(&flag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	flagsMemory[flag.Key] = flag

	event := map[string]interface{}{
		"type": "FLAG_UPDATED",
		"flag": flag,
	}
	payload, _ := json.Marshal(event)
	rdb.Publish(ctx, "flag_updates", payload)

	c.JSON(http.StatusOK, flag)
}