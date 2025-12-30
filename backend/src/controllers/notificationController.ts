import { isReadable } from "node:stream";
import { SendServerError, SendTwoh } from "../common/shared.js";
import Notification, { type INotification } from "../models/Notification.js";

export const createNotification = async (data: INotification) => {
  try {
    const notification = await Notification.create({
      recipient: data.recipient,
      type: data.type,
      title: data.title,
      message: data.message,
      isRead: false,
      ...(data.relatedEntity && { relatedEntity: data.relatedEntity }),
      ...(data.relatedEntityId && { relatedEntityId: data.relatedEntityId }),
    });

    return notification;
  } catch (e) {
    console.log(e, " error in create notification ");
    return false;
  }
};

export const readStatusUpdate = async (id: any) => {
  try {
    const notification = await Notification.findByIdAndUpdate(id, {
      isRead: true,
    });
    return notification;
  } catch (e) {
    return false;
  }
};
