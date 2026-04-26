package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

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

// Mock external service calls for chaos engineering demonstrations
// These simulate the latency of real external services

func chargeCreditCard(ctx context.Context, orderID string, amount float64) error {
	// Simulate credit card processing: 500-1000ms
	delay := time.Duration(500+rand.Intn(501)) * time.Millisecond
	log.Printf("[chargeCreditCard] Processing payment for order %s, amount: $%.2f (delay: %v)", orderID, amount, delay)
	time.Sleep(delay)
	log.Printf("[chargeCreditCard] Payment successful for order %s", orderID)
	return nil
}

func updateSAP(ctx context.Context, orderID string, orderData OrderRecord) error {
	// Simulate SAP ERP update: 500-1000ms
	delay := time.Duration(500+rand.Intn(501)) * time.Millisecond
	log.Printf("[updateSAP] Updating SAP for order %s (delay: %v)", orderID, delay)
	time.Sleep(delay)
	log.Printf("[updateSAP] SAP updated successfully for order %s", orderID)
	return nil
}

func orderShippingDHL(ctx context.Context, orderID string, items []OrderItem) error {
	// Simulate DHL shipping order: 500-1000ms
	delay := time.Duration(500+rand.Intn(501)) * time.Millisecond
	log.Printf("[orderShippingDHL] Creating shipping order for %s (delay: %v)", orderID, delay)
	time.Sleep(delay)
	log.Printf("[orderShippingDHL] Shipping order created for %s", orderID)
	return nil
}

// enableCORS adds CORS headers to the response
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

// healthHandler handles health check requests
func healthHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "healthy",
		"service": "chaos-coffee-order-processor",
	})
}

// orderHandler handles order processing requests
func orderHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	// Handle preflight requests
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Method not allowed"})
		return
	}

	log.Printf("Received order request from %s", r.RemoteAddr)

	// Parse the order from request body
	var order Order
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		log.Printf("Failed to parse request body: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Invalid request body: %v", err)})
		return
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
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Failed to process order: %v", err)})
		return
	}

	// Put item to DynamoDB
	_, err = dynamoClient.PutItem(r.Context(), &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      item,
	})
	if err != nil {
		log.Printf("Failed to put item to DynamoDB: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Failed to save order: %v", err)})
		return
	}

	log.Printf("Order %s saved successfully for student %s", orderID, studentID)

	// Process order through external systems (mock calls for chaos engineering)
	// In a real system, these would be async/event-driven to avoid long synchronous chains
	log.Printf("Starting external service calls for order %s", orderID)

	// 1. Charge credit card (500-1000ms)
	if err := chargeCreditCard(r.Context(), orderID, order.Total); err != nil {
		log.Printf("Credit card charge failed: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Payment processing failed: %v", err)})
		return
	}

	// 2. Update SAP ERP system (500-1000ms)
	if err := updateSAP(r.Context(), orderID, record); err != nil {
		log.Printf("SAP update failed: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("ERP update failed: %v", err)})
		return
	}

	// 3. Create shipping order with DHL (500-1000ms)
	if err := orderShippingDHL(r.Context(), orderID, order.Items); err != nil {
		log.Printf("Shipping order failed: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Shipping order failed: %v", err)})
		return
	}

	log.Printf("All external services processed successfully for order %s", orderID)

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"order_id": orderID,
		"message":  "Order received and stored",
	})
}

func main() {
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/", orderHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Chaos Coffee Order Processor on port %s", port)
	log.Printf("DynamoDB Table: %s", tableName)
	log.Printf("Student ID: %s", studentID)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
