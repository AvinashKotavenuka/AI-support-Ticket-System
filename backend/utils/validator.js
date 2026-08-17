// Input validation helper routines

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && re.test(email.trim());
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const validateTicketInput = (title, description) => {
  const errors = [];
  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    errors.push('Ticket title must be at least 5 characters long.');
  }
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Ticket description must be at least 10 characters long.');
  }
  return errors;
};

const validateStatus = (status) => {
  const allowed = ['Open', 'In Progress', 'Resolved', 'Closed'];
  return allowed.includes(status);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateTicketInput,
  validateStatus
};
