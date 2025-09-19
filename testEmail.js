import { sendMail } from './utils/Email.js';

sendMail('aansarana@gmail.com', 'Test Email', '<h1>Hello</h1>')
  .then(() => console.log('✅ Email sent'))
  .catch(err => console.error('❌ Email failed:', err));
