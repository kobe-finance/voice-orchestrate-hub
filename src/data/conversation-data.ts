
import { Conversation } from "@/types/conversation";

// Mock data for the Conversation Explorer
export const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    startTime: "2023-05-15T09:23:12Z",
    endTime: "2023-05-15T09:28:45Z",
    duration: 333, // 5 minutes 33 seconds
    agents: [{ id: "agent-1", type: "agent", name: "Customer Service AI" }],
    users: [{ id: "user-1", type: "user", name: "John Doe" }],
    messages: [
      { id: "msg-1", speakerId: "user-1", text: "Hi, I need help with my recent order.", timestamp: "2023-05-15T09:23:12Z", sentiment: "neutral" },
      { id: "msg-2", speakerId: "agent-1", text: "Hello! I'd be happy to help you with your order. Could you please provide your order number?", timestamp: "2023-05-15T09:23:20Z", sentiment: "positive" },
      { id: "msg-3", speakerId: "user-1", text: "Yes, it's ABC12345.", timestamp: "2023-05-15T09:23:35Z", sentiment: "neutral" },
      { id: "msg-4", speakerId: "agent-1", text: "Thank you. I can see your order was placed on May 10th for 3 items. What specific help do you need?", timestamp: "2023-05-15T09:23:45Z", sentiment: "positive" },
      { id: "msg-5", speakerId: "user-1", text: "One of the items is missing from the package I received.", timestamp: "2023-05-15T09:24:02Z", sentiment: "negative" },
      { id: "msg-6", speakerId: "agent-1", text: "I'm sorry to hear that. Let me arrange for a replacement to be sent to you immediately. Is the delivery address in your profile still current?", timestamp: "2023-05-15T09:24:20Z", sentiment: "neutral" },
      { id: "msg-7", speakerId: "user-1", text: "Yes, it is. Thank you for your quick help!", timestamp: "2023-05-15T09:24:45Z", sentiment: "positive" },
      { id: "msg-8", speakerId: "agent-1", text: "You're welcome. The replacement has been scheduled for express shipping. You should receive it within 2 business days. Is there anything else I can help with today?", timestamp: "2023-05-15T09:25:10Z", sentiment: "positive" },
      { id: "msg-9", speakerId: "user-1", text: "No, that's all. Thanks again!", timestamp: "2023-05-15T09:25:25Z", sentiment: "positive" },
      { id: "msg-10", speakerId: "agent-1", text: "You're welcome. Have a great day!", timestamp: "2023-05-15T09:25:35Z", sentiment: "positive" },
    ],
    outcome: "completed",
    intentRecognized: ["order_issue", "missing_item", "replacement_request"],
    entities: {
      "order_id": ["ABC12345"],
      "item_status": ["missing"]
    },
    sentimentScore: 0.6,
    tags: ["resolved_quickly", "positive_outcome", "missing_item"],
    audioUrl: "/sample-voice.mp3"
  },
  {
    id: "conv-002",
    startTime: "2023-05-16T14:05:22Z",
    endTime: "2023-05-16T14:12:18Z",
    duration: 416, // 6 minutes 56 seconds
    agents: [{ id: "agent-2", type: "agent", name: "Technical Support AI" }],
    users: [{ id: "user-2", type: "user", name: "Jane Smith" }],
    messages: [
      { id: "msg-1", speakerId: "user-2", text: "My account keeps logging me out every 5 minutes. It's very frustrating!", timestamp: "2023-05-16T14:05:22Z", sentiment: "negative" },
      { id: "msg-2", speakerId: "agent-2", text: "I understand how frustrating that can be. Let me help you resolve this issue. What device and browser are you using?", timestamp: "2023-05-16T14:05:35Z", sentiment: "neutral" },
      { id: "msg-3", speakerId: "user-2", text: "I'm using Chrome on Windows 10.", timestamp: "2023-05-16T14:05:48Z", sentiment: "neutral" },
      { id: "msg-4", speakerId: "agent-2", text: "Thank you. Have you tried clearing your cache and cookies recently?", timestamp: "2023-05-16T14:06:00Z", sentiment: "neutral" },
      { id: "msg-5", speakerId: "user-2", text: "No, I haven't. How do I do that?", timestamp: "2023-05-16T14:06:15Z", sentiment: "neutral" },
      { id: "msg-6", speakerId: "agent-2", text: "I'll guide you through the process. First, open Chrome and click on the three dots in the top right corner...", timestamp: "2023-05-16T14:06:30Z", sentiment: "positive" },
      { id: "msg-7", speakerId: "user-2", text: "Ok, I've cleared them as you suggested.", timestamp: "2023-05-16T14:09:45Z", sentiment: "neutral" },
      { id: "msg-8", speakerId: "agent-2", text: "Great! Please try logging in again and using the site for a few minutes to see if the issue persists.", timestamp: "2023-05-16T14:10:00Z", sentiment: "positive" },
      { id: "msg-9", speakerId: "user-2", text: "It seems to be working now! Thank you so much for your help.", timestamp: "2023-05-16T14:11:50Z", sentiment: "positive" },
      { id: "msg-10", speakerId: "agent-2", text: "You're welcome! If you experience this issue again, please don't hesitate to reach out. Is there anything else I can assist you with today?", timestamp: "2023-05-16T14:12:05Z", sentiment: "positive" },
      { id: "msg-11", speakerId: "user-2", text: "No, that's all. Have a nice day!", timestamp: "2023-05-16T14:12:18Z", sentiment: "positive" },
    ],
    outcome: "completed",
    intentRecognized: ["technical_issue", "account_problem", "login_problem"],
    entities: {
      "device": ["Windows 10"],
      "browser": ["Chrome"],
      "issue_type": ["login", "timeout"]
    },
    sentimentScore: 0.3,
    tags: ["resolved_successfully", "technical_support", "browser_issue"],
    audioUrl: "/sample-voice.mp3"
  },
  {
    id: "conv-003",
    startTime: "2023-05-17T11:32:05Z",
    endTime: "2023-05-17T11:40:22Z",
    duration: 497, // 8 minutes 17 seconds
    agents: [{ id: "agent-3", type: "agent", name: "Sales AI" }],
    users: [{ id: "user-3", type: "user", name: "Robert Johnson" }],
    messages: [
      { id: "msg-1", speakerId: "user-3", text: "I'm interested in your premium plan but need more information.", timestamp: "2023-05-17T11:32:05Z", sentiment: "neutral" },
      { id: "msg-2", speakerId: "agent-3", text: "I'd be happy to provide you with information about our premium plan. What specific aspects are you interested in?", timestamp: "2023-05-17T11:32:18Z", sentiment: "positive" },
      { id: "msg-3", speakerId: "user-3", text: "What's the difference between the standard and premium plans?", timestamp: "2023-05-17T11:32:35Z", sentiment: "neutral" },
      { id: "msg-4", speakerId: "agent-3", text: "The premium plan offers several advantages over the standard plan, including...", timestamp: "2023-05-17T11:33:00Z", sentiment: "positive" },
      { id: "msg-5", speakerId: "user-3", text: "That sounds promising. What about pricing?", timestamp: "2023-05-17T11:35:15Z", sentiment: "neutral" },
      { id: "msg-6", speakerId: "agent-3", text: "The premium plan is $49.99 per month, which represents a 20% saving compared to the standard plan when billed annually...", timestamp: "2023-05-17T11:35:30Z", sentiment: "neutral" },
      { id: "msg-7", speakerId: "user-3", text: "That's a bit more than I wanted to spend. Are there any current promotions?", timestamp: "2023-05-17T11:36:45Z", sentiment: "negative" },
      { id: "msg-8", speakerId: "agent-3", text: "Yes, we're currently offering a 3-month free trial for new premium subscribers, and a 15% discount for the first year if you sign up today.", timestamp: "2023-05-17T11:37:05Z", sentiment: "positive" },
      { id: "msg-9", speakerId: "user-3", text: "That's more like it! How do I sign up?", timestamp: "2023-05-17T11:37:25Z", sentiment: "positive" },
      { id: "msg-10", speakerId: "agent-3", text: "I can help you with that right now. First, let me confirm: would you like the monthly or annual billing option?", timestamp: "2023-05-17T11:37:40Z", sentiment: "positive" },
      { id: "msg-11", speakerId: "user-3", text: "I think I need to discuss this with my team first. Can you email me the details?", timestamp: "2023-05-17T11:38:10Z", sentiment: "neutral" },
      { id: "msg-12", speakerId: "agent-3", text: "Of course! I can send you a detailed overview of the plans and current promotions. What's your email address?", timestamp: "2023-05-17T11:38:25Z", sentiment: "positive" },
      { id: "msg-13", speakerId: "user-3", text: "It's robert.johnson@example.com", timestamp: "2023-05-17T11:38:45Z", sentiment: "neutral" },
      { id: "msg-14", speakerId: "agent-3", text: "Thank you! I've sent the information to robert.johnson@example.com. The email includes my direct contact details if you have any further questions.", timestamp: "2023-05-17T11:39:05Z", sentiment: "positive" },
      { id: "msg-15", speakerId: "user-3", text: "Perfect, thank you for your help.", timestamp: "2023-05-17T11:39:25Z", sentiment: "positive" },
      { id: "msg-16", speakerId: "agent-3", text: "You're welcome! Feel free to reach out if you have any other questions. Have a great day!", timestamp: "2023-05-17T11:39:40Z", sentiment: "positive" },
    ],
    outcome: "completed",
    intentRecognized: ["pricing_inquiry", "plan_comparison", "promotion_request"],
    entities: {
      "plan_type": ["premium", "standard"],
      "pricing": ["$49.99"],
      "promotion": ["free trial", "discount"]
    },
    sentimentScore: 0.5,
    tags: ["lead_nurturing", "price_sensitive", "information_request"],
    audioUrl: "/sample-voice.mp3"
  },
  {
    id: "conv-004",
    startTime: "2023-05-18T16:12:33Z",
    endTime: "2023-05-18T16:18:50Z",
    duration: 377, // 6 minutes 17 seconds
    agents: [{ id: "agent-4", type: "agent", name: "Billing Support AI" }],
    users: [{ id: "user-4", type: "user", name: "Maria Garcia" }],
    messages: [
      { id: "msg-1", speakerId: "user-4", text: "I was charged twice for my subscription this month. I need this fixed immediately.", timestamp: "2023-05-18T16:12:33Z", sentiment: "negative" },
      { id: "msg-2", speakerId: "agent-4", text: "I apologize for this billing error. Let me look into this right away. Could you please provide your account email or customer ID?", timestamp: "2023-05-18T16:12:50Z", sentiment: "neutral" },
      { id: "msg-3", speakerId: "user-4", text: "My email is maria.garcia@example.com", timestamp: "2023-05-18T16:13:05Z", sentiment: "neutral" },
      { id: "msg-4", speakerId: "agent-4", text: "Thank you. I can confirm that there was indeed a duplicate charge on May 15th. I'll process a refund immediately for the extra charge.", timestamp: "2023-05-18T16:13:45Z", sentiment: "neutral" },
      { id: "msg-5", speakerId: "user-4", text: "How long will the refund take to process?", timestamp: "2023-05-18T16:14:00Z", sentiment: "neutral" },
      { id: "msg-6", speakerId: "agent-4", text: "The refund has been initiated and you should see it reflected in your account within 3-5 business days. I've also added a 10% discount to your next billing cycle as compensation for this error.", timestamp: "2023-05-18T16:14:30Z", sentiment: "positive" },
      { id: "msg-7", speakerId: "user-4", text: "I appreciate that, thank you. Can you make sure this doesn't happen again?", timestamp: "2023-05-18T16:15:00Z", sentiment: "neutral" },
      { id: "msg-8", speakerId: "agent-4", text: "I've added a note to your account and implemented a billing safeguard to prevent duplicate charges. This should ensure it doesn't recur.", timestamp: "2023-05-18T16:15:30Z", sentiment: "positive" },
      { id: "msg-9", speakerId: "user-4", text: "Good. Is there anything else I need to do?", timestamp: "2023-05-18T16:16:00Z", sentiment: "neutral" },
      { id: "msg-10", speakerId: "agent-4", text: "No, everything has been taken care of on our end. You'll receive an email confirmation of the refund shortly. If you don't see the refund in 5 business days, please contact us again.", timestamp: "2023-05-18T16:16:45Z", sentiment: "positive" },
      { id: "msg-11", speakerId: "user-4", text: "OK, thank you for resolving this quickly.", timestamp: "2023-05-18T16:17:10Z", sentiment: "positive" },
      { id: "msg-12", speakerId: "agent-4", text: "You're welcome. I'm glad I could help resolve this issue. Is there anything else you need assistance with today?", timestamp: "2023-05-18T16:17:30Z", sentiment: "positive" },
      { id: "msg-13", speakerId: "user-4", text: "No, that's all. Goodbye.", timestamp: "2023-05-18T16:17:45Z", sentiment: "neutral" },
      { id: "msg-14", speakerId: "agent-4", text: "Thank you for contacting us. Have a great day!", timestamp: "2023-05-18T16:18:00Z", sentiment: "positive" },
    ],
    outcome: "completed",
    intentRecognized: ["billing_issue", "refund_request", "account_verification"],
    entities: {
      "issue_type": ["duplicate charge", "billing error"],
      "action_taken": ["refund", "discount"],
      "email": ["maria.garcia@example.com"]
    },
    sentimentScore: -0.2,
    tags: ["billing_issue", "resolved_successfully", "compensation_offered"],
    audioUrl: "/sample-voice.mp3"
  },
  {
    id: "conv-005",
    startTime: "2023-05-19T10:05:12Z",
    endTime: "2023-05-19T10:08:30Z",
    duration: 198, // 3 minutes 18 seconds
    agents: [{ id: "agent-5", type: "agent", name: "Product Support AI" }],
    users: [{ id: "user-5", type: "user", name: "David Chen" }],
    messages: [
      { id: "msg-1", speakerId: "user-5", text: "I need to speak with a human representative immediately.", timestamp: "2023-05-19T10:05:12Z", sentiment: "neutral" },
      { id: "msg-2", speakerId: "agent-5", text: "I understand you'd like to speak with a human representative. May I know what issue you're experiencing so I can direct you to the right department?", timestamp: "2023-05-19T10:05:25Z", sentiment: "neutral" },
      { id: "msg-3", speakerId: "user-5", text: "My product is defective and I've been trying to get support for days without success. I just want to talk to a real person.", timestamp: "2023-05-19T10:05:45Z", sentiment: "negative" },
      { id: "msg-4", speakerId: "agent-5", text: "I'm sorry to hear about your experience. I'll connect you with a human representative from our product support team right away. Please hold while I transfer you.", timestamp: "2023-05-19T10:06:05Z", sentiment: "neutral" },
      { id: "msg-5", speakerId: "user-5", text: "Finally. Thank you.", timestamp: "2023-05-19T10:06:20Z", sentiment: "neutral" },
      { id: "msg-6", speakerId: "agent-5", text: "You're welcome. Your call is being transferred now. Your reference number is SUP-29875. Have a good day.", timestamp: "2023-05-19T10:06:35Z", sentiment: "neutral" },
    ],
    outcome: "transferred",
    intentRecognized: ["human_agent_request", "product_issue", "frustration_expressed"],
    entities: {
      "request_type": ["human transfer"],
      "issue": ["defective product"],
      "reference": ["SUP-29875"]
    },
    sentimentScore: -0.5,
    tags: ["escalated", "transferred_to_human", "product_issue"],
    audioUrl: "/sample-voice.mp3"
  },
];

// Available tags for filtering
export const availableTags = [
  "resolved_quickly",
  "positive_outcome",
  "missing_item",
  "resolved_successfully",
  "technical_support",
  "browser_issue",
  "lead_nurturing",
  "price_sensitive",
  "information_request",
  "billing_issue",
  "compensation_offered",
  "escalated",
  "transferred_to_human",
  "product_issue"
];

// Available intents for filtering
export const availableIntents = [
  "order_issue",
  "missing_item",
  "replacement_request",
  "technical_issue",
  "account_problem",
  "login_problem",
  "pricing_inquiry",
  "plan_comparison",
  "promotion_request",
  "billing_issue",
  "refund_request",
  "account_verification",
  "human_agent_request",
  "product_issue",
  "frustration_expressed"
];

// Available entities for filtering
export const availableEntities = {
  "order_id": ["ABC12345"],
  "item_status": ["missing"],
  "device": ["Windows 10"],
  "browser": ["Chrome"],
  "issue_type": ["login", "timeout", "duplicate charge", "billing error"],
  "plan_type": ["premium", "standard"],
  "pricing": ["$49.99"],
  "promotion": ["free trial", "discount"],
  "action_taken": ["refund", "discount"],
  "email": ["maria.garcia@example.com", "robert.johnson@example.com"],
  "request_type": ["human transfer"],
  "issue": ["defective product"],
  "reference": ["SUP-29875"]
};

// Available sentiment options
export const sentimentOptions = ["positive", "neutral", "negative"];

// Available outcome options
export const outcomeOptions = ["completed", "transferred", "abandoned"];
