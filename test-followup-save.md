# Manual Test Plan for Follow-up Save

## Setup
1. Login with test@example.com / password123
2. Clear database and reseed: `cd apps/backend && npm run seed:clear`

## Test 1: Create New Follow-up with All Fields
1. Go to http://localhost:5173/followup/new
2. Fill in all fields:
   - Title: "Test Follow-up - All Fields"
   - Sender Company: "Sender Company"
   - Receiver Company: "Receiver 1"
   - Meeting Date: Today's date
   - Meeting Type: "Sales"
   - Meeting Location: "Zoom"
   - Product: "Test Product"
3. Switch to "Meeting Recap" tab and add text: "This is the meeting recap with **bold** text"
4. Switch to "Value Proposition" tab and add text: "This is the value proposition with *italic* text"
5. Switch to "Next Steps" tab and add a step
6. Click "Save Draft"
7. Verify:
   - Success message appears
   - Redirects to follow-ups list page after 1.5 seconds
   - Follow-up appears in the list

## Test 2: Edit Existing Follow-up
1. Click on the follow-up you just created
2. Click "Edit" button
3. Modify the value proposition: Add more text "Additional value"
4. Click "Save Draft" (button should say "Save Draft" since status is DRAFT)
5. Verify:
   - Success message appears
   - Redirects to follow-ups list
6. View the follow-up again
7. Verify value proposition shows the updated text

## Test 3: Edit Published Follow-up
1. Publish one of the seeded follow-ups (go to follow-up detail, click Publish)
2. Click "Edit" on the published follow-up
3. Verify button says "Save & Publish" (not "Save Draft")
4. Modify value proposition
5. Click "Save & Publish"
6. View public URL
7. Verify value proposition is updated on public page

## Expected Behavior
- All text fields should save correctly
- Rich text formatting (bold, italic, lists) should be preserved
- Public URL should show all content including value proposition
- Button text changes based on status (Draft vs Published)
- Auto-redirect to follow-ups list after successful save
