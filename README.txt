E-Z RENT TO OWN — ADMIN CENTER FRONTEND UPGRADE

FILES TO REPLACE / ADD IN YOUR EXISTING GITHUB PROJECT:
1. Replace src.jsx with this src.jsx (same folder as your current src.jsx).
2. Replace style.css with this style.css.
3. ADD AdminCenter.jsx in the SAME folder as src.jsx.
4. Keep your existing supabase.js, package.json, index.html, assets, and logo unchanged.
5. Commit all three files together, then check Vercel deployment logs.

WHAT THIS VERSION INCLUDES:
- Responsive admin workspace with role-specific sections
- Support ticket list/conversations, status and priority controls
- Order fulfillment status and tracking fields
- Store inventory quantity editing and low-stock indicators
- Customer directory, store locations, staff role management (owner), notifications, activity logs
- Search and CSV export for visible records
- Dashboard overview based on actual accessible database rows
- Customer support creation form hidden for staff
- Existing storefront, cart, login and customer account features preserved

IMPORTANT LIMITATIONS / SECURITY REVIEW:
- This is a FRONTEND upgrade, not a complete production launch or 19-feature implementation.
- The current database trigger protect_support_ticket_fields() may still reject updates from support-role staff if it calls is_support_admin() (owner/manager only). Test and fix the backend before assigning support employees.
- Existing Supabase RLS policies need a role-by-role security review; UI hiding is not a security boundary.
- Order fields, notification update permissions and old policies need server-side restrictions and testing.
- Order/payment processing and shipping labels are NOT connected. Fulfillment controls only edit records.
- Counts are limited to up to 1,000 accessible rows; not complete business analytics.
- Staff creation/invitation, advanced ticket assignment/notes/history, bulk product editing, real-time alerts, advanced analytics and full exports are NOT yet implemented.
- Product image storage policy and other Supabase permissions must be tested with each staff role.
- Do not deploy staff accounts to production until permissions are verified.
