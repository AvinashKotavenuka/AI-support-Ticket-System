// Template-based AI response suggestion generator based on ticket context

const RESPONSE_TEMPLATES = {
  'Billing_Negative': "We sincerely apologize for the billing discrepancy. Our finance desk is reviewing your transaction ID and will process an immediate refund or payment verification within 24-48 hours.",
  'Billing_Neutral': "Thank you for contacting billing support. We have verified your account information and will provide the requested invoice breakdown shortly.",
  'Billing_Positive': "Thank you for reaching out to billing! We are glad to assist you with your plan upgrade or payment adjustments.",

  'Technical_High': "We apologize for the critical technical malfunction. Our senior engineering team has been alerted to review the system logs and deploy an urgent patch.",
  'Technical_Medium': "Thank you for reporting this issue. We have logged the error details with our engineering team for troubleshooting.",
  'Technical_Low': "Thank you for reaching out. We are reviewing your technical question and will provide troubleshooting guidance shortly.",

  'Account_High': "We recognize that you are locked out or having authentication trouble. We have initiated a secure credential verification protocol to help you regain access safely.",
  'Account_Neutral': "Hello, we have received your account modification request. Please confirm your registered email to proceed with the update.",
  'Account_Positive': "Thank you for contacting us! We are glad to assist you in managing your profile and team privileges.",

  'Delivery_High': "We apologize for the delivery issue. We have initiated an urgent courier trace with our logistics coordinator to locate your parcel immediately.",
  'Delivery_Neutral': "Thank you for your delivery query. We have tracked your shipment and will provide the updated delivery timetable.",

  'Product_Positive': "Thank you so much for your interest and positive feedback! We have shared your request with our product specialists and attached pricing options.",
  'Product_Negative': "Thank you for sharing your feedback. We are continuously improving our product capabilities and will address your concerns promptly.",
  'Product_Neutral': "Thank you for your feature inquiry. We will provide detailed product documentation and usage guidance shortly.",

  'General_Neutral': "Thank you for contacting customer support. A support representative will review your request and reply shortly.",
  'General_Positive': "Thank you for your kind words! Please let us know if there is anything else our team can assist you with."
};

const generateSuggestedResponse = (category, priority, sentiment) => {
  const catSentKey = `${category}_${sentiment}`;
  if (RESPONSE_TEMPLATES[catSentKey]) {
    return RESPONSE_TEMPLATES[catSentKey];
  }

  const catPrioKey = `${category}_${priority}`;
  if (RESPONSE_TEMPLATES[catPrioKey]) {
    return RESPONSE_TEMPLATES[catPrioKey];
  }

  return `Thank you for contacting our ${category} support desk. We have classified this request as ${priority} priority and our dedicated agents will assist you promptly.`;
};

module.exports = {
  generateSuggestedResponse
};
