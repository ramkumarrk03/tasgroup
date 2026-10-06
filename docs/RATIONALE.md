# Design rationale

## The pitch in one line

TAS is the hand on the quay that moves the world's cargo. The site turns a dated corporate brochure into a **harbour command centre with an industrial-poster soul**. It shows that a 1978 Penang stevedoring company is now a multimodal group with reach into the Gulf, the Red Sea and East Africa.

## Brand strategy

- **Story spine, "From the quay to the world":** every section steps further out, from one berth (hero), to licences, to the network, to the modes, then back to the quay to show how the work is done.
- **Specific over generic.** Copy names ports, licences, truck counts and warehouse locations, so there is no "synergy" language. Every fact comes from tasgroup.com.my, and the one single-source fact (TAS Maritime, 2006) is labelled on the page.
- **Honest about the fleet.** TAS owns tugs, barges and passenger boats, so those are drawn as TAS (the "TAS MARINE" tug, the real TAS Marine 102 photo). Ocean ships appear only as *calling vessels* being worked at the berth, never as "our fleet".
- **Honest about prices.** The calculator shows a relative band and a rough window, a stamp says "NOT A PRICE", and the only CTA is "Request firm quote".

## Typography

| Face | Role | Why |
|---|---|---|
| **Barlow Condensed 800** | Display, uppercase, 0.86 leading | Derived from highway and road signage. It reads like hull lettering and dock signs, and holds up at 12rem. |
| **Saira Stencil** | Codes, section numbers, "EST. 1978", company names on containers | The stencil cut of container markings. Used sparingly so it reads as a label rather than decoration. |
| **JetBrains Mono** | Coordinates, port codes, tickets, tally boards | A data voice like AIS readouts or B/L fields, with tabular figures for counters. |
| **Barlow** | Body | The same family as the display face, so the system stays coherent, and it reads well at 15–18px. |

## Colour

| Token | Hex | Decision |
|---|---|---|
| Harbour night | `#0A1A26` | The base: a harbour before dawn. Dark keeps the orange routes as the brightest thing on screen. |
| Deep sea | `#12324A` | Map ocean and the explorer "engine room". |
| International orange | `#FF5A1F` | The maritime safety colour, used for CTAs, routes and the landed container. One accent, used with intent. |
| Corten rust | `#A4462A` | Containers and stamps on paper. |
| Hull white | `#EEF1F0` | Text on dark; the "paper" for credentials, port-ops blueprint and tickets. |
| Steel | `#8C99A1` | Grids, metadata and labels. AA on night (≈6.3:1). |
| Signal yellow | `#F2C230` | Rare: quay edge, hazard stripes, active port, form errors. |

- Light "paper" sections (credentials, port ops, ticket) alternate with the dark harbour so the long scroll has rhythm without needing card grids.
- There are no SaaS gradients or glassmorphism. The only gradient is the dawn glow on the horizon.

## Graphic devices

- **Signal flags (ICS)** mark each section: H(arbour), C(redentials), N(etwork), E(xplorer), P(ort), T(imeline), G(roup), Q(uote). The footer spells **T-A-S** in flags.
- **Plimsoll / draft marks** form a scroll-progress gauge on the right edge, and draft marks also sit on the hull drawings.
- **Chart grid and coordinates** run behind every dark section, with real lat/lon on the map.
- **Container anatomy** (corrugation, corner castings, stencil codes) appears on the timeline, group stack and hero box.
- **Rubber stamps** with an ink-erosion SVG filter for licences and the quote ticket.

## Signature interactions

1. **Harbour hero.** A GSAP timeline: the spreader hoists a box off the moored vessel, the trolley travels the boom, and the box lowers onto the stack. The landing thuds (2px scene drop) and the stencil reveals in 8 steps, as if being sprayed. Ambient motion: drifting vessel, TAS tug, AIS targets, swell lines, and a blinking lighthouse and aviation lights. *Why:* it shows "1978, on the quay" in a single gesture before any text is read.
2. **Trade Route Map.** Routes follow real sea lanes through waypoints (Malacca, south of Sri Lanka, Comorin, Hormuz, Bab-el-Mandeb, Suez approaches) so they don't cut across land. The map **zooms out from Penang** as it scrolls in, carrying the hero's story forward. Region and mode filters, a port card with "Quote to …", and a full port list double as the accessible alternative. *Why:* it turns the old site's dry port table into the centrepiece.
3. **Capability Explorer.** An engine-order telegraph lever (FULL / HALF / SLOW AHEAD) works as a three-way radio group. Switching slides the whole scene sideways with crane easing and swaps the real services, licences and offices, with a four-step "how your cargo moves" track. *Why:* a nautical object people want to touch, which does the job of a tab bar.
4. **Quote Calculator.** A B/L ticket prints top to bottom (clip-path), band bars rise, and the "INDICATIVE DEMO ESTIMATE · NOT A PRICE" stamp slams in last. The ticket carries the reference into a prefilled enquiry form. *Why:* it shows how the real service would feel without promising rates.
5. **Port Operations.** A blueprint section drawing of the berth with six numbered service points, mirrored by a keyboard tab list. *Why:* it turns a long list of 15+ marine services into a picture of where each one happens.
6. **Timeline.** A sticky horizontal quay. Boxes drop and **bridge-stack** like real container stacking as you scroll. *Why:* growth is shown as a physical stack.
7. **Group stack.** Six containers land bottom-first (Ganu Jaya, then Holdings on top), each with its registration number. *Why:* the corporate structure becomes a yard stack instead of an org chart.

## Motion language: heavy, confident, tidal

- One easing family: `cubic-bezier(0.7, 0, 0.2, 1)` (slow lift, firm stop). No springs and no overshoot anywhere.
- Stamps use a hard ease-in "slam" (0.3s). Counters roll on per-digit drums like a mechanical tally board.
- Ambient loops are long (70–140s drifts, 14s swell) so the page breathes rather than fidgets.
- **Performance:** ambient CSS/SMIL animation pauses off-screen via IntersectionObserver (`data-paused`, `svg.pauseAnimations()`). Coastlines are pre-rendered to SVG paths at build time (`scripts/build-geo.ts`), so no TopoJSON is parsed in the browser.
- **Reduced motion:** the crane starts in its landed state, routes are drawn statically with no moving icons or zoom, the lever and mode switches are instant, the timeline becomes a static vertical stack, and stamps appear in place.

## Accessibility

- Skip link, visible focus (signal-yellow outline), labelled form fields and inline error messages.
- The map has a full port list (buttons) as a keyboard alternative. The telegraph is a `radiogroup` with arrow-key support. Port ops uses `tablist`/`tabpanel`.
- Text contrast is AA: hull on night ≈ 15:1, steel on night ≈ 6.3:1, night on orange ≈ 5.9:1.

## Decision log

- Built as the actual site, not a "concept", per the brief; `noindex, nofollow` is set in metadata.
- Real photos are used only where they show TAS operations (tug, barge, project lift, trucks, warehouse). Stock imagery on the source site (globes, handshake-style staff photos) was rejected.
- Office count shown as 5 (Penang, Port Klang, KLIA, Langkawi, Singapore), from the official contact list.
- The air mode draws arcs from KLIA as *reach*, labelled "not scheduled flights", because TAS forwards air cargo but does not operate aircraft.
- Land routes are offered only within the peninsula, to Singapore and inland from Karachi (Afghanistan, per the WINWIN list). The calculator explains this instead of failing silently.
- The quote outputs a band and window rather than a currency figure, following the "never show a real-looking price" rule.
- Distances on port cards are great-circle nautical miles, marked "for orientation only".
