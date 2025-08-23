import React from "react";
import Layout from "@theme/Layout";
import WaitlistForm from "@site/src/components/WaitlistForm";

import styles from "./waitlist.module.css";

export default function WaitlistDemo(): JSX.Element {
  // Example custom submit handler
  const handleWaitlistSubmit = async (email: string) => {
    // This would typically call your API
    console.log("Submitting email to waitlist:", email);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // You could also add analytics tracking here
    // track('waitlist_signup', { email });
  };

  return (
    <Layout
      title="Waitlist Form Demo"
      description="Demo page showing the WaitlistForm component in action">
      <div className={styles.container}>
        <div className={styles.section}>
          <h1>Waitlist Form Component Demo</h1>
          <p>
            This page demonstrates the WaitlistForm component in different variants and configurations.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Default Variant</h2>
          <WaitlistForm
            title="Join Our Beta Program"
            subtitle="Get early access to new features and help shape the future of Radon IDE."
            buttonText="Get Early Access"
            successMessage="Welcome to the beta program! Check your email for next steps."
            onSubmit={handleWaitlistSubmit}
          />
        </div>

        <div className={styles.section}>
          <h2>Compact Variant</h2>
          <WaitlistForm
            variant="compact"
            placeholder="Your email for updates"
            buttonText="Subscribe"
            onSubmit={handleWaitlistSubmit}
          />
        </div>

        <div className={styles.heroSection}>
          <h2>Hero Variant</h2>
          <WaitlistForm
            variant="hero"
            title="Early Access Program"
            subtitle="Be among the first to experience revolutionary React Native development tools."
            buttonText="Request Access"
            onSubmit={handleWaitlistSubmit}
          />
        </div>

        <div className={styles.section}>
          <h2>Integration Examples</h2>
          <p>The WaitlistForm component can be easily integrated into existing pages:</p>
          
          <h3>In a Hero Section</h3>
          <pre className={styles.codeBlock}>
{`<Hero>
  <h1>Revolutionary React Native Development</h1>
  <WaitlistForm
    variant="hero"
    title="Join the Revolution"
    subtitle="Get early access to game-changing features"
  />
</Hero>`}
          </pre>

          <h3>In a Footer</h3>
          <pre className={styles.codeBlock}>
{`<Footer>
  <WaitlistForm
    variant="compact"
    title="Stay Updated"
    placeholder="Enter email for updates"
    buttonText="Subscribe"
  />
</Footer>`}
          </pre>

          <h3>As a Modal</h3>
          <pre className={styles.codeBlock}>
{`<Modal>
  <WaitlistForm
    title="Don't Miss Out"
    subtitle="Join thousands of developers already using Radon IDE"
    onSubmit={handleNewsletterSignup}
  />
</Modal>`}
          </pre>
        </div>
      </div>
    </Layout>
  );
}