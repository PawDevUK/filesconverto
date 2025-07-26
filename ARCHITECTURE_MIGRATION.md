# FilesConverto - Architecture Migration Plan

## Overview
Migration from JavaScript/Python-based file conversion to custom C library for better performance, control, and scalability.

## Current Issues Identified & Status

### ✅ **RESOLVED ISSUES**

#### 1. **Double Slash URL Problem** 
- **Location**: `app/components/Header.tsx` line 25
- **Issue**: Route construction causing URLs like `http://localhost:3000//Convert`
- **Solution**: Removed extra `/` from `href={`${baseUrl}${route.href}`}`
- **Status**: ✅ Fixed

#### 2. **Base URL Construction**
- **Location**: `app/hooks/baseURL.ts`
- **Issue**: Missing `//` between protocol and host
- **Solution**: Added proper URL format `${window.location.protocol}//${window.location.host}`
- **Status**: ✅ Fixed

#### 3. **PDF Converter Removal**
- **Action**: Removed `pdf-converter` JavaScript package
- **Reason**: Migrating to custom C library for file conversion
- **Status**: ✅ Completed

### 🔍 **REMAINING ISSUES TO ADDRESS**

#### 4. **Price Plan Data Mismatch**
- **Location**: `app/store/data.tsx` vs `app/components/ui/card.tsx`
- **Issue**: Standard plan shows `price: 7.50` but displays `$49/month`
- **Status**: ❌ Needs fixing

#### 5. **Unused Props**
- **Location**: `app/components/Header.tsx`
- **Issue**: `companyName` prop defined but not used
- **Status**: ❌ Needs cleanup

#### 6. **Security Issue in File Upload**
- **Location**: `app/api/uploads/route.ts`
- **Issue**: Direct use of user-provided filenames without sanitization
- **Status**: ❌ Needs fixing

---

## Architecture Planning for C Server Integration

### Communication Options
- [ ] **REST API** (HTTP requests) - Simple implementation, recommended for start
- [ ] **gRPC** - More efficient for binary data, consider for v2
- [ ] **Message Queue** (Redis/RabbitMQ) - For async processing
- [ ] **Unix Sockets** - If running on same machine

### Current Architecture
```
[Next.js Frontend] → [Next.js API Routes] → [JavaScript/Python Processing]
```

### Target Architecture
```
[Next.js Frontend] → [Next.js API Routes] → [Custom C Server] → [File Processing]
```

---

## Implementation Todo List

### 🚀 **Phase 1: Immediate Fixes**
- [ ] Fix price plan data mismatch in `app/store/data.tsx`
- [ ] Remove unused `companyName` prop from Header component
- [ ] Add file name sanitization in upload API
- [ ] Update Button component className handling for undefined values

### 🔧 **Phase 2: C Server Development**
- [ ] Complete custom C library for file conversion
- [ ] Create C server with HTTP API endpoints
  - [ ] `/health` - Health check endpoint
  - [ ] `/convert` - File conversion endpoint
  - [ ] `/status/{id}` - Conversion status checking
- [ ] Test file conversion functionality
- [ ] Implement comprehensive error handling in C server
- [ ] Add logging and monitoring
- [ ] Create Docker containerization

### 🔗 **Phase 3: Integration Architecture**
- [ ] Design communication protocol (REST recommended)
- [ ] Plan file storage strategy
  - [ ] Option A: Shared filesystem
  - [ ] Option B: Object storage (S3, etc.)
  - [ ] Option C: Temporary in-memory processing
- [ ] Decide on processing model
  - [ ] Synchronous conversion (for small files)
  - [ ] Asynchronous conversion (for large files)
- [ ] Create deployment strategy

### 💻 **Phase 4: Next.js Integration**
- [ ] Update `app/api/uploads/route.ts` to communicate with C server
```typescript
// New structure:
export async function POST(request: Request) {
  // 1. Receive file from frontend
  // 2. Validate and sanitize
  // 3. Send to C server
  // 4. Return conversion result or job ID
}
```
- [ ] Modify `app/hooks/useFileUpload.tsx` hook for C server integration
- [ ] Add conversion progress tracking
- [ ] Implement error handling for C server failures
- [ ] Add timeout handling for long conversions
- [ ] Create retry mechanisms

### 🎨 **Phase 5: Frontend Updates**
- [ ] Update progress bars for async operations
- [ ] Add conversion status polling for async jobs
- [ ] Implement real-time progress updates
- [ ] Add user feedback for server errors
- [ ] Create conversion history/queue view
- [ ] Add download management

### 🚀 **Phase 6: Production Readiness**
- [ ] Implement health checks for C server
- [ ] Add load balancing for multiple C server instances
- [ ] Set up monitoring and alerting
- [ ] Plan backup/failover strategy
- [ ] Security hardening for C server communication
- [ ] Performance optimization and caching
- [ ] Rate limiting and abuse prevention

---

## Frontend Todo List (From Original README)

### 🎨 **UI/UX Improvements**
- [ ] Create a progress bar using Tailwind CSS (integrate with C server)
- [ ] Create 'How to use' section with 'Step 1,2,3'
- [ ] Create 'File Types' section with cards for each file type
- [ ] Create 'About' section explaining service features
- [ ] Update Footer with relevant links and information
- [ ] Change main title text from 'Convert Files Effortlessly' to 'Files Converter'
- [ ] Remove temporarily unused header links
- [ ] Create logic to recognize free users
- [ ] Implement the dropzone widget idea (bottom corner)

### 🔐 **User Management**
- [ ] Complete Login page functionality
- [ ] Add user authentication system
- [ ] Implement user session management
- [ ] Create user dashboard
- [ ] Add file conversion history
- [ ] Implement premium user features

---

## Technical Questions to Resolve

### 🤔 **Architecture Decisions**
- [ ] **Deployment**: Will C server be containerized (Docker)? **Recommended: Yes**
- [ ] **Storage**: Shared filesystem or object storage? **Evaluate based on scale**
- [ ] **Processing**: Synchronous or asynchronous conversions? **Hybrid approach**
- [ ] **Scaling**: Single instance or multiple C server instances? **Start single, plan for multiple**

### 🚨 **Error Handling Strategy**
- [ ] What happens if C server is down? **Fallback message + retry**
- [ ] How to handle partial conversion failures? **Detailed error reporting**
- [ ] Retry strategy for failed conversions? **Exponential backoff**
- [ ] File cleanup after conversion? **TTL-based cleanup**

### 🔒 **Security Considerations**
- [ ] File upload validation and sanitization
- [ ] C server communication security (TLS)
- [ ] File storage security and access control
- [ ] Rate limiting and abuse prevention
- [ ] User data privacy and GDPR compliance

---

## File Structure Updates Needed

### New Files to Create
```
app/
├── api/
│   ├── convert/           # New C server integration
│   │   └── route.ts
│   ├── status/           # Conversion status checking
│   │   └── [id]/
│   │       └── route.ts
│   └── health/           # C server health check
│       └── route.ts
├── lib/
│   ├── cserver.ts        # C server client
│   ├── fileUtils.ts      # File validation/sanitization
│   └── constants.ts      # Configuration constants
└── types/
    ├── conversion.ts     # Conversion-related types
    └── api.ts           # API response types
```

### Files to Update
- `app/api/uploads/route.ts` - Integrate with C server
- `app/hooks/useFileUpload.tsx` - Add C server support
- `app/components/Hero.tsx` - Update for new conversion flow
- `app/store/data.tsx` - Fix price plan data
- `app/components/Header.tsx` - Remove unused props

---

## Timeline Estimate

### Week 1-2: Foundation
- Complete immediate fixes
- Finish C library development
- Basic C server with REST API

### Week 3-4: Integration
- Next.js API integration
- Frontend updates for new flow
- Basic error handling

### Week 5-6: Enhancement
- Progress tracking
- User experience improvements
- Testing and debugging

### Week 7-8: Production
- Performance optimization
- Security hardening
- Deployment preparation

---

## Success Metrics

### Performance
- [ ] Conversion speed improvement (measure vs current)
- [ ] Memory usage optimization
- [ ] Support for larger files

### Reliability
- [ ] 99.9% uptime target
- [ ] Error rate < 1%
- [ ] Average response time < 5s for small files

### User Experience
- [ ] Improved conversion success rate
- [ ] Better progress feedback
- [ ] Reduced waiting times

---

*Last Updated: July 26, 2025*
*Next Review: Weekly during development phases*
