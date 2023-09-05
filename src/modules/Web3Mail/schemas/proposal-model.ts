import { Schema, model, models } from 'mongoose';

const emailSchema = new Schema({
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

export const Email = models.Email || model('Email', emailSchema);
