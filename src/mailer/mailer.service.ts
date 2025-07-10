import { Injectable,OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService implements OnModuleInit {
  private transporter:nodemailer.Transporter;

  constructor(private readonly configService: ConfigService){}

  onModuleInit() {
     const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    } else {
      nodemailer
        .createTestAccount()
        .then((testAccount) => {
          this.transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
          console.warn(
            'Using Nodemailer test account. Set SMTP credentials in .env for production.',
          );
        })
        .catch((err) => {
          console.error('Failed to create test account', err);
        });
    }
  }
   

  async sendMail(options: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    if (!this.transporter) {
      throw new Error('Transporter not initialized');
    }

    const info = await this.transporter.sendMail({
      from:
        this.configService.get<string>('MAIL_FROM') ||
        'NestBooks <noreply@nestbooks.com>',
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    });
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(
        'Email message sent. Preview it at:',
        nodemailer.getTestMessageUrl(info),
      );
    }
  }
}
