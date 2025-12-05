# ---
**Document Version:** 1.0  
**Created by:Harisankar**
**Last Review:** December 5, 2025  
**Maintained By:** Uniqnex360 Development Team  
**License:** MIT

# PLMP_FE Project Documentation

## Project Overview & Introduction

PLMP_FE is the frontend for a Product Lifecycle Management Platform (PLMP) designed to streamline product, category, brand, and user management for organizations. It provides a comprehensive admin and super-admin interface for managing products, categories, brands, users, and integrations (e.g., QuickBooks). The tool aims to simplify complex product data flows, user roles, and business processes in a scalable, maintainable way.

### Core Purpose
- Centralize and simplify product, category, and brand management
- Enable role-based access for admins and super-admins
- Integrate with external accounting systems (e.g., QuickBooks)
- Provide robust data import/export and history tracking

### High-Level Problem Solved
- Reduces manual product data management
- Ensures data consistency and auditability
- Supports multi-tenant (client) management for super-admins

---

## Technical Stack

### Frontend Technologies
- React (functional components, hooks)
- CSS Modules for component-level styling
- Axios for API requests




## System Architecture

### Cloud Architecture Diagram Description
- The frontend (PLMP_FE) is deployed as a static site on  vercel
- Communicates with a RESTful backend API (https://plmp-be-f3qy.onrender.com/api)
- Authentication is handled via API tokens/JWTs

### Deployment Architecture
- Static build output from `npm run build`
- Deployed to a static hosting provider

### Networking Overview
- All API calls routed via Axios to backend endpoints
- CORS is enabled on backend


### Service-to-Service Interactions
- Frontend interacts with backend REST API
- Integrates with QuickBooks via backend

### Data Flow Description
- User actions trigger API calls (CRUD for products, categories, brands, users)
- Data fetched and rendered in tables/forms
- Import/export via CSV

---

## Entity & Data Model Documentation

### List of All Entities
- Product
- Category (multi-level)
- Brand
- Vendor
- User
- Client (for super-admin)
- Price
- Variant
- History

### Entity-Relationship Descriptions
- Products belong to Categories and Brands
- Users have roles (admin, super-admin)
- Super-admins manage multiple Clients
- Price and Variant are linked to Products

### Schemas, Attributes, Constraints
- See `src/components/adminFlow/products/ProductDetail.js`, `BrandList.js`, `CategoryTable.js`
- Product: id, name, categoryId, brandId, price, variants, status
- Category: id, name, parentId, level
- Brand: id, name, vendorId
- User: id, name, email, role, clientId




## API Documentation

### Full Endpoint List
- See `src/utils/axiosConfig.js` for base URL and usage
- Endpoints are called via Axios in component files (e.g., `ProductList.js`, `BrandList.js`)

### HTTP Methods
- GET: fetch lists/details
- POST: create entities, import data
- PUT/PATCH: update entities
- DELETE: remove entities

### Request/Response Examples
- See API usage in component files (e.g., `ProductList.js`)

### Authentication/Authorization
- Token-based (JWT) via headers
- See `ProtectedRoute.js` for route protection

### Error Codes
- Handled via API responses; see modal usage in `ApiResponseModal.js`

### Pagination/Filtering Rules
- Implemented in table components (e.g., `CategoriesTable.js`, `ProductList.js`)

### Webhooks
- Not applicable

---

## Environment Setup

### Local Development Environment
- Node.js >= 16.x
- npm >= 8.x
- Clone repo, then:
  ```bash
  npm install
  npm start
  ```

### Environment Variables List & Purpose
- Not present by default; if needed, create `.env` for API base URLs, etc.

### Configurations for Dev/Staging/Production
- Adjust API endpoints in `axiosConfig.js` as needed

### Docker Setup
- Not present in this repo

---

## Database Backups & Disaster Recovery
- Not applicable (frontend only)

---

## Deployment & CI/CD

### Pipeline Steps
- Build: `npm run build`
- Deploy: Upload `build/` to static host

### Automatic Tests
- Run with `npm test`
- See `App.test.js`, `setupTests.js`

### Build → Release → Deploy Lifecycle
- Build locally or in CI
- Deploy static files

### Versioning
- Managed via `package.json`

---

## Security Considerations

### API Security
- All API calls require authentication tokens

### Secrets Management
- Do not commit secrets; use environment variables if needed
# REACT_APP_IP:Use based on the requirement(production/development)
### Access Control
- Route protection via `ProtectedRoute.js`

### Data Encryption
- Handled by backend/API



## Maintenance & Observability

### Logging
- Console logging for debugging




## Appendices

### Glossary
- **Admin**: User with access to product/category/brand management
- **Super-admin**: User managing multiple clients/tenants
- **Client**: Organization managed by super-admin
- **Variant**: Product variation (e.g., size, color)

### Troubleshooting
- **Common Errors**: API failures, CORS issues, missing tokens
- **Fixes**: Check API base URL, ensure backend is running, verify authentication

---

For further details, see the `README.md` and key files in `src/components/` and `src/utils/`.
