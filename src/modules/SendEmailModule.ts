import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE || false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
} as SMTPTransport.Options);

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      partialsDir: path.resolve(__dirname, '../resources/partials'),
      defaultLayout: undefined,
    },
    viewPath: path.resolve(__dirname, '../resources/mail'),
    extName: '.hbs',
  })
);

interface IMailOptions {
  from: string;
  to: string[];
  subject: string;
  template: string;
  text: string;
  context: {
    subject: string;
    name?: string;
    link?: string;
    password?: string;
  };
}

interface ProjectIMailOptions {
  to: string[];
  from: string;
  subject: string;
  template: string;
  text: string;
  context: {
    title: string;
    student: {
      name: string;
      last_name: string;
    };
    teacher: {
      name: string;
      last_name: string;
    };
    link: string;
  };
}

export { IMailOptions, ProjectIMailOptions, transporter };
