# Users and roles

Everyone who signs in to Vessel needs a user account on that server. This page covers the built-in admin account, managing users, roles and permissions, and how sign-in sessions work.

User management lives in **Settings ▸ Users**. The page has two tabs: **Users** and **Roles**.

## The admin account

The first time the server starts, it creates one account:

| Field | Value |
| --- | --- |
| Username | `admin` |
| Password | `admin` |
| Email | `admin@example.com` |

When you sign in with `admin` and `admin`, Vessel opens **Update Admin Password** and will not continue until you set a new one.

1. Enter a **New password**. It cannot be `admin`.
2. Enter it again in **Confirm new password**.
3. Click **Update password**. Vessel saves it and signs you in with the new password.

> [!WARNING]
> On every start, the server checks for a user named `admin`. If there is none, because it was renamed or deleted, it creates it again with the password `admin`. Keep a user called `admin` with a strong password so that nobody can sign in with the default.

## Manage users

The **Users** tab shows **User Management**, a list with **Username**, **Email**, **Created At** and **Updated At** for every account.

### Add a user

1. Open **Settings ▸ Users**.
2. Click **Add User**.
3. Fill in **Username**, **Email** and **Password**. All three are required.
4. Click **Save**.

Usernames and email addresses must be unique. The new user signs in with the username in the **ID** field of the sign-in screen.

### Edit a user

1. Open the menu at the end of the user's row and choose **Edit**.
2. Change **Username** or **Email** as needed.
3. To set a new password, type it in **Password**. Leave it blank to keep the current one.
4. Click **Save**.

Changing a password does not sign the user out of browsers where they are already signed in. Those sessions stay valid until they expire or the user logs out.

### Delete a user

1. Open the menu at the end of the user's row and choose **Delete**.
2. Confirm with **Delete**.

Deleting cannot be undone. Vessel does not stop you from deleting your own account, so check the row before you confirm.

## Roles and permissions

A role is a named set of permissions, such as `operator` or `viewer`. You assign roles to users, and a user can have several roles.

> [!IMPORTANT]
> In the current version, roles and permissions are stored and can be assigned, but the server does not check them yet. Every signed-in user can use every feature, whatever roles they have. Only create accounts for people you trust with full access.

### Create a role

1. Open **Settings ▸ Users** and switch to the **Roles** tab.
2. Click **Add Role**.
3. Enter a **Role Name**. It must be unique.
4. Optionally add a **Description**.
5. Click **Select permissions...** and tick the permissions the role should have. Type in the search box to filter the list.
6. Click **Save**.

The **Role Management** list shows each role's **Name**, **Description** and **Permissions**. Use the row menu to **Edit** or **Delete** a role. Deleting a role removes it from every user that had it.

### Assign roles to a user

Roles are assigned from the user's edit dialog. The **Roles** field appears only when you edit an existing user, not while you create one.

1. On the **Users** tab, open the user's row menu and choose **Edit**.
2. Click the **Roles** field (it reads **Select roles...** or the number selected).
3. Click a role to assign it. Click an assigned role again to remove it.

Each click is saved right away and confirmed with a message such as `Role "operator" has been assigned.` You do not need to click **Save** for role changes.

### Permission list

The server creates these permissions on startup. Each name has the form `area:action`.

| Permission | Allows |
| --- | --- |
| `users:create` | Creating new users |
| `users:read` | Viewing the user list and details |
| `users:update` | Updating user information |
| `users:delete` | Deleting users |
| `users:assign_roles` | Assigning roles to users |
| `roles:create` | Creating new roles |
| `roles:read` | Viewing roles and their permissions |
| `roles:update` | Updating roles and their assigned permissions |
| `roles:delete` | Deleting roles |
| `devices:create` | Creating new devices |
| `devices:read` | Viewing devices |
| `devices:update` | Updating device information |
| `devices:delete` | Deleting devices |
| `entities:create` | Creating new entities |
| `entities:read` | Viewing entities |
| `entities:update` | Updating entity information |
| `entities:delete` | Deleting entities |
| `flows:create` | Creating new flows |
| `flows:read` | Viewing flows |
| `flows:update` | Updating flows |
| `flows:delete` | Deleting flows |

The descriptions describe what each permission is meant to control. As noted above, they are not enforced yet.

## Sign-in sessions

When you sign in, the server gives your browser two tokens:

| Token | Lifetime | Purpose |
| --- | --- | --- |
| Access token | 15 minutes | A JWT sent with every request to prove who you are |
| Refresh token | 30 days | Used to get a new access token when the old one runs out |

You do not need to do anything with them. The client renews the access token in the background shortly before it expires, so you stay signed in for up to 30 days of inactivity.

- **Rotation.** Every renewal replaces the refresh token with a new one. The old one stops working.
- **Reuse detection.** If an old refresh token is ever presented again, for example because it was copied from your browser, the server ends that whole session. You then need to sign in again.
- **Log out.** Choose **Log out** from the user menu at the bottom of the sidebar. The server revokes the session's refresh tokens, so they cannot be used again.
- **Cleanup.** Expired refresh tokens are deleted each time the server starts.

Access tokens are signed with the server's `jwt_secret`. See [Server configuration](configuration#jwt-secret) for how to set it and keep it private.

## Related pages

```cards
Server configuration | configuration | The JWT secret, listen address and database.
Remote access | remote-access | Reach Vessel from other devices safely.
Troubleshooting and FAQ | troubleshooting | Sign-in problems and other common issues.
```
