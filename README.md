# E-Z Rent To Own storefront prototype

## Run locally

Install Node.js 20+ and run:

```bash
npm install
npm run dev
```

Open the localhost address Vite prints. To generate production static assets run `npm run build`.

## What's included

- Responsive React storefront, using the provided logo.
- Seven product categories and three information pages (including Careers and Contact Us).
- English/Español navigation toggle (some secondary text is currently English only).
- Product editor with required image, title and outright price, plus optional description and in-store weekly price.
- Information editor for About E-Z, Careers, Contact Us.
- Product search and client-side shopping cart.
- Outright-purchase-only messaging; in-store rental messaging.

## Important: prototype limitations

**This is not a deploy-ready commerce backend.** The admin sign-in button enables DEMO mode only; it is NOT secure authentication. Products and information are saved only to that browser's localStorage, not shared between customers or devices. The contact form does not send messages. Checkout is disabled and no payment is collected. The delivery service area is not configured or validated. Do not deploy this prototype as a live store without implementing these features.

For production, connect a hosted database and file storage, secure admin authentication and authorization, a payment processor such as Stripe, inventory/order management, contact form delivery, shipping/tax configuration, and a verified delivery-zone checker. You will need your store's address, service radius/ZIP codes, payment account, and contact destination. Never place admin passwords or payment secret keys in frontend code.

## Rental delivery areas (provided by store)

- Berea store: Berea city only (not Richmond); Rockcastle County and Jackson County, KY. Do **not** interpret this as all of Madison County.
- Irvine store: Estill County, KY (corrected from “Estelle”).
- These are rental delivery service rules, not restrictions on outright online purchases. Rental agreements must be completed in store.
- Outright online purchases should be shipped by mail/carrier with shipping charges paid by the buyer. A real checkout, shipping rates, fulfillment rules and address verification are **not implemented** in this frontend prototype.
- County/city eligibility must be validated server-side before launching a rental delivery checker; postal codes alone are insufficient to reliably identify city/county boundaries.
