#!/bin/bash

# Test script for Leela OS API endpoints
API_BASE="http://localhost:3000/api"

echo "🚀 Testing Leela OS API Endpoints..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local endpoint=$1
    local method=$2
    local data=$3
    
    echo -e "\n📝 Testing $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$API_BASE$endpoint")
    fi
    
    # Extract status code and response body
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "201" ]; then
        echo -e "${GREEN}✅ Success ($status_code)${NC}"
        echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
    else
        echo -e "${RED}❌ Failed ($status_code)${NC}"
        echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
    fi
}

# Test data
COUPLE_DATA='{
  "partner_a_name": "Rahul",
  "partner_b_name": "Priya",
  "anniversary_date": "2020-02-14",
  "city": "Mumbai",
  "children": [
    {"name": "Aarav", "age": 8},
    {"name": "Ananya", "age": 5}
  ]
}'

TASK_DATA='{
  "couple_id": "temp",
  "title": "Buy groceries",
  "description": "Weekly grocery shopping",
  "assigned_to": "partner_a",
  "category": "WEEKLY"
}'

SYNC_DATA='{
  "couple_id": "temp",
  "partner": "partner_a",
  "mood_score": 4,
  "energy_level": 7,
  "mood_tags": ["#happy", "#productive"],
  "context_notes": "Had a great day at work"
}'

# Run tests
echo "1. Testing health check..."
test_endpoint "/health" "GET"

echo -e "\n2. Testing couple creation..."
test_endpoint "/couples" "POST" "$COUPLE_DATA"

echo -e "\n3. Testing kids activities..."
test_endpoint "/kids-activities" "GET"

echo -e "\n4. Testing rewards system (with dummy couple_id)..."
test_endpoint "/rewards?couple_id=test-couple-id" "GET"

echo -e "\n🎉 API Tests completed!"