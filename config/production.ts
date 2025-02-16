export default {
    app: {
        port: process.env.PORT || 8080,
    },
    db: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/bloqs_prod',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 's3cr3t',
    },
    mail: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        from: process.env.SMTP_FROM_EMAIL,
    },
};
