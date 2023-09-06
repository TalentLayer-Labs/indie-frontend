import { Schema, model, models } from 'mongoose';

const newProposalEmailSchema = new Schema({
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

export const NewProposalEmail =
  models.NewProposalEmail || model('NewProposalEmail', newProposalEmailSchema);
