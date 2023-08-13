import { Schema, model, models } from 'mongoose';

const proposalSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Proposal = models.Proposal || model('Proposal', proposalSchema);
