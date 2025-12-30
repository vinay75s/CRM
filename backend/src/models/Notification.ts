import mongoose from "mongoose";

export enum NotificationType {
  LeadAssigned = "Lead Assigned",
  PriceChange = "Price Change",
  StatusUpdate = "Status Update",
  TaskReminder = "Task Reminder",
  ProposalViewed = "Proposal Viewed",
}

export enum RelatedEntity {
  Lead = "Lead",
  Customer = "Customer",
  Unit = "Unit",
  Proposal = "Proposal",
}
export enum NotificationMessage {
  LeadAssigned = "A new lead has been assigned to you",
  PriceChange = "The price has been updated",
  StatusUpdate = "Status has been updated",
  TaskReminder = "You have a pending task reminder",
  ProposalViewed = "Your proposal has been viewed",
}
export interface INotification {
  _id?: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntity?: RelatedEntity;
  relatedEntityId?: mongoose.Types.ObjectId;
  isRead: boolean;
  readAt?: Date | null;
  createdAt?: Date;
}

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedEntity: {
    type: String,
    enum: Object.values(RelatedEntity),
    required: true,
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
