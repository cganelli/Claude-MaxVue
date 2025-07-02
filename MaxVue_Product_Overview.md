
# MaxVue Product Overview

---

## 🧭 Purpose / Vision

MaxVue is a mobile app designed to help adults with presbyopia (age-related farsightedness) see clearly **without reading glasses**. By simulating optical correction through a personalized blur filter, MaxVue overlays dynamic visual adjustments directly onto on-screen content.

## 🧩 Why Built-In Accessibility Settings Aren’t Enough

Most smartphones offer basic accessibility features—such as zoom, magnifier, or text scaling—but these have major limitations for people with presbyopia:

- **They don't correct for visual focus.**
  - Magnification increases size, but it does not help a user *focus* the text without glasses.
- **Not content-aware.**
  - These features apply globally and often clip or distort app layouts. MaxVue intelligently adjusts just the text/visual areas.
- **Inefficient workflows.**
  - Built-in tools require repeated gestures (e.g. pinch zoom) that interrupt the reading experience. MaxVue is persistent and automatic.
- **They require vision to set up.**
  - Ironically, activating accessibility options often requires navigating tiny menus—something hard to do if you can’t see clearly.

MaxVue is designed specifically to simulate vision correction optically—*not just magnify*—and requires no manual resizing or layout adjustment by the user. It’s the difference between putting on glasses vs. zooming into a blurry page.

---

## 🏗️ Technical Architecture

**Platform:** Built using [Bolt.new](https://bolt.new)

**Storage & State Management:**

- `localStorage` for calibration values, prescription data, toggle states
- Conditional rendering based on localStorage flags (e.g., `correction_enabled`)

**Visual Logic:**

- Blur correction applied via CSS `filter: blur(Xpx)`
- Blur value is dynamically calculated using logic in `useVisionCorrection.ts`

**CI/CD & Deployment:**

- CI/CD via GitHub Actions
- Deployed on Netlify
- Custom domain from Entri.com

**Voice & Accessibility:**

- ElevenLabs for voice command toggle & feedback
- Enlarged slider/buttons for non-glasses users

**Subscriptions:**

- RevenueCat SDK integration
- Plans: Free, Monthly, Annual, Lifetime

---

## ✅ What’s Been Built

**Public Pages:**

- Landing Page
- FAQs
- Privacy Policy
- Terms & Conditions

**App Screens (Screenshots not embedded in Markdown):**

1. Registration
2. Login
3. Rx Setup
4. Enter Prescription
5. Eye Test
6. Homepage
7. Settings
8. More
9. Select Plan
10. Modals: Forgot Password, Plan Confirm, Delete Account, Voice Overlay, Vision On

---

## 🧠 Vision Calibration & Blur Logic (Extended)

### Calibration Methods

1. **Manual Rx Input**
   - Fields: Sphere (OD/OS), Cylinder (optional), Axis (optional)
   - Stored in localStorage with keys: `rx_sphere_od`, etc.

2. **Simulated Eye Test**
   - Slider adjusts blur until sentence appears in focus
   - Result saved as `"calibration_level"`

### Blur Logic

```ts
const blurValue = Math.max(0, calibrationLevel - correctionThreshold);
```

- Blur applied with:

```css
filter: blur(${blurValue}px);
```

- Only `.vision-adjustable` containers are affected

### Example Tables

**Calibration = +3.50D**

| Prescription (D) | Blur (px) |
|------------------|-----------|
| +0.00D           | 3.50px    |
| +0.25D           | 3.25px    |
| +0.50D           | 3.00px    |
| +0.75D           | 2.75px    |
| +1.00D           | 2.50px    |
| +1.25D           | 2.25px    |
| +1.50D           | 2.00px    |
| +1.75D           | 1.75px    |
| +2.00D           | 1.50px    |
| +2.25D           | 1.25px    |
| +2.50D           | 1.00px    |
| +2.75D           | 0.75px    |
| +3.00D           | 0.50px    |
| +3.25D           | 0.25px    |
| +3.50D           | 0.00px    |

**Calibration = +2.00D**

| Prescription (D) | Blur (px) |
|------------------|-----------|
| +0.00D           | 2.00px    |
| +0.25D           | 1.75px    |
| +0.50D           | 1.50px    |
| +0.75D           | 1.25px    |
| +1.00D           | 1.00px    |
| +1.25D           | 0.75px    |
| +1.50D           | 0.50px    |
| +1.75D           | 0.25px    |
| +2.00D to +3.50D | 0.00px    |

---

## 📊 Diagrams

**Vision Correction Activation Flow**  
`[Insert vision calibration diagram image here]`

**Technical Architecture**  
`[Insert architecture diagram image here]`

---

Replace image placeholders with hosted URLs if you plan to render this `.md` on a website or in a GitHub repo.
