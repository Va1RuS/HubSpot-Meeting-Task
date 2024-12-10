const logger = require("./logger");
const disallowedValues = [
  "[not provided]",
  "placeholder",
  "[[unknown]]",
  "not set",
  "not provided",
  "unknown",
  "undefined",
  "n/a",
];
const Action = require("./Action");

const filterNullValuesFromObject = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(
      ([_, v]) =>
        v !== null &&
        v !== "" &&
        typeof v !== "undefined" &&
        (typeof v !== "string" ||
          !disallowedValues.includes(v.toLowerCase()) ||
          !v.toLowerCase().includes("!$record"))
    )
  );

const normalizePropertyName = (key) =>
  key
    .toLowerCase()
    .replace(/__c$/, "")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");

const goal = async (actions) => {
  try {
    const actionsByType = actions.reduce((acc, action) => {
      const type = action.actionName.split(" ")[0].toLowerCase();
      if (!acc[type]) acc[type] = [];
      acc[type].push(action);
      return acc;
    }, {});

    for (const [type, typeActions] of Object.entries(actionsByType)) {
      logger.info(`Processing ${typeActions.length} ${type} actions`);

      const formattedActions = typeActions.map((action) => ({
        type: action.actionName,
        timestamp: new Date(action.actionDate),
        properties: filterNullValuesFromObject({
          ...action.meetingProperties,
          ...action.companyProperties,
          ...action.userProperties,
        }),
        identity: action.identity,
        includeInAnalytics: action.includeInAnalytics,
      }));

      await Action.insertMany(formattedActions);
    }
  } catch (error) {
    logger.error("Error processing actions in goal", {
      error: error.message,
      stack: error.stack,
      actionsCount: actions.length,
    });
    throw error;
  }
};

module.exports = {
  filterNullValuesFromObject,
  normalizePropertyName,
  goal,
};
