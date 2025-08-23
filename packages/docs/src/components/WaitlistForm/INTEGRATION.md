# WaitlistForm Integration Guide

## Quick Start

The `WaitlistForm` component has been successfully created and is ready for integration throughout the Radon IDE website.

### Integration into Existing Pages

#### 1. Landing Page Hero Section

Add to `/packages/docs/src/components/Hero/StartScreen/index.tsx`:

```tsx
import WaitlistForm from "@site/src/components/WaitlistForm";

// Add after existing buttons in the hero section
<WaitlistForm
  variant="hero"
  title="Join the Revolution"
  subtitle="Get early access to game-changing React Native development tools"
  buttonText="Request Early Access"
/>
```

#### 2. Footer Newsletter Signup

Add to any footer component:

```tsx
import WaitlistForm from "@site/src/components/WaitlistForm";

<WaitlistForm
  variant="compact"
  title="Stay Updated"
  subtitle="Get the latest updates on Radon IDE"
  placeholder="Enter email for updates"
  buttonText="Subscribe"
/>
```

#### 3. Pricing Page CTA

Add to `/packages/docs/src/components/Pricing/index.tsx`:

```tsx
import WaitlistForm from "@site/src/components/WaitlistForm";

// Add before or after pricing plans
<WaitlistForm
  title="Try Before You Buy"
  subtitle="Join our beta program for free early access"
  buttonText="Get Beta Access"
/>
```

#### 4. Contact Page Lead Capture

Add to `/packages/docs/src/pages/contact.tsx`:

```tsx
import WaitlistForm from "@site/src/components/WaitlistForm";

// Add as an additional contact method
<WaitlistForm
  title="Product Updates"
  subtitle="Stay informed about new features and improvements"
  buttonText="Subscribe to Updates"
/>
```

### Custom Submit Handler

For production use, integrate with your email service:

```tsx
const handleWaitlistSubmit = async (email: string) => {
  try {
    // Example with your API
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        source: 'website_waitlist',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }

    // Optional: Track with analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'waitlist_signup', {
        event_category: 'engagement',
        event_label: email
      });
    }
  } catch (error) {
    console.error('Waitlist signup error:', error);
    throw error; // Re-throw to trigger error state in component
  }
};

<WaitlistForm
  onSubmit={handleWaitlistSubmit}
  // ... other props
/>
```

### Analytics Integration

Track form interactions:

```tsx
import { track } from "@vercel/analytics";

const handleWaitlistSubmit = async (email: string) => {
  // Track the signup
  track('waitlist_signup', {
    email_domain: email.split('@')[1],
    form_location: 'hero_section'
  });
  
  // Your API call here
  await submitToAPI(email);
};
```

### A/B Testing

Test different variants and copy:

```tsx
// Example with feature flags or random selection
const variant = useFeatureFlag('waitlist_variant') || 'default';
const copy = variants[variant];

<WaitlistForm
  title={copy.title}
  subtitle={copy.subtitle}
  buttonText={copy.buttonText}
  variant={variant}
/>
```

## Best Practices

1. **Placement**: Use the `hero` variant for main CTAs, `default` for dedicated sections, and `compact` for footers/sidebars

2. **Copy**: Customize the title, subtitle, and button text to match the context and value proposition

3. **Analytics**: Always track form submissions and conversion rates

4. **Error Handling**: Provide clear error messages and fallback behavior

5. **Success Flow**: Consider redirecting to a thank you page or showing additional CTAs after signup

## Testing

Visit `/waitlist` to test all variants and interactions before deploying to production.

## Security Considerations

- Email validation is performed client-side for UX, but always validate server-side
- Consider implementing rate limiting on your API endpoint
- Add CSRF protection if using cookies for authentication
- Sanitize email addresses before storing in your database

## Accessibility

The component is fully accessible and includes:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast color support
- Focus management

## Browser Support

The component works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

1. Choose integration points based on user journey mapping
2. Set up backend API endpoint for email collection
3. Configure email service (Mailchimp, SendGrid, etc.)
4. Implement analytics tracking
5. A/B test different variants and copy
6. Monitor conversion rates and optimize