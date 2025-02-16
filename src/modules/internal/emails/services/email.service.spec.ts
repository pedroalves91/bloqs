import nodemailer from 'nodemailer';
import { EmailService } from './email.service';
import { InternalServerError } from '../../../../utils/http-error.util';
import config from 'config';

jest.mock('nodemailer');
jest.mock('config');

describe('EmailService', () => {
    let emailService: EmailService;
    let sendMailMock: jest.Mock;

    beforeEach(() => {
        sendMailMock = jest.fn();
        (nodemailer.createTransport as jest.Mock).mockReturnValue({
            sendMail: sendMailMock,
        });

        emailService = new EmailService();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('sendRentDropoffEmail', () => {
        it('should send an email successfully', async () => {
            sendMailMock.mockResolvedValue({});

            await expect(
                emailService.sendRentDropoffEmail('receiver@mail.com', 'locker123', 'code123')
            ).resolves.not.toThrow();

            expect(sendMailMock).toHaveBeenCalledWith({
                from: config.get('mail.from'),
                to: 'receiver@mail.com',
                subject: 'Your Package Has Been Dropped Off',
                html: expect.stringContaining('Your package has been dropped off'),
            });
        });

        it('should throw an InternalServerError if email sending fails', async () => {
            sendMailMock.mockRejectedValue(new Error('SMTP Error'));

            await expect(
                emailService.sendRentDropoffEmail('receiver@mail.com', 'locker123', 'code123')
            ).rejects.toThrow(new InternalServerError('Failed to send email: SMTP Error'));
        });
    });

    describe('notifyRentDelivered', () => {
        it('should send a notification email successfully', async () => {
            sendMailMock.mockResolvedValue({});

            await expect(emailService.notifyRentDelivered('receiver@mail.com', 'code123')).resolves.not.toThrow();

            expect(sendMailMock).toHaveBeenCalledWith({
                from: config.get('mail.from'),
                to: 'receiver@mail.com',
                subject: 'Your Package Has Been Picked Up',
                html: expect.stringContaining('Your Package Has Been Picked Up'),
            });
        });

        it('should throw an InternalServerError if email sending fails', async () => {
            sendMailMock.mockRejectedValue(new Error('SMTP Error'));

            await expect(emailService.notifyRentDelivered('receiver@mail.com', 'code123')).rejects.toThrow(
                new InternalServerError('Failed to send email: SMTP Error')
            );
        });
    });
});
