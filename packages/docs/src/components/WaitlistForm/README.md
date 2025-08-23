# WaitlistForm Component

A reusable, client-side React component for collecting email addresses for waitlists, newsletters, and early access programs.

## Features

- 🎨 **Multiple Variants**: Default, compact, and hero styles
- ✅ **Email Validation**: Built-in email format validation
- 🌍 **Accessible**: ARIA labels and keyboard navigation
- 🎯 **Loading States**: Visual feedback during form submission
- ✨ **Success States**: Animated success confirmation
- 🌙 **Dark Mode**: Automatic theme support
- 📱 **Responsive**: Mobile-friendly design
- 🎛️ **Customizable**: Configurable text, styling, and behavior

## Usage

### Basic Usage

```tsx
import WaitlistForm from "@site/src/components/WaitlistForm";

function MyPage() {
  return (
    <WaitlistForm
      title="Join Our Beta Program"
      subtitle="Get early access to new features"
      buttonText="Get Early Access"
    />
  );
}
```

### Custom Submit Handler

```tsx
const handleWaitlistSubmit = async (email: string) => {
  // Your API call here
  await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
};

<WaitlistForm
  title="Stay Updated"
  onSubmit={handleWaitlistSubmit}
/>
```

### Variants

#### Default Variant
```tsx
<WaitlistForm
  title="Join the Waitlist"
  subtitle="Be the first to know about new features"
/>
```

#### Compact Variant
```tsx
<WaitlistForm
  variant="compact"
  placeholder="Your email for updates"
  buttonText="Subscribe"
/>
```

#### Hero Variant
```tsx
<WaitlistForm
  variant="hero"
  title="Early Access Program"
  subtitle="Be among the first to experience revolutionary tools"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Join the Waitlist"` | Form heading text |
| `subtitle` | `string` | `"Be the first to know about new features and updates."` | Form description text |
| `placeholder` | `string` | `"Enter your email address"` | Input placeholder text |
| `buttonText` | `string` | `"Join Waitlist"` | Submit button text |
| `successMessage` | `string` | `"Thank you! We'll be in touch soon."` | Success confirmation message |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onSubmit` | `(email: string) => Promise<void>` | `undefined` | Custom submit handler |
| `variant` | `"default" \| "compact" \| "hero"` | `"default"` | Visual variant |

## Styling

The component uses CSS modules and CSS custom properties for theming. It automatically supports light/dark themes and is fully responsive.

### CSS Variables Used

- `--swm-navy-light-*` - Text and border colors
- `--swm-purple-light-*` - Accent colors and gradients
- `--swm-navy-dark-*` - Dark mode colors

## States

The component handles three main states:

1. **Input State**: Default form ready for user input
2. **Loading State**: Shows spinner while processing submission
3. **Success State**: Shows confirmation with checkmark and success message

## Accessibility

- Uses semantic HTML form elements
- Includes proper ARIA labels
- Supports keyboard navigation
- Provides clear error messages
- Visual feedback for all interactions

## Integration Examples

### In Landing Page Hero
```tsx
<section className="hero">
  <h1>Revolutionary Development Tools</h1>
  <WaitlistForm
    variant="hero"
    title="Get Early Access"
    subtitle="Join thousands of developers already using our tools"
  />
</section>
```

### In Footer
```tsx
<footer>
  <WaitlistForm
    variant="compact"
    title="Stay Updated"
    placeholder="Enter email for updates"
    buttonText="Subscribe"
  />
</footer>
```

### In Modal
```tsx
<Modal>
  <WaitlistForm
    title="Don't Miss Out"
    subtitle="Join the waitlist for exclusive updates"
    onSubmit={handleNewsletterSignup}
  />
</Modal>
```

## Development

To test the component locally:

1. Start the development server: `yarn start`
2. Visit: `http://localhost:3000/waitlist`
3. Test all variants and interactions

## Notes

- The component includes the `"use client"` directive for client-side interactivity
- Default behavior logs submissions to console if no `onSubmit` handler is provided
- Form validation happens on submit, not on blur/change for better UX
- Success state can be reset to allow multiple submissions