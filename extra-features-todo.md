# Extra features:

## Add the ability to add multiple list items with a single with a single request: (Added to this project)

This feature allows users to batch-create multiple list items in one API call, improving efficiency and reducing server requests. It could involve accepting an array of items in the request body, validating each item, and creating them in bulk. This enhances the user experience for scenarios where users need to quickly populate a list.

## Add migrations: (Added To This Project)

Migrations are essential for evolving the database schema in a controlled manner. With migrations, developers can apply version-controlled changes to the database, like adding new tables, altering columns, or inserting initial data, ensuring consistency across different environments. Tools like TypeORM or Sequelize migrations can be used to implement this feature.

## Use some form of a SMTP server to validate emails:

SMTP (Simple Mail Transfer Protocol) is crucial for sending email verification links during user registration. This feature involves configuring an SMTP server or a third-party service like SendGrid or Mailgun to send verification emails to users, ensuring they validate their email addresses before accessing the system. This can enhance security and reduce spam or fake registrations.

## Rate limitations and lockout mechanism:

This feature involves setting limits on how many login attempts a user can make within a specific period. After exceeding the limit, the user account is temporarily locked, preventing further login attempts. This helps protect against brute-force attacks. The user is either auto-unlocked after a cooldown period or needs to reset their password.

## Password Expiration and Rotation:

Expiration: Consider implementing password expiration policies where users must change their passwords periodically (e.g., every 90 days). However, be careful as this can sometimes lead to weaker passwords if not managed well.
Notify Users: Warn users when their password is about to expire and encourage them to change it.

## 2FA using google authenticator:

Two-factor authentication (2FA) adds an extra layer of security to user accounts by requiring users to provide a second form of authentication, such as a time-based one-time password (TOTP) from Google Authenticator. This ensures that even if a password is compromised, the account is still protected by the second factor. Integration with Google Authenticator involves generating a QR code for the user to scan and linking it to their account.
