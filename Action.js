const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    properties: {
      // Meeting specific
      meeting_id: String,
      meeting_timestamp: Date,
      meeting_hubspot_owner_id: String,
      meeting_title: String,
      meeting_start_time: Date,
      meeting_end_time: Date,
      meeting_outcome: String,

      // Company specific
      company_id: String,
      company_domain: String,
      company_industry: String,

      // Contact specific
      contact_name: String,
      contact_title: String,
      contact_source: String,
      contact_status: String,
      contact_score: Number,
    },
    identity: {
      type: String,
      sparse: true,
      index: true,
    },
    includeInAnalytics: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ActionSchema.index({ type: 1, timestamp: -1 });
ActionSchema.index({ identity: 1, timestamp: -1 });

ActionSchema.statics.getActionsByDateRange = function (
  startDate,
  endDate,
  type
) {
  return this.find({
    timestamp: { $gte: startDate, $lte: endDate },
    ...(type && { type }),
  }).sort({ timestamp: -1 });
};

module.exports = mongoose.model("Action", ActionSchema);
