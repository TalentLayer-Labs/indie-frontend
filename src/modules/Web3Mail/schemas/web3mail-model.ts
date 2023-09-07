import { Schema, model, models } from 'mongoose';
import { EmailType } from '../../../types';

const web3MailSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  sentAt: {
    type: Number,
    required: true,
    unique: false,
  },
  type: {
    type: String,
    enum: EmailType,
    required: true,
  },
});

export const Web3Mail = models.Web3Mail || model('Web3Mail', web3MailSchema);
