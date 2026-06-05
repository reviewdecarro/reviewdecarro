# Spec — Admin Section: Restricted Page for Admin Users

## 1. Context

The application needs an admin section that can only be accessed by authenticated users with the `admin` role.

This section will be the foundation for future administrative features such as managing users, reviews, forum content, reports, moderation, and internal platform settings.

For this first version, the goal is to create the initial front-end structure for the admin section with proper access control.

---

## 2. Goal

Create an admin section with a protected page that:

- Can only be accessed by authenticated users.
- Can only be accessed by users with the `admin` role.
- Redirects unauthenticated users to the login page.
- Blocks authenticated users without admin permissions.
- Provides a scalable structure for future admin pages.

---

## 3. Scope

### Included

- Create an admin route/page.
- Protect access based on authentication.
- Protect access based on role authorization.
- Validate whether the authenticated user has the `admin` role.
- Create a base layout for the admin area.
- Create a loading state while session/permission is being checked.
- Create an access denied state.
- Create basic admin navigation if it makes sense.
- Ensure the admin page is not shown to users without permission.

### Out of scope

- Creating full management features.
- Creating user CRUD.
- Creating review CRUD.
- Creating forum CRUD.
- Changing backend authentication rules.
- Changing the user model in the database, unless the role does not exist yet.
- Creating a real analytics dashboard.
- Creating granular permissions beyond `admin`.

---

## 4. Assumptions

- The project already has authentication.
- The authenticated user can be identified on the front end.
- The current session/token exposes the user role in some way.
- The expected role for admin access is `admin`.
- If the project uses a different role format, adapt to the existing pattern.
- If the user role is not available on the front end, document the required backend/session adjustment before completing the feature.

---

## 5. Access Rule

The admin route must follow this rule:

```txt
Unauthenticated user
→ redirect to /login

Authenticated user without admin role
→ block access and show an access denied page or redirect to /

Authenticated user with admin role
→ allow access to the admin area