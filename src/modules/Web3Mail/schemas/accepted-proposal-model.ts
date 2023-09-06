import { Schema, model, models } from 'mongoose';

const acceptedProposalEmailSchema = new Schema({
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

export const AcceptedProposalEmail =
  models.AcceptedProposalEmail || model('AcceptedProposalEmail', acceptedProposalEmailSchema);
