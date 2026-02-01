# Verification Walkthrough

## 1. Executives Section
1. Navigate to the **Executives** page.
2. Ensure you see the list of executives.
3. Login as an Admin.
4. Hover over an executive card. You should see an **Edit** button (pencil icon).
5. Click **Edit**. The modal should open.
6. Try updating a name or role. Click **Save**.
7. Try adding a new executive using the **Add Executive** button at the top.

## 2. Admin Panel - Users Tab
1. Navigate to the **Admin Dashboard** (`/admin`).
2. Click on the new **Users** tab.
3. Enter a name in the search bar (e.g., your own name) and click **Search**.
4. You should see a list of users matching the name.
5. Toggle the **Make Admin** / **Revoke Admin** button.
   - **Note**: Modifying your own admin status might lock you out! Be careful.

## 3. News Section Cleanup
1. Go to the **News** tab in the Admin Panel.
2. Look for the "Cleanup Old News (2 Weeks+)" button in the header.
3. Click it and confirm the dialog.
4. Go to the **Home** page or **News** section.
5. Verify that older news items are gone and only news from the last 2 weeks (or the limit) are shown.

## 4. News Pagination
1. Go to the **News** section on the Home page.
2. If there are more than 4 news items, scroll down.
3. You should see a **Load More Updates** button instead of numbers.
4. Click it to reveal more items.
