# Security Specification: The Grand Angler's Codex

## 1. Data Invariants
1. A profile document can only be managed (created/updated) by the owner itself. The `userId` must match the authenticated `request.auth.uid`.
2. A habit tracker document is private to the user under their `/profiles/{userId}/habits/{habitId}` sub-collection path.
3. Users cannot modify structural fields of other users' profiles, such as spoofing gold, XP, or level without correct authorization (only their own document, with self-restricted inputs where logical).
4. Timestamp parameters (`lastUpdated`, `timestamp`) should reflect server-verified or ISO consistent values.
5. All document IDs must fit structure constraints (`isValidId`).

## 2. The Dirty Dozen Payloads
We define twelve vulnerability vector payloads that strict rules must reject:
1. **Unauthenticated Read Profile**: Querying multiple users' profiles without logging in.
2. **Identity Spoofing Profile Update**: Editing profile `gold` for another user's `userId`.
3. **Malicious Giant String ID**: Injecting a 2MB string as a subcollection habit document ID.
4. **Incorrect Key Shadow Field Injection**: Crafting an update to `profiles/{userId}` containing `isAdministrator: true` (injecting unverified privilege keys).
5. **Write with Missing Required Key**: Saving a habit without the `category` property.
6. **Self-Elevated Level skipping XP checks**: Artificially updating `level` directly from Level 1 to Level 99 without verified experience gates (or writing rules that do not enforce ownership).
7. **Negative Balance gold update**: Updating `gold` to `-1400` to break purchase boundaries.
8. **Habit complete bypass state tampering**: Setting another user's habit to complete.
9. **Tampering with Codex collection**: Manually unlocking species by writing directly to `codex` subcollection with unearned legendary attributes.
10. **Admin Area Spoofing**: Attempting to read `/admins/` data as an unverified user.
11. **Client-side Timestamp Override**: Setting a creation timestamp that is 5 years in the future inside standard creation parameters instead of synced timestamps.
12. **Malicious SQL/NoSQL Injection inside ID**: Using brackets and operators in a document ID string.

## 3. Test Cases Expectations
All the above payloads MUST return `PERMISSION_DENIED` in Firebase security rules. Only the authenticated owner may query or update their nested sub-collections (`habits`, `codex`, `logs`) adhering to strict validation types.
