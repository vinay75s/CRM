# Lead Profile Page - Frontend Documentation

## Overview
The Lead Profile Page provides a comprehensive interface for managing individual leads with quick actions, classification, assignment, and communication features.

---

## File Structure

```
frontend/src/
├── pages/
│   └── LeadProfilePage.tsx          # Main page component
├── components/
│   └── lead/
│       ├── LeadHeader.tsx           # Header with lead info and status
│       ├── LeadTabs.tsx             # Tab navigation and content
│       ├── QuickActionsPanel.tsx    # Right sidebar with action buttons
│       └── modals/
│           ├── ClassifyModal.tsx    # Lead classification with void reasons
│           ├── AssignAgentModal.tsx # Agent assignment interface
│           ├── FollowUpModal.tsx    # Schedule follow-up meetings
│           ├── WhatsAppModal.tsx    # WhatsApp message template sender
│           ├── EmailModal.tsx       # Email composer
│           └── ProposalModal.tsx    # Proposal generator
```

---

## Component Details

### 1. LeadProfilePage.tsx
Main container component that orchestrates all sub-components.

**Features:**
- Lead data loading (mock data included)
- Tab management (Overview, History, Tasks, Documents)
- Modal state management
- Responsive layout with sidebar

**Props:** None (uses routing parameters)

```typescript
interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  budgetRange?: string;
  classification: 'Cold' | 'Warm' | 'Hot' | 'Void';
  assignedAgent?: string;
  lastContactedAt?: string;
  createdAt: string;
  activities: Array<any>;
}
```

---

### 2. LeadHeader.tsx
Displays lead information with status badge and timestamp.

**Features:**
- Lead avatar with first letter
- Name and status badge with color coding
  - Cold: Blue
  - Warm: Yellow
  - Hot: Red
  - Void: Gray
- Phone number and last contacted timestamp
- Back to leads button

**Props:**
```typescript
interface LeadHeaderProps {
  lead: Lead;
  setLead: (lead: any) => void;
}
```

---

### 3. LeadTabs.tsx
Tab content renderer with four sections.

**Tabs:**
1. **Overview** - Lead details and current status in grid layout
2. **History** - Activity log with timeline visualization
3. **Tasks** - Task management (placeholder for future implementation)
4. **Documents** - Document attachment interface (placeholder)

**Props:**
```typescript
interface LeadTabsProps {
  activeTab: 'overview' | 'history' | 'tasks' | 'documents';
  lead: Lead;
}
```

---

### 4. QuickActionsPanel.tsx
Right sidebar with six quick action buttons.

**Action Buttons:**
1. 📊 **Classify** - Change lead classification
2. 👤 **Assign Agent** - Assign to sales agent
3. 📅 **Schedule Follow-up** - Schedule meeting/call
4. 💬 **Send WhatsApp** - Send WhatsApp message
5. 📧 **Send Email** - Send email
6. 📄 **Generate Proposal** - Create proposal with property selection

**Features:**
- Color-coded action buttons
- Lead information summary section
- Modal management for all actions

**Props:**
```typescript
interface QuickActionsPanelProps {
  lead: Lead;
  setLead: (lead: any) => void;
}
```

---

## Modal Components

### ClassifyModal.tsx
**Purpose:** Lead classification with void reason validation

**Features:**
- Classification selection: Cold, Warm, Hot, Void
- Color-coded buttons
- **Conditional Void Reason Panel** (appears when "Void" selected)
  - Dropdown with reasons:
    - Budget mismatch
    - Location issue
    - Junk lead
    - Not interested
    - Other
  - **Custom Reason Text Field** (appears when "Other" selected)
  - Required field validation

**Data Flow:**
```
Classification selected
  ↓
If Void selected → Show void reason dropdown
  ↓
If "Other" selected → Show custom reason text field
  ↓
Validate and submit
  ↓
API call: POST /api/leads/:id/classify
```

---

### AssignAgentModal.tsx
**Purpose:** Assign lead to sales agent

**Features:**
- Search agents by name/email
- Display agent workload (number of assigned leads)
- Filtered agent list
- Agent selection with visual feedback

**Data Display:**
- Agent name
- Agent email
- Number of leads assigned
- Workload sorting (least busy agent highlighted)

---

### FollowUpModal.tsx
**Purpose:** Schedule follow-up meeting/call

**Features:**
- Date picker (minimum: today)
- Time picker
- Notes text area
- Validation for required fields

**Form Fields:**
- Contact (auto-filled with lead name)
- Date (required)
- Time (required)
- Notes (optional)

---

### WhatsAppModal.tsx
**Purpose:** Send WhatsApp messages with templates

**Features:**
- **Template Selection:**
  - Initial Greeting
  - Follow-up Message
  - Property Offer
  - Custom Message
- Message editor
- Character count (max 1600)
- Preview panel
- Template auto-population

**Templates Include:**
- Lead name personalization
- Pre-written professional content
- Custom message option

---

### EmailModal.tsx
**Purpose:** Compose and send emails

**Features:**
- Quick email templates
- Form fields:
  - To (required)
  - CC (optional)
  - Subject (required)
  - Message body
- Template quick-select buttons
- Email validation

**Email Templates:**
- Initial Inquiry
- Follow-up
- Proposal Notification

---

### ProposalModal.tsx
**Purpose:** Generate proposals with property selection

**Features:**
- Multi-select properties
- Property cards with:
  - Property name
  - Price
  - Area (sqft)
- Selection summary
- Checkbox selection with visual feedback

**Properties Mock Data:**
```typescript
{
  id: string;
  name: string;
  price: string;
  area: string;
}
```

---

## User Workflows

### Workflow 1: Lead Classification
1. Click "Classify" button in Quick Actions
2. ClassifyModal opens
3. Select classification (Cold/Warm/Hot/Void)
4. If Void selected:
   - Select void reason from dropdown
   - If "Other" selected → Enter custom reason
5. Click "Classify" to submit
6. Lead updates and activity is logged

### Workflow 2: Lead Assignment
1. Click "Assign Agent" button
2. AssignAgentModal opens
3. Search for agent (optional)
4. Select agent from list
5. Click "Assign"
6. Lead updates with new agent
7. Agent workload increments

### Workflow 3: Schedule Follow-up
1. Click "Schedule Follow-up" button
2. FollowUpModal opens
3. Select date (minimum: today)
4. Select time
5. Add optional notes
6. Click "Schedule"
7. System records follow-up

### Workflow 4: Send Communication
1. Click "Send WhatsApp" or "Send Email"
2. Modal opens with templates/editor
3. Select template or write custom message
4. Review message
5. Click "Send"
6. System records communication

### Workflow 5: Generate Proposal
1. Click "Generate Proposal" button
2. ProposalModal opens
3. Select properties (at least one required)
4. Review selection summary
5. Click "Generate"
6. System generates and sends proposal

---

## CSS Classes Used

- **Tailwind Utilities:**
  - `flex`, `grid`, `space-y-*`, `gap-*`
  - `bg-*`, `text-*`, `border-*`
  - `rounded-lg`, `p-*`, `m-*`
  - `hover:*`, `focus:*`, `disabled:*`
  - `fixed inset-0`, `z-50` (for modals)

- **Color Scheme:**
  - Primary: `bg-primary`, `text-primary`
  - Foreground: `text-foreground`
  - Background: `bg-background`
  - Status colors: Blue, Yellow, Red, Gray

---

## API Integration Points

All components have TODO comments for API integration:

1. **Lead Fetch:**
   ```
   GET /api/leads/:id
   ```

2. **Classify Lead:**
   ```
   POST /api/leads/:id/classify
   Body: { classification, voidReason?, customVoidReason? }
   ```

3. **Assign Lead:**
   ```
   POST /api/leads/:id/assign
   Body: { agentId }
   ```

4. **Schedule Follow-up:**
   ```
   POST /api/leads/:id/schedule-followup
   Body: { scheduledAt, notes? }
   ```

5. **Send WhatsApp:**
   ```
   POST /api/leads/:id/send-whatsapp
   Body: { message, templateId? }
   ```

6. **Send Email:**
   ```
   POST /api/leads/:id/send-email
   Body: { to, subject, body, cc? }
   ```

7. **Generate Proposal:**
   ```
   POST /api/leads/:id/generate-proposal
   Body: { propertyIds: string[] }
   ```

---

## State Management

Each modal manages its own local state:
- Input values
- Loading state
- Error messages
- Selection state

Parent component (LeadProfilePage) manages:
- Lead data
- Active tab
- Modal visibility states

---

## Future Enhancements

1. Add Zustand/Redux for global state management
2. Implement real-time notification system
3. Add attachment/document upload functionality
4. Create task management system
5. Add call recording integration
6. Implement SMS messaging
7. Add task reminders and notifications
8. Create custom proposal templates
9. Add activity filters and search
10. Implement bulk actions on multiple leads
