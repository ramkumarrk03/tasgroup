# Wireframes & user journey

Story spine: **From the quay to the world.** The home page reads top to bottom as a zoom-out, from one berth in Butterworth to dozens of ports. It ends at a quote desk.

## Primary journeys

1. **"Can TAS move my cargo there?"** Hero → Trade Route Map → tap a port → *Quote to {port}* → `/quote?to={port}` (destination prefilled) → ticket → *Request firm quote* → `/contact?ref=…` (enquiry prefilled).
2. **"What can TAS actually do?"** Hero → Capability Explorer (Ocean / Air / Land lever) → Port Operations diagram → Group stack.
3. **"Is this company legitimate and established?"** Credentials stamps → Timeline 1978 → today → Group companies with registration numbers → Offices.

## Home `/`

```
┌──────────────────────────────────────────────────────────────┐
│ NAV  [TAS EST.1978]  PENANG 05°24′N · LT   links   [GET A QUOTE] │
├──────────────────────────────────────────────────────────────┤
│ 01 HARBOUR HERO (100svh)                                      │
│  FROM THE QUAY            ┌ crane boom ─────────────┐         │
│  TO THE WORLD.            │  trolley ▼ container    │         │
│  sub copy                 │  lands → "TAS·EST.1978" │         │
│  [Get quote] [Network ↓]  └ vessel · tug · AIS dots ┘         │
│  ▌HQ BUTTERWORTH · 5 OFFICES · SEA/AIR/LAND                   │
├──────────────────────────────────────────────────────────────┤
│ 02 CREDENTIALS (light paper)  ◎MTO ◎PPC ◎JKDM ◎SHIP ◎MOF       │
├──────────────────────────────────────────────────────────────┤
│ 03 TRADE ROUTE MAP                                           │
│  [All|SE Asia|Subcont.|Mid East|Africa]   [Ocean][Air][Land]  │
│  ┌──────────── map (zooms out on scroll) ───────┐ ┌ port card ┐│
│  │ routes draw from Penang, icons travel        │ │ code/name ││
│  └──────────────────────────────────────────────┘ │ role/CTA  ││
│                                                   │ port list ││
│  tally: ports · countries · offices · modes       └───────────┘│
├──────────────────────────────────────────────────────────────┤
│ 04 CAPABILITY EXPLORER (deep navy, corrugated)               │
│  ┌ telegraph lever ┐   ┌ scene (ship / plane / truck) ──┐     │
│  │ OCEAN AIR LAND  │   └──────────────── photo card ─────┘     │
│  credentials, offices  headline · intro │ numbered services   │
│                        how your cargo moves: 1──2──3──4        │
├──────────────────────────────────────────────────────────────┤
│ 05 PORT OPS (blueprint)  harbour section drawing with ①–⑥     │
│                          + tab list        │ dark detail panel │
├──────────────────────────────────────────────────────────────┤
│ 06 TIMELINE (sticky, horizontal on desktop)                  │
│   boxes drop onto the quay wall as you scroll: 1978 → NOW     │
├──────────────────────────────────────────────────────────────┤
│ 07 GROUP   headline + copy │ six-container yard stack         │
├──────────────────────────────────────────────────────────────┤
│ 08 QUOTE CTA (orange) "MOVE SOMETHING WITH US." + ticket      │
│    OFFICES strip: 5 desks with live local time + phone        │
├──────────────────────────────────────────────────────────────┤
│ FOOTER  Delivering solutions · email · links · flags T-A-S    │
└──────────────────────────────────────────────────────────────┘
```

## `/quote`

Desktop: a five-fieldset console on the left (Route → Mode → Cargo → Size → Options) and a sticky ticket on the right.
Mobile: a step-by-step flow with draft-mark progress, Back/Next buttons, and the ticket below the form.

Ticket: B/L header with a reference, POL → POD, a route preview chart, mode/cargo/chargeable/distance, a **relative cost band (1–5)**, an **indicative ETA window**, a handling list, the "INDICATIVE DEMO ESTIMATE · NOT A PRICE" stamp, and **Request firm quote →** `/contact`.

## `/contact`

Mini map of Peninsular Malaysia and Singapore with the five offices on the left; office cards with address, phone, local time and directions on the right. Below that, a mock enquiry form, prefilled from a quote ticket when there is one, which shows a "Received" stamp on submit.

## `/network`

Full-page Trade Route Map with no scroll zoom, the same filters, and the port list.

## Responsive behaviour

| Width | Behaviour |
|---|---|
| 360–767 | Hero scene anchored to the lower 58% of the screen, with copy above. The map pans horizontally with a "drag to pan" hint and the port list below. Explorer, port ops and the group stack are stacked. The timeline is a vertical stack. The quote is a step-by-step flow. |
| 768–1023 | The map fits its width. The port card and list sit side by side under the map. |
| 1024–1279 | The timeline becomes a sticky horizontal track. The quote shows all steps at once with the sticky ticket. |
| 1280+ | The map gets a side panel (card + list). The port-ops panel sits beside the diagram. |
