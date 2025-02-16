import nodemailer from 'nodemailer';
import { injectable } from 'tsyringe';
import { InternalServerError } from '../../../../utils/http-error.util';
import config from 'config';

@injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.get<string>('mail.host'),
            port: config.get<number>('mail.port'),
            secure: config.get<boolean>('mail.secure'),
            auth: {
                user: config.get<string>('mail.auth.user'),
                pass: config.get<string>('mail.auth.pass'),
            },
        });
    }

    async sendRentDropoffEmail(receiverEmail: string, lockerId: string, code: string) {
        const mailOptions = {
            from: config.get<string>('mail.from'),
            to: receiverEmail,
            subject: 'Your Package Has Been Dropped Off',
            html: `
                <h1>Your Package Has Been Dropped Off</h1>
                <p>Your package has been dropped off and is ready for pickup.</p>
                <p><strong>Locker ID:</strong> ${lockerId}</p>
                <p><strong>Pickup Code:</strong> ${code}</p>
                <p>Please use this code to pick up your package from the locker.</p>
                <p>Note: Keep this code secure and do not share it with others.</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error: any) {
            throw new InternalServerError(`Failed to send email: ${error.message}`);
        }
    }

    async notifyRentDelivered(receiverEmail: string, code: string) {
        const mailOptions = {
            from: config.get<string>('mail.from'),
            to: receiverEmail,
            subject: 'Your Package Has Been Picked Up',
            html: `
                <h1>Your Package Has Been Picked Up</h1>
                <p>Your package with <strong>code:</strong> ${code} has been picked up.</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error: any) {
            throw new InternalServerError(`Failed to send email: ${error.message}`);
        }
    }
}
