# DirectNest - Real Estate Marketplace

**"Find Property. Connect Directly."**

DirectNest is a production-ready, full-stack real estate marketplace that eliminates brokerage fees by connecting customers directly with verified builders and property owners.

## 🎯 Key Features

### For Customers
- **Zero Brokerage**: Direct connection with property owners
- **Advanced Search**: Filter by city, type, price, bedrooms, amenities
- **Favorites**: Save properties for later viewing
- **Enquiries**: Send enquiries directly to builders
- **Site Visits**: Schedule and manage property visits
- **Reviews**: Rate properties and builder profiles
- **Reports**: Flag suspicious listings for admin review
- **Notifications**: Real-time updates on enquiries and site visits

### For Builders
- **Provider Profiles**: Company information, GSTIN, experience
- **Property Management**: Create, edit, submit properties for verification
- **Image & Document Upload**: Multiple images with primary selection
- **Enquiry Management**: Respond to customer enquiries
- **Site Visit Scheduling**: Confirm, reject, or reschedule visits
- **Status Tracking**: Monitor verification status in real-time

### For Admins
- **Dashboard**: System-wide statistics and metrics
- **User Management**: View, suspend, activate users
- **Provider Verification**: Approve/reject builder profiles with notes
- **Property Moderation**: Review and approve/reject property listings
- **Report Handling**: Review and resolve customer reports
- **Comprehensive Audit**: Full visibility into platform activity

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.4.1 (Java 17+)
- **Security**: Spring Security with Stateless JWT Authentication
- **Database**: MySQL 8+ with Spring Data JPA
- **Validation**: Jakarta Validation API
- **API Documentation**: SpringDoc OpenAPI 3 (Swagger)
- **JWT Library**: JJWT 0.12.6
- **Build Tool**: Maven 3.9+

### Frontend
- **Framework**: React 18 with Vite 6
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios with JWT interceptors
- **Notifications**: React Toastify
- **Icons**: React Icons

### Database Schema
14 relational tables with foreign keys and indexes:
- `users`, `provider_profiles`, `provider_documents`
- `properties`, `property_images`, `property_documents`, `property_amenities`
- `amenities`, `favorites`, `enquiries`, `site_visits`
- `notifications`, `reviews`, `property_reports`

## 📁 Project Structure

```
DirectNest/
├── backend/                    # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/directnest/
│   │   │   │   ├── admin/      # Admin dashboard & moderation
│   │   │   │   ├── amenity/    # Property amenities
│   │   │   │   ├── auth/       # Authentication & registration
│   │   │   │   ├── builder/    # Provider profiles & verification
│   │   │   │   ├── common/     # Shared DTOs & utilities
│   │   │   │   ├── config/     # Security, CORS, file storage
│   │   │   │   ├── enquiry/    # Customer enquiries
│   │   │   │   ├── exception/  # Global exception handling
│   │   │   │   ├── favorite/   # Customer favorites
│   │   │   │   ├── notification/ # Real-time notifications
│   │   │   │   ├── property/   # Property CRUD & search
│   │   │   │   ├── report/     # Property reporting
│   │   │   │   ├── review/     # Property & provider reviews
│   │   │   │   ├── security/   # JWT filters & UserPrincipal
│   │   │   │   ├── sitevisit/  # Site visit scheduling
│   │   │   │   └── user/       # User profile management
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       └── application-test.properties
│   │   └── test/java/com/directnest/
│   │       ├── DirectNestApplicationTests.java
│   │       └── DirectNestIntegrationTests.java
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── api/                # Axios API clients
│   │   │   ├── adminApi.js
│   │   │   ├── authApi.js
│   │   │   ├── builderApi.js
│   │   │   ├── enquiryApi.js
│   │   │   ├── favoriteApi.js
│   │   │   ├── notificationApi.js
│   │   │   ├── propertyApi.js
│   │   │   ├── reportApi.js
│   │   │   ├── reviewApi.js
│   │   │   └── siteVisitApi.js
│   │   ├── components/
│   │   │   ├── common/         # Reusable UI components
│   │   │   ├── property/       # Property-specific components
│   │   │   └── provider/       # Provider-specific components
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── CustomerLayout.jsx
│   │   │   ├── BuilderLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── public/         # Home, search, property details
│   │   │   ├── auth/           # Login, register
│   │   │   ├── customer/       # Customer dashboard & features
│   │   │   ├── builder/        # Builder dashboard & properties
│   │   │   └── admin/          # Admin moderation & reports
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher (tested with JDK 26)
- **MySQL**: Version 8.0+
- **Node.js**: Version 18+ with npm
- **Maven**: 3.9+ (or use included Maven wrapper)

### Backend Setup

1. **Create MySQL Database**
```sql
CREATE DATABASE directnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Configure Environment Variables** (optional)
```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=directnest
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export JWT_SECRET=your-256-bit-secret-key-here
export JWT_EXPIRATION=86400000
export CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Alternatively, edit `backend/src/main/resources/application.properties` directly.

3. **Build and Run Backend**
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The API will start at `http://localhost:8080`

4. **Run Backend Tests**
```bash
./mvnw test
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure API Base URL**
Edit `frontend/src/api/axios.js` if needed (defaults to `http://localhost:8080/api`)

3. **Run Development Server**
```bash
npm run dev
```

The app will start at `http://localhost:5173`

4. **Build for Production**
```bash
npm run build
```

The optimized bundle will be in `frontend/dist/`

## 🔐 Security Features

### Authentication & Authorization
- **Stateless JWT**: Tokens stored in localStorage with 24-hour expiration
- **Role-Based Access Control**: Three roles (CUSTOMER, BUILDER, ADMIN)
- **Protected Routes**: Frontend and backend route guards
- **Password Encryption**: BCrypt hashing (strength 10)

### Security Measures
- **IDOR Prevention**: Always resolve user ID from JWT SecurityContext
- **Input Validation**: Jakarta Validation on all request DTOs
- **CORS Configuration**: Configurable allowed origins
- **SQL Injection Protection**: JPA Criteria API and parameterized queries
- **XSS Prevention**: React automatic escaping
- **Admin Registration Block**: ADMIN role cannot self-register

### Security Configuration
```properties
# JWT Configuration
app.jwt.secret=${JWT_SECRET:change-in-production}
app.jwt.expiration=${JWT_EXPIRATION:86400000}

# CORS
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173}
```

## 📊 API Documentation

### Swagger UI
Access interactive API documentation at:
```
http://localhost:8080/swagger-ui.html
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Properties (Public)
- `GET /api/properties/search` - Search with filters
- `GET /api/properties/{id}` - Get property details

#### Customer
- `POST /api/customer/favorites/{propertyId}` - Toggle favorite
- `POST /api/customer/enquiries` - Submit enquiry
- `POST /api/customer/site-visits` - Request site visit

#### Builder
- `POST /api/builder/profile` - Create provider profile
- `POST /api/builder/properties` - Create property
- `PUT /api/builder/properties/{id}` - Update property
- `POST /api/builder/properties/{id}/submit` - Submit for verification

#### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `PUT /api/admin/providers/{id}/approve` - Approve provider
- `PUT /api/admin/properties/{id}/approve` - Approve property

## 🔄 Workflows

### Provider Verification Workflow
1. Builder registers and creates provider profile → `PENDING_VERIFICATION`
2. Builder uploads verification documents
3. Admin reviews profile and documents
4. Admin approves → `APPROVED` or rejects → `REJECTED`
5. Only `APPROVED` builders can list properties publicly

### Property Listing Workflow
1. Builder creates property → `DRAFT`
2. Builder uploads images and documents
3. Builder submits for verification → `PENDING_VERIFICATION`
4. Admin reviews property listing
5. Admin approves → `APPROVED` (public) or rejects → `REJECTED`
6. Only `APPROVED` properties appear in public search

### Enquiry & Site Visit Workflow
1. Customer submits enquiry on property
2. Builder receives notification and responds
3. Customer requests site visit with preferred date/time
4. Builder confirms, rejects, or reschedules
5. Both parties receive notifications on status changes

## 🗄️ Database Schema Highlights

### Key Entities
- **User**: Authentication, role, profile information
- **ProviderProfile**: Builder company details, GSTIN, verification status
- **Property**: Title, description, type, price, location, status
- **PropertyImage**: Image URL, primary flag, display order
- **Enquiry**: Customer enquiry with builder response
- **SiteVisit**: Scheduled visit with date/time and status
- **Notification**: Real-time notifications with read status
- **Review**: Property and provider ratings (1-5 stars)

### Indexes
- `users.email` (unique)
- `properties.status`, `properties.city`, `properties.property_type`
- `enquiries.property_id`, `enquiries.customer_id`
- `site_visits.property_id`, `site_visits.status`

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

**Test Coverage**:
- ✅ User registration and login
- ✅ Duplicate email prevention
- ✅ ADMIN role self-registration block
- ✅ Provider profile creation and verification workflow
- ✅ Property listing workflow with approval
- ✅ Public search isolation (draft/pending properties excluded)

### Integration Tests
- H2 in-memory database for test isolation
- Transactional rollback after each test
- Security context authentication simulation
- Real workflow validation (registration → property creation → approval)

## 📝 Environment Profiles

### Development (`application-dev.properties`)
- MySQL database with `ddl-auto=update`
- SQL logging enabled
- File uploads to `../uploads`

### Test (`application-test.properties`)
- H2 in-memory database
- `ddl-auto=create-drop` for clean test state
- Test-specific JWT secret

### Production
- Use environment variables for secrets
- Set `ddl-auto=validate` after initial deployment
- Configure external file storage (S3, Azure Blob, etc.)
- Enable HTTPS and secure CORS origins

## 🎨 Frontend Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch-friendly UI components

### State Management
- React Context for global auth state
- Local state with useState/useEffect
- JWT token in localStorage with auto-refresh

### User Experience
- Loading spinners for async operations
- Toast notifications for success/error feedback
- Form validation with error messages
- Pagination for list views
- Modal dialogs for confirmations
- Empty states with call-to-action

## 🐛 Troubleshooting

### Backend Issues

**Database connection failed**
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `application.properties`
- Ensure database `directnest` exists

**Port 8080 already in use**
- Change port: `server.port=8081` in `application.properties`
- Or kill process: `netstat -ano | findstr :8080` (Windows)

**JWT token expired**
- Login again to get fresh token
- Adjust expiration: `app.jwt.expiration=86400000` (24 hours)

### Frontend Issues

**API calls fail with CORS error**
- Add frontend origin to `app.cors.allowed-origins` in backend
- Restart backend after config change

**White screen / blank page**
- Check browser console for errors
- Verify API base URL in `frontend/src/api/axios.js`
- Ensure backend is running

**Build fails**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node -v` (requires 18+)

## 📄 License

This project is proprietary software developed for DirectNest platform.

## 👥 Support

For technical support or feature requests, contact the development team.

---

**Built with ❤️ using Spring Boot and React**
