import { Schema, model, models } from 'mongoose';
import { EmailType } from '../../../types';

const cronProbeSchema = new Schema({
  type: {
    type: String,
    enum: EmailType,
    unique: false,
    required: true,
  },
  lastRanAt: {
    type: Number,
    required: true,
    unique: false,
  },
  successCount: {
    type: Number,
    required: true,
    unique: false,
  },
  errorCount: {
    type: Number,
    required: true,
    unique: false,
  },
  duration: {
    type: Number,
    required: true,
    unique: false,
  },
});

export const CronProbe = models.CronProbe || model('CronProbe', cronProbeSchema);
