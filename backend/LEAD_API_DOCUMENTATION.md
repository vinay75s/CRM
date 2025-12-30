# Lead Management API Documentation

## Overview
This API manages the complete lead lifecycle with features for lead creation, classification, assignment, merging, and duplicate detection.

---

## API Endpoints

### 1. FLOW 1: Lead Creation and Auto-Assignment

#### POST `/api/leads`
Creates a new lead and automatically assigns it to the least busy agent.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "source": "Portal",
  "budgetRange": "50-75L",
  "assignedAgent": "optional_agent_id"
}
```

**Response (201):**
```json
{
  "message": "Lead created successfully",
  "lead": {
    "_id": "64abc123",
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "source": "Portal",
    "budgetRange": "50-75L",
    "classification": "Cold",
    "assignedAgent": "64agent123",
    "isDuplicate": false,
    "activities": [
      {
        "action": "CREATED",
        "description": "Lead created with source: Portal",
        "changedBy": "system",
        "timestamp": "2024-12-25T10:00:00Z"
      }
    ],
    "createdAt": "2024-12-25T10:00:00Z",
    "updatedAt": "2024-12-25T10:00:00Z"
  }
}
```

**Error Responses:**
- `400`: Missing required fields (name, phone)
- `409`: Phone number already exists
- `500`: Server error

---

### 2. FLOW 2: Lead Classification to Void

#### POST `/api/leads/:id/classify`
Classifies a lead and handles void reasons with validation.

**Request Body:**
```json
{
  "classification": "Void",
  "voidReason": "Not Interested",
  "customVoidReason": "Looking elsewhere"
}
```

**Valid Classifications:** Cold, Warm, Hot, Void

**Valid Void Reasons:**
- Not Interested
- Invalid Contact
- Wrong Number
- Other (requires customVoidReason)

**Response (200):**
```json
{
  "message": "Lead classified successfully",
  "lead": {
    "_id": "64abc123",
    "name": "John Doe",
    "classification": "Void",
    "voidReason": "Not Interested",
    "customVoidReason": null,
    "activities": [
      {
        "action": "CLASSIFIED",
        "description": "Classification changed from Cold to Void, Void Reason: Not Interested",
        "changedBy": "user_id",
        "timestamp": "2024-12-25T10:05:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- `400`: Invalid classification or missing void reason
- `404`: Lead not found
- `500`: Server error

---

### 3. Lead Assignment

#### POST `/api/leads/:id/assign`
Assigns a lead to a specific agent and updates agent's lead count.

**Request Body:**
```json
{
  "agentId": "64agent123"
}
```

**Response (200):**
```json
{
  "message": "Lead assigned successfully",
  "lead": {
    "_id": "64abc123",
    "name": "John Doe",
    "assignedAgent": "64agent123",
    "activities": [
      {
        "action": "ASSIGNED",
        "description": "Lead assigned to agent agent@example.com",
        "changedBy": "user_id",
        "timestamp": "2024-12-25T10:10:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- `400`: Missing agent ID
- `404`: Agent or Lead not found
- `500`: Server error

---

### 4. Lead Merging & Duplicate Detection

#### POST `/api/leads/:id/merge`
Merges duplicate leads and preserves data integrity.

**Request Body:**
```json
{
  "duplicateLeadId": "64abc456"
}
```

**Response (200):**
```json
{
  "message": "Leads merged successfully",
  "mainLead": {
    "_id": "64abc123",
    "name": "John Doe",
    "isDuplicate": true,
    "duplicateTag": "64abc456",
    "activities": [
      {
        "action": "MERGED",
        "description": "Lead merged with duplicate: 64abc456",
        "changedBy": "user_id",
        "timestamp": "2024-12-25T10:15:00Z"
      }
    ]
  },
  "duplicateLead": {
    "_id": "64abc456",
    "isDuplicate": true,
    "duplicateTag": "64abc123"
  }
}
```

---

#### GET `/api/leads/detect-duplicates/:leadId`
Detects potential duplicate leads based on phone number and name similarity.

**Response (200):**
```json
{
  "lead": {
    "_id": "64abc123",
    "name": "John Doe",
    "phone": "9876543210"
  },
  "potentialDuplicates": [
    {
      "_id": "64abc456",
      "name": "John D.",
      "phone": "9876543210",
      "assignedAgent": {
        "_id": "64agent123",
        "name": "Agent Smith",
        "email": "smith@example.com"
      }
    }
  ],
  "count": 1
}
```

---

### 5. Lead Management Endpoints

#### GET `/api/leads`
Retrieves all leads with pagination and filters.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `classification` (Cold, Warm, Hot, Void)
- `assignedAgent` (Agent ID)

**Response (200):**
```json
{
  "leads": [
    {
      "_id": "64abc123",
      "name": "John Doe",
      "phone": "9876543210",
      "classification": "Warm",
      "assignedAgent": {
        "_id": "64agent123",
        "name": "Agent Smith",
        "email": "smith@example.com"
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

---

#### GET `/api/leads/:id`
Retrieves a single lead with full details and activity log.

**Response (200):**
```json
{
  "_id": "64abc123",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "source": "Portal",
  "budgetRange": "50-75L",
  "classification": "Warm",
  "assignedAgent": {
    "_id": "64agent123",
    "name": "Agent Smith",
    "email": "smith@example.com"
  },
  "activities": [
    {
      "action": "CREATED",
      "description": "Lead created with source: Portal",
      "changedBy": {
        "_id": "user_id",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "timestamp": "2024-12-25T10:00:00Z"
    }
  ]
}
```

---

#### PUT `/api/leads/:id`
Updates lead information (name, email, budgetRange, lastContactedAt).

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "budgetRange": "75L-1Cr",
  "lastContactedAt": "2024-12-25T10:30:00Z"
}
```

**Response (200):**
```json
{
  "message": "Lead updated successfully",
  "lead": { /* updated lead object */ }
}
```

---

#### DELETE `/api/leads/:id`
Deletes a lead and updates agent's lead count.

**Response (200):**
```json
{
  "message": "Lead deleted successfully"
}
```

---

## Lead Data Model

```typescript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required, unique),
  email: String (optional),
  source: String, // "Portal" | "Website" | "Referral" | "Social" | "Walk-in"
  budgetRange: String, // "<50L" | "50-75L" | "75L-1Cr" | "1Cr+"
  classification: String, // "Cold" | "Warm" | "Hot" | "Void"
  voidReason: String, // "Not Interested" | "Invalid Contact" | "Wrong Number" | "Other"
  customVoidReason: String (if voidReason = "Other"),
  assignedAgent: ObjectId (ref: User),
  isDuplicate: Boolean (default: false),
  duplicateTag: String (linked lead ID if duplicate),
  lastContactedAt: Date,
  activities: Array<{
    action: String,
    description: String,
    changedBy: ObjectId (ref: User),
    timestamp: Date
  }>,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Workflows

### Workflow 1: Lead Creation and Auto-Assignment
1. User creates a lead via POST `/api/leads`
2. System validates required fields (name, phone)
3. System checks for existing leads with same phone
4. If no existing lead, creates new lead
5. If no agent specified, auto-assigns to least busy agent
6. Updates agent's `assignedLeadsCount`
7. Logs activity: "CREATED"

### Workflow 2: Lead Classification to Void
1. Agent views lead details
2. Agent calls POST `/api/leads/:id/classify` with classification = "Void"
3. System validates void reason (required when classification = "Void")
4. If voidReason = "Other", system requires customVoidReason
5. Updates lead classification and void reason
6. Logs activity: "CLASSIFIED" with previous and new classification
7. Returns updated lead

### Workflow 3: Lead Merging (Duplicate Handling)
1. System detects duplicate via phone number match
2. Agent views potential duplicates via GET `/api/leads/detect-duplicates/:leadId`
3. Agent selects main lead and duplicate lead
4. Agent calls POST `/api/leads/:id/merge` with duplicateLeadId
5. System merges data:
   - Keeps main lead data
   - Fills missing fields from duplicate
   - Merges all activities
6. Marks both leads as duplicates with cross-references
7. Logs activity on both leads: "MERGED"

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (duplicate phone number)
- `500`: Internal Server Error

---

## Activity Logging

Every operation on a lead is logged with:
- `action`: Type of operation (CREATED, CLASSIFIED, ASSIGNED, MERGED, UPDATED)
- `description`: Detailed description of the change
- `changedBy`: User ID who made the change
- `timestamp`: When the change occurred

This provides a complete audit trail for all lead modifications.
