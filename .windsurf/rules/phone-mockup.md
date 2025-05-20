---
trigger: model_decision
description: You will read this file whenever you are working on anything related to the phone mockup UI
---

## Condensed Phone UI Components Guide (`app/components/phone/`)

---

### Core Components

**PhoneMockup.tsx**

* Renders the smartphone frame; acts as a container.
* Key props: `children`, `className`, `variant` (`default`, `fullleaf`, `fullleaf-tea`), event handlers (`onMouseEnter`, `onClick`).
* Styles: `.phone-mockup`, `.fullleaf-mockup`, `.fullleaf-tea-mockup` (in PhoneMockup.css).

**PhoneContent.tsx**

* Displays iframe or image inside the phone frame.
* Key props: `src`, `type` (`iframe`/`image`), `className`, `variant` (controls styling), `alt`, `blurDataURL`.
* For iframes: Shows an interaction message overlay on first hover/tap; only loads iframe after interaction or when in view.
* Styles for content (`.vinscribe-iframe`, `.full-leaf-app-screenshot`, etc.) set in PhoneMockup.css, controlled via `variant` or direct class.

**PhoneMockup.css**

* Holds all phone frame/content styles and variant rules. Check here when adding or updating styles.

**index.ts**

* Barrel file to export PhoneMockup and PhoneContent for easy import.

---

### Usage Example

```tsx
<PhoneMockup variant="fullleaf">
  <PhoneContent type="image" src="/full-leaf.jpg" variant="fullleaf-tea" alt="Screenshot" />
</PhoneMockup>
```

---

### Integration with ProjectCard

* ProjectCard auto-wraps iframe/image previews in PhoneMockup/PhoneContent unless `disablePhoneMockup` is true.
* Picks `variant` based on project type for styling.

---

### Style/Feature Changes Checklist

* When you add or modify variants, classes, or interactive logic in PhoneMockup or PhoneContent, update this guide and PhoneMockup.css.

---

### Key Points

* **Aspect Ratio**: Phone frame keeps smartphone shape.
* **Performance**: Iframes/images lazy load; images use blur placeholders.
* **Interactivity**: Pass event handlers for clickable/hoverable phones. Iframe message handled by PhoneContent.
* **Responsiveness**: Confirm styles work on all screen sizes.

---

**Always update this guide if you change phone UI logic, variants, or styling.**