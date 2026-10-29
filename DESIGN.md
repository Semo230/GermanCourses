---
name: Deutsch mit Asmaa
description: A warm, personal Arabic (RTL) site for Frau Asmaa's German lessons, built on Oxblood and Warm Sand.
colors:
  oxblood: "#8b1a1a"
  oxblood-deep: "#6b1212"
  warm-sand: "#f5ecdd"
  sand-edge: "#e8d9bf"
  card-white: "#ffffff"
  ink-brown: "#3a2a1f"
  muted-umber: "#6e5a4a"
  whatsapp-green: "#0f7a40"
  success-mint: "#e7f6ec"
  success-green: "#1e6b3a"
  alert-blush: "#fbe9e9"
  amber-wash: "#fdf3dc"
  amber-ink: "#7a4b00"
typography:
  display:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontSize: "clamp(2rem, 7vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1.2
  headline:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontSize: "clamp(1.7rem, 6vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.3
  section:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontSize: "clamp(1.5rem, 5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.5
  title:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.5
  body:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.8
  body-card:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 600
    lineHeight: 1.8
  label:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.8
  small:
    fontFamily: "Cairo, Segoe UI, Tahoma, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.6
rounded:
  sm: "12px"
  md: "18px"
  lg: "36px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  gutter: "16px"
  card-x: "22px"
  card-y: "28px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.card-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.oxblood-deep}"
    textColor: "{colors.card-white}"
  button-ghost:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.oxblood}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 28px"
  button-ghost-hover:
    backgroundColor: "{colors.warm-sand}"
    textColor: "{colors.oxblood}"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp-green}"
    textColor: "{colors.card-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  hero-cta:
    backgroundColor: "{colors.warm-sand}"
    textColor: "{colors.oxblood}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 30px"
  hero-cta-hover:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.oxblood}"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-brown}"
    rounded: "{rounded.md}"
    padding: "28px 22px"
  input:
    backgroundColor: "{colors.warm-sand}"
    textColor: "{colors.ink-brown}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "48px"
  input-focus:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-brown}"
  badge:
    backgroundColor: "{colors.warm-sand}"
    textColor: "{colors.ink-brown}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "2px 12px"
  badge-new:
    backgroundColor: "{colors.alert-blush}"
    textColor: "{colors.oxblood}"
  badge-progress:
    backgroundColor: "{colors.amber-wash}"
    textColor: "{colors.amber-ink}"
  badge-done:
    backgroundColor: "{colors.success-mint}"
    textColor: "{colors.success-green}"
  level-circle:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.oxblood}"
    rounded: "{rounded.pill}"
    size: "72px"
---

# Design System: Deutsch mit Asmaa

## Overview

**Creative North Star: "The Warm Classroom"**

The site should feel like Frau Asmaa's own classroom: warm sand-coloured paper on every page, oxblood used the way a teacher uses a red pen (headings, underlines, the one thing to press), and her sticker mascot greeting visitors. It speaks to parents, school students and adult beginners at once, so it is welcoming without being childish and clear without being corporate. Everything reads right to left in Arabic, with German and Latin names held left to right inside it.

Components are **clear and confident**. There is one obvious action per area, in solid oxblood or, when the action is "talk to her", WhatsApp green. Edges are firm and states are decisive. Depth is **flat by default**: white surfaces sit on the sand and are separated by tone and thin sand-edge lines, not floating shadows. Warmth comes from the colours, the rounded forms, Cairo's friendly letterforms and the mascot, not from effects.

Density is relaxed on public pages (generous section spacing, one column on phones) and tighter but still touch-friendly on the student account and the admin dashboard, where the job is scanning bookings and acting fast.

**Key Characteristics:**
- Arabic RTL first, mobile first, one 960px column.
- Two hues only: Oxblood for the brand and actions, WhatsApp green for "contact her". Everything else is sand, white and brown ink.
- Pill-shaped buttons, 18px cards, 12px fields, and a burgundy header whose bottom corners curve away (36px).
- Flat surfaces separated by tone. Shadows only on things that genuinely float.
- Status is always a word in a tinted pill, never colour alone.

## Colors

A warm, low-key palette of sand, brown ink and white, with one strong oxblood accent and a WhatsApp green reserved for contact.

### Primary
- **Oxblood** (`oxblood`): the brand. The header background (under the cover photo), section headings and their underline bar, primary buttons, focus rings, links, the start-side bar on service and course cards, and level badges. It is also the error text colour, so destructive and error states read as "the teacher's red pen".
- **Oxblood Deep** (`oxblood-deep`): hover and pressed state of oxblood buttons, and the dark end of the header gradient.

### Secondary
- **WhatsApp Green** (`whatsapp-green`): only for WhatsApp actions (the main WhatsApp button, the floating phone button, the "send result" and "message student" buttons). It is darker than WhatsApp's own green so white text reaches 5.4:1.

### Neutral
- **Warm Sand** (`warm-sand`): the page background, and the fill of inputs, option buttons and list rows inside white cards.
- **Sand Edge** (`sand-edge`): input and option borders, dividers, progress tracks, and the brand subtitle on the burgundy header.
- **Card White** (`card-white`): cards, form cards, the focused input fill and text on oxblood.
- **Ink Brown** (`ink-brown`): body text. A warm brown-black instead of grey or pure black.
- **Muted Umber** (`muted-umber`): secondary text such as dates, hints, captions, the footer and score totals.

### Status tints
Used only as pill and panel backgrounds, always with their paired ink:
- **Success Mint** with **Success Green**: correct quiz answers, "sent", the done statuses (اتسجّل، اتردّ عليها، نشط).
- **Alert Blush** with Oxblood: wrong answers, errors, and the "new / needs attention" statuses (جديد، جديدة).
- **Amber Wash** with **Amber Ink**: in-progress statuses (اتواصلنا، "invited", "email not confirmed", "email not sent").

### Named Rules
**The Two Voices Rule.** Oxblood is the brand and the primary action, and WhatsApp green means "talk to Frau Asmaa". No third accent hue joins them. New UI chooses between these two or stays neutral.

**The Red-Pen Rule.** Oxblood marks what matters: the heading, the one primary button, the active tab. If a screen has three oxblood buttons, two of them should be ghost buttons.

## Typography

**Display Font:** Cairo (with Segoe UI, Tahoma, sans-serif)
**Body Font:** Cairo (same family)

**Character:** a single family carries everything. Cairo's rounded Arabic and Latin forms are friendly at 400 and assertive at 800, so the hierarchy comes from weight and size, never from a second typeface. It is self-hosted through `next/font` in weights 400, 600, 700 and 800.

### Hierarchy
- **Display** (`display`): the brand name in the home header only, set left to right, with the surname at 0.45em in Sand Edge underneath.
- **Headline** (`headline`): the page title in the compact header of inner pages (quiz, lesson, sign-in, account, admin).
- **Section** (`section`): section headings, centred on public pages in Oxblood with a 56×4px Oxblood bar beneath. On account and admin pages they are start-aligned at 1.5rem / 800 without the bar.
- **Title** (`title`): card titles (course names, student names, booking names).
- **Body** (`body`): running text at 1rem with a generous 1.8 line height for Arabic. Card copy uses `body-card` (1.08rem / 600).
- **Label** (`label`): form labels, buttons, tabs and filter pills.
- **Small** (`small`): hints, dates, badges, captions and the footer (0.9–0.95rem). Never smaller.

### Named Rules
**The One Family Rule.** Cairo only. Hierarchy is made with weight (400 → 800) and size, never with a new font.

**The Left-to-Right Island Rule.** German, Latin names, emails, phone numbers and scores sit in their own LTR island (`<bdi>`, `dir="ltr"`, `lang="de"`), so they never scramble inside Arabic sentences.

## Layout

- **One centred column:** at most 960px wide, with 16px side gutters (`gutter`). Forms and the quiz narrow to 620px, and the account page to 720px.
- **Mobile first, one breakpoint:** 640px. Below it everything stacks into one column. At 640px and above, services, courses, admin course cards and paired radio options go to two columns, and the about block puts the 240px photo beside the text.
- **Rhythm:** public sections start 56px apart (`section`), and inner pages begin their content 40px below the header. Cards pad 28px top and bottom and 22px at the sides. Grids use 12–16px gaps, and list rows inside cards use 12px.
- **Headers:**
  - The home header is a tall burgundy block with the cover photo under an oxblood gradient, centred content and 36px rounded bottom corners.
  - Inner pages use the same header, shorter (28px top, 48px bottom), with a row of links at the top: home on the start side, account on the end side.
  - The admin tab bar overlaps the header's bottom edge.
- **Phones:** the WhatsApp button floats in the bottom-left corner (the end side in RTL), clear of the safe area, and the footer pads 96px at the bottom so nothing hides under it.
- **Touch targets:** at least 44px for links and buttons, and 48px for fields and radio rows.

## Elevation & Depth

**Flat by default** (direction confirmed 2026-10-29). Surfaces are separated by tone (white on sand, sand rows inside white cards) and by 1.5px Sand Edge lines. Shadows are reserved for elements that genuinely float above the page: the floating WhatsApp button, pills and level circles laid over the header photo, and the drop shadows under the mascot stickers.

The home page, quiz and lesson still have their original soft, oxblood-tinted card shadows. `SPEC-2.md` freezes the home page design, so those shadows stay until Frau Asmaa approves a change. Don't copy them onto new surfaces.

### Shadow Vocabulary
- **Floating action** (`box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25)`): the floating WhatsApp button.
- **On-photo lift** (`box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2)`): the header CTA pill and the A1/A2 level circles over the cover photo.
- **WhatsApp glow** (`box-shadow: 0 6px 16px rgba(15, 122, 64, 0.35)`, hover `0 10px 22px rgba(15, 122, 64, 0.4)`): the main WhatsApp button only.
- **Sticker drop** (`filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.3))`): the mascot, plus a smaller oxblood-tinted drop under the section stickers.
- **Legacy card shadow** (`0 6px 20px rgba(107, 18, 18, 0.08)`): home, quiz and lesson cards only, kept under SPEC-2.

### Named Rules
**The Flat Desk Rule.** Cards rest flat on the sand. A new surface gets a white fill and, if it needs an edge, a 1.5px Sand Edge border. It never gets a resting shadow.

**The Warm Shadow Rule.** Where a shadow is allowed, it is soft and either warm (oxblood or WhatsApp tinted) or a plain dark under a floating object. Never a grey card shadow.

## Shapes

Rounded and friendly, in four steps:
- **Pills** (`pill`) for every button, badge, filter and level label.
- **18px cards** (`md`).
- **12px fields** (`sm`), also used for quiz options, status panels and list rows.
- **36px** (`lg`) only for the curve at the bottom of the burgundy header.

Level badges in the header are full circles. Service and course cards carry a 5px Oxblood bar on their start edge (right in RTL) or along their top. The about photo is cut flat at the bottom with a 5px Oxblood line, like a framed portrait.

## Components

### Buttons
- **Shape:** always pill-shaped (`pill`), weight 700, in the inherited Cairo font.
- **Primary:** solid Oxblood with white text (12px 32px), and full width (14px tall padding) as the form submit. Hover goes to Oxblood Deep. While a form is sending, the button is disabled at 60% opacity and its label changes ("جارٍ الإرسال…").
- **Ghost:** white with an Oxblood 1.5px outline and Oxblood text (10px 28px). Hover fills Warm Sand. Use it for secondary actions beside a primary one (retake, hide, save status).
- **WhatsApp:** WhatsApp green with white text and the WhatsApp glyph (14px 32px). Its hover lifts 2px, except under reduced motion.
- **On the header:** the CTA is a Warm Sand pill with Oxblood text that turns white on hover. Header links are outlined in 50–60% white and fill with 14% white on hover.
- **Text link button:** underlined Oxblood at 700 weight, for "retake", "resend" and "sign out".
- **Focus:** a 3px Oxblood outline with a 3px offset, white on the burgundy header.

### Cards / Containers
- **Corner style:** 18px (`md`).
- **Background:** Card White on Warm Sand. Inner rows use Warm Sand with 12px corners.
- **Shadow strategy:** flat (see Elevation). Only the legacy home, quiz and lesson cards keep their soft shadow.
- **Signature edge:** a 5px Oxblood bar on the start edge (services) or the top (courses) marks content cards on the home page.
- **Padding:** 28px 22px (contact card 36px 22px, form card 32px 22px).

### Inputs / Fields
- **Style:** Warm Sand fill, 1.5px Sand Edge border, 12px corners, at least 48px tall. A visible label sits above in 700 weight, and a required star is shown in Oxblood.
- **Focus:** the border turns Oxblood, the fill turns white, and a 3px ring of 20% Oxblood appears.
- **Error:** an Oxblood border plus an Oxblood 600-weight message right under the field, linked with `aria-describedby`. After a failed submit, focus moves to the first error.
- **Phone, email and password fields** are typed left to right but right-aligned. Password fields have a "إظهار / إخفاء" toggle on their end side.
- **Choice groups** (student group, level, mode): large radio rows in Warm Sand with Sand Edge borders. The selected row turns white with an Oxblood border.

### Badges (status)
- **Style:** a pill with a tint and ink pair from the status tints (2px 12px, small text, never wrapping).
- **Mapping:** new means Alert Blush with Oxblood, in progress means Amber Wash with Amber Ink, done means Success Mint with Success Green, closed or neutral means Warm Sand with Ink Brown. The Arabic word is always present.

### Navigation
- **Inner-page header links:** "→ الصفحة الرئيسية · Deutsch mit Asmaa" on the start side and "حسابي / لوحة التحكم / تسجيل الدخول" on the end side, in Sand Edge, turning white on hover. They are at least 44px tall.
- **Home header:** the account link is an outlined white pill in the top end corner.
- **Admin tabs:** a white bar of four equal tabs (two columns on phones) that overlaps the header edge. The active tab is solid Oxblood with white text and `aria-current="page"`, and the others turn Warm Sand on hover.
- **Filter pills:** outlined Sand Edge pills that turn solid Oxblood when active.

### Sticker Mascot (signature)
Frau Asmaa's sticker character (8 poses, webp) is the brand's personality:
- **In the home header:** she pops in with a spring, floats gently, and changes pose with a speech bubble ("Hallo!", "Prima!") on each tap.
- **Beside section headings:** small stickers peek in, tilted, as they scroll into view.
- **After the contact form is sent:** she celebrates.

All of this motion turns off under `prefers-reduced-motion`.

### Quiz Option
A full-width 12px row in Warm Sand with a Sand Edge border. Its text is aligned to the start side, or left to right when the option is German.
- **Hover:** Oxblood border and white fill.
- **After answering:** the correct option turns Success Mint and the chosen wrong one turns Alert Blush.
- **Feedback panel:** sits under the options with a bold verdict line.

## Do's and Don'ts

### Do:
- **Do** use Warm Sand (`warm-sand`) as the page and Card White (`card-white`) for surfaces, with Ink Brown (`ink-brown`) text.
- **Do** give each area one solid Oxblood primary button, with ghost buttons for everything secondary.
- **Do** keep WhatsApp green for WhatsApp actions only.
- **Do** separate new surfaces by tone and 1.5px Sand Edge borders, not shadows (The Flat Desk Rule).
- **Do** keep pill buttons, 18px cards and 12px fields. Fields stay at least 48px tall, and links and buttons at least 44px.
- **Do** show every status as an Arabic word in a tinted pill.
- **Do** wrap German, names in Latin letters, emails, phone numbers and scores in LTR islands.
- **Do** honour `prefers-reduced-motion`: mascot, sticker and hover-lift motion all switch off.

### Don't:
- **Don't** introduce a third accent hue, gradients other than the header's Oxblood wash, or grey and black text colours.
- **Don't** add resting shadows to new cards, and don't use grey card shadows anywhere.
- **Don't** change the home page's look, including its existing card shadows, without Frau Asmaa's approval (`SPEC-2.md` section 3).
- **Don't** add a second typeface. Cairo carries every role.
- **Don't** set text smaller than 0.9rem or rely on placeholder text instead of a visible label.
- **Don't** signal state with colour alone.
