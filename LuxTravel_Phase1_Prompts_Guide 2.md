


```
Create API routes and final polish:

1. /app/api/contact/route.ts
   - Handle contact form POST
   - Validate inputs
   - Save to Supabase contact_messages

2. Loading and Error states
   - /app/[locale]/loading.tsx
   - /app/[locale]/error.tsx
   - /app/[locale]/not-found.tsx

3. SEO
   - /app/sitemap.ts
   - /app/robots.ts
   - Metadata for all pages

4. Responsive design check
   - Test all components on mobile/tablet/desktop
   - Fix any responsive issues
```

---

### Prompt 14: Testing and Deployment

```
Final testing and deployment prep:

1. Create .env.example with required variables

2. Testing checklist - verify:
   - All pages load
   - All 3 languages work
   - Forms submit correctly
   - Admin CRUD works
   - Images upload
   - Responsive on all devices

3. Build and test:
   npm run build
   npm run start

4. Create README.md with setup instructions

5. Deploy to Vercel:
   - Connect GitHub
   - Add env variables
   - Deploy
```

---

## ✅ Summary Checklist

| Phase | Prompts | What's Created |
|-------|---------|----------------|
| **Setup** | 0-5 | React code reference, Next.js project, Supabase, styles, i18n |
| **Components** | 6-8 | All public components (Header, Hero, Fleet, WhyChooseUs, Gallery, Contact, Footer) |
| **Pages** | 9 | Homepage, Buses page, Bus detail page |
| **Admin** | 10-12 | Auth, Dashboard, Bus/Content/Gallery/Settings management |
| **Polish** | 13-14 | API, loading states, SEO, deployment |

**Total: 15 prompts** (including Prompt 0)

---

## 📝 Quick Tips

- Run **Prompt 0 FIRST** - gives Claude your entire React code
- Claude will remember the code for the whole session
- If Claude forgets, just say "refer to the React code I shared in Prompt 0"
- Test after each Phase before moving on

---

*Document Version: 2.0*
*Total Prompts: 15*
*Estimated Time: 2-3 weeks*
