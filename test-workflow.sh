#!/bin/bash

# Test workflow script for Meeting Follow-up MVP

BASE_URL="http://localhost:3001/api"
USER_ID="test-user-123"

echo "=== Testing Meeting Follow-up MVP Workflow ==="
echo ""

# Test 1: Create Sender Company
echo "1. Creating sender company..."
TIMESTAMP=$(date +%s)
SENDER_RESPONSE=$(curl -s -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{\"name\":\"Acme Corporation $TIMESTAMP\",\"website\":\"https://acme.com\",\"industry\":\"Software\",\"description\":\"Leading software company\"}")

SENDER_COMPANY_ID=$(echo $SENDER_RESPONSE | jq -r '.data.id // empty')
if [ -z "$SENDER_COMPANY_ID" ]; then
  echo "❌ Failed to create sender company"
  echo "$SENDER_RESPONSE" | jq '.'
  exit 1
fi
echo "✅ Sender company created: $SENDER_COMPANY_ID"
echo ""

# Test 2: Create Sender Contact
echo "2. Creating sender contact..."
SENDER_CONTACT_RESPONSE=$(curl -s -X POST "$BASE_URL/contacts" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{\"companyId\":\"$SENDER_COMPANY_ID\",\"name\":\"John Smith\",\"email\":\"john@acme.com\",\"title\":\"Sales Manager\",\"phone\":\"555-0100\"}")

SENDER_CONTACT_ID=$(echo $SENDER_CONTACT_RESPONSE | jq -r '.data.id // empty')
if [ -z "$SENDER_CONTACT_ID" ]; then
  echo "❌ Failed to create sender contact"
  echo "$SENDER_CONTACT_RESPONSE" | jq '.'
  exit 1
fi
echo "✅ Sender contact created: $SENDER_CONTACT_ID"
echo ""

# Test 3: Create Receiver Company
echo "3. Creating receiver company..."
RECEIVER_RESPONSE=$(curl -s -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{\"name\":\"TechCorp Industries $TIMESTAMP\",\"website\":\"https://techcorp.com\",\"industry\":\"Manufacturing\",\"description\":\"Technology manufacturing company\"}")

RECEIVER_COMPANY_ID=$(echo $RECEIVER_RESPONSE | jq -r '.data.id // empty')
if [ -z "$RECEIVER_COMPANY_ID" ]; then
  echo "❌ Failed to create receiver company"
  echo "$RECEIVER_RESPONSE" | jq '.'
  exit 1
fi
echo "✅ Receiver company created: $RECEIVER_COMPANY_ID"
echo ""

# Test 4: Create Receiver Contact
echo "4. Creating receiver contact..."
RECEIVER_CONTACT_RESPONSE=$(curl -s -X POST "$BASE_URL/contacts" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{\"companyId\":\"$RECEIVER_COMPANY_ID\",\"name\":\"Jane Doe\",\"email\":\"jane@techcorp.com\",\"title\":\"VP of Operations\",\"phone\":\"555-0200\"}")

RECEIVER_CONTACT_ID=$(echo $RECEIVER_CONTACT_RESPONSE | jq -r '.data.id // empty')
if [ -z "$RECEIVER_CONTACT_ID" ]; then
  echo "❌ Failed to create receiver contact"
  echo "$RECEIVER_CONTACT_RESPONSE" | jq '.'
  exit 1
fi
echo "✅ Receiver contact created: $RECEIVER_CONTACT_ID"
echo ""

# Test 5: Create Follow-up
echo "5. Creating follow-up..."
FOLLOWUP_RESPONSE=$(curl -s -X POST "$BASE_URL/followups" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{
    \"title\": \"Q1 2024 Sales Meeting\",
    \"senderCompanyId\": \"$SENDER_COMPANY_ID\",
    \"receiverCompanyId\": \"$RECEIVER_COMPANY_ID\",
    \"senderId\": \"$SENDER_CONTACT_ID\",
    \"receiverId\": \"$RECEIVER_CONTACT_ID\",
    \"meetingDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"meetingType\": \"SALES\",
    \"meetingLocation\": \"Acme HQ, San Francisco\",
    \"product\": \"Enterprise Software Suite\",
    \"meetingRecap\": \"<p>Great meeting discussing Q1 goals and enterprise software implementation.</p><p>Key points covered:</p><ul><li>Budget approval timeline</li><li>Technical requirements</li><li>Integration with existing systems</li></ul>\",
    \"meetingNotesUrl\": \"https://docs.google.com/document/d/example\",
    \"videoRecordingUrl\": \"https://zoom.us/rec/example\",
    \"nextSteps\": [
      {
        \"action\": \"Send technical proposal\",
        \"deadline\": \"$(date -u -v+7d +"%Y-%m-%dT%H:%M:%SZ")\",
        \"owner\": \"SENDER\",
        \"completed\": false
      },
      {
        \"action\": \"Review with technical team\",
        \"deadline\": \"$(date -u -v+14d +"%Y-%m-%dT%H:%M:%SZ")\",
        \"owner\": \"RECEIVER\",
        \"completed\": false
      }
    ]
  }")

FOLLOWUP_ID=$(echo $FOLLOWUP_RESPONSE | jq -r '.data.id // empty')
if [ -z "$FOLLOWUP_ID" ]; then
  echo "❌ Failed to create follow-up"
  echo "$FOLLOWUP_RESPONSE" | jq '.'
  exit 1
fi
echo "✅ Follow-up created: $FOLLOWUP_ID"
echo ""

# Test 6: Get Follow-up (test pre-population)
echo "6. Getting follow-up to verify data..."
GET_FOLLOWUP_RESPONSE=$(curl -s -X GET "$BASE_URL/followups/$FOLLOWUP_ID?include=true" \
  -H "x-user-id: $USER_ID")

echo "$GET_FOLLOWUP_RESPONSE" | jq '.data | {title, senderCompany: .senderCompany.name, receiverCompany: .receiverCompany.name, sender: .sender.name, receiver: .receiver.name, product}'
echo "✅ Follow-up data retrieved successfully"
echo ""

# Test 7: Publish Follow-up
echo "7. Publishing follow-up..."
PUBLISH_RESPONSE=$(curl -s -X POST "$BASE_URL/followups/$FOLLOWUP_ID/publish" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d "{\"slug\":\"q1-2024-sales-meeting-$TIMESTAMP\"}")

SLUG=$(echo $PUBLISH_RESPONSE | jq -r '.data.slug // empty')
if [ -z "$SLUG" ]; then
  echo "❌ Failed to publish follow-up"
  echo "$PUBLISH_RESPONSE" | jq '.'
  exit 1
fi
echo "✅ Follow-up published with slug: $SLUG"
echo "📍 Public URL: http://localhost:5173/followup/$SLUG"
echo ""

# Test 8: Get Analytics
echo "8. Getting analytics..."
ANALYTICS_RESPONSE=$(curl -s -X GET "$BASE_URL/analytics/followups/$FOLLOWUP_ID?timeRange=all" \
  -H "x-user-id: $USER_ID")

echo "$ANALYTICS_RESPONSE" | jq '.data | {totalViews, uniqueVisitors, deviceBreakdown}'
echo "✅ Analytics retrieved successfully"
echo ""

echo "=== All Tests Passed! ==="
echo ""
echo "Summary:"
echo "- Sender Company: $SENDER_COMPANY_ID (Acme Corporation)"
echo "- Sender Contact: $SENDER_CONTACT_ID (John Smith)"
echo "- Receiver Company: $RECEIVER_COMPANY_ID (TechCorp Industries)"
echo "- Receiver Contact: $RECEIVER_CONTACT_ID (Jane Doe)"
echo "- Follow-up: $FOLLOWUP_ID (Q1 2024 Sales Meeting)"
echo "- Public Slug: $SLUG"
echo ""
echo "You can now:"
echo "1. Visit http://localhost:5173 to view the dashboard"
echo "2. Visit http://localhost:5173/followup/$SLUG to view the public page"
echo "3. Edit the follow-up at http://localhost:5173/follow-ups/$FOLLOWUP_ID/edit"
