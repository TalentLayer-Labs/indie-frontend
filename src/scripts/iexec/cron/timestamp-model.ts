import { Schema, model, models } from 'mongoose';

const timestampSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Number,
    required: true,
    unique: false,
  },
});

export const Timestamp = models.Timestamp || model('Timestamp', timestampSchema);
