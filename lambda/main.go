package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
)

type OrderItem struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Quantity int     `json:"quantity"`
}

type Order struct {
	Items     []OrderItem `json:"items"`
	Total     float64     `json:"total"`
	Timestamp string      `json:"timestamp"`
}

type OrderRecord struct {
	PK        string      `dynamodbav:"PK"`        // student_id
	SK        string      `dynamodbav:"SK"`        // ORDER#<uuid>
	OrderID   string      `dynamodbav:"order_id"`
	Items     []OrderItem `dynamodbav:"items"`
	Total     float64     `dynamodbav:"total"`
	Timestamp string      `dynamodbav:"timestamp"`
	CreatedAt string      `dynamodbav:"created_at"`
}

var (
	dynamoClient *dynamodb.Client
	tableName    string
	studentID    string
)

func init() {
	tableName = os.Getenv("TABLE_NAME")
	if tableName == "" {
		log.Fatal("TABLE_NAME environment variable is required")
	}

	studentID = os.Getenv("STUDENT_ID")
	if studentID == "" {
		log.Fatal("STUDENT_ID environment variable is required")
	}

	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("unable to load SDK config: %v", err)
	}

	dynamoClient = dynamodb.NewFromConfig(cfg)
}

func handler(ctx context.Context, request events.LambdaFunctionURLRequest) (events.LambdaFunctionURLResponse, error) {
	log.Printf("Received request: Method=%s, Body=%s", request.RequestContext.HTTP.Method, request.Body)

	// Parse the order from request body
	var order Order
	if err := json.Unmarshal([]byte(request.Body), &order); err != nil {
		log.Printf("Failed to parse request body: %v", err)
		return events.LambdaFunctionURLResponse{
			StatusCode: 400,
			Body:       fmt.Sprintf(`{"error": "Invalid request body: %v"}`, err),
		}, nil
	}

	// Generate order ID
	orderID := uuid.New().String()

	// Create DynamoDB record
	record := OrderRecord{
		PK:        studentID,
		SK:        fmt.Sprintf("ORDER#%s", orderID),
		OrderID:   orderID,
		Items:     order.Items,
		Total:     order.Total,
		Timestamp: order.Timestamp,
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	// Marshal the record
	item, err := attributevalue.MarshalMap(record)
	if err != nil {
		log.Printf("Failed to marshal record: %v", err)
		return events.LambdaFunctionURLResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Failed to process order: %v"}`, err),
		}, nil
	}

	// Put item to DynamoDB
	_, err = dynamoClient.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      item,
	})
	if err != nil {
		log.Printf("Failed to put item to DynamoDB: %v", err)
		return events.LambdaFunctionURLResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error": "Failed to save order: %v"}`, err),
		}, nil
	}

	log.Printf("Order %s saved successfully for student %s", orderID, studentID)

	// Return success response
	// NOTE: Intentionally NO CORS headers - this is part of the chaos engineering exercise
	response := map[string]interface{}{
		"success":  true,
		"order_id": orderID,
		"message":  "Order received and stored",
	}

	responseBody, _ := json.Marshal(response)

	return events.LambdaFunctionURLResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: string(responseBody),
	}, nil
}

func main() {
	lambda.Start(handler)
}
